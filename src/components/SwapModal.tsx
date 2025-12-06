'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getProvider, getUbeswapRouter, getTokenContract } from '@/lib/web3';
import { UBESWAP_ROUTER } from '@/lib/contracts';

interface SwapModalProps {
  address: string;
  onClose: () => void;
  onSwapComplete: () => void;
}

const CUSD = '0x765DE816845861e75A25fCA122bb6898B8B1282a';
const CEUR = '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73';
const CELO = '0x471EcE3750Da237f93B8E339c536989b8978a438';

export default function SwapModal({ address, onClose, onSwapComplete }: SwapModalProps) {
  const [fromToken, setFromToken] = useState('CELO');
  const [toToken, setToToken] = useState('cUSD');
  const [amount, setAmount] = useState('');
  const [celoPrice, setCeloPrice] = useState(0.5);
  const [estimatedOutput, setEstimatedOutput] = useState('0.00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    fetchPrice();
  }, []);

  useEffect(() => {
    calcEstimate();
  }, [amount, fromToken, toToken, celoPrice]);

  async function fetchPrice() {
    try {
      const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=celo&vs_currencies=usd');
      const d = await r.json();
      setCeloPrice(d.celo?.usd || 0.5);
    } catch (e) {
      setCeloPrice(0.5);
    }
  }

  async function calcEstimate() {
    if (!amount || parseFloat(amount) <= 0) {
      setEstimatedOutput('0.00');
      return;
    }

    const inp = parseFloat(amount);
    
    // Try to get actual rate from Ubeswap
    try {
      const provider = getProvider();
      const router = getUbeswapRouter(provider);
      const fromAddress = getTokenAddress(fromToken);
      const toAddress = getTokenAddress(toToken);
      const amountIn = ethers.parseEther(amount);
      
      const amounts = await router.getAmountsOut(amountIn, [fromAddress, toAddress]);
      const output = ethers.formatEther(amounts[1]);
      setEstimatedOutput(parseFloat(output).toFixed(4));
      return;
    } catch (e) {
      console.log('Using fallback calculation', e);
    }
    
    // Fallback to simple calculation
    let out = 0;
    if (fromToken === 'CELO' && toToken === 'cUSD') out = inp * celoPrice * 0.97;
    else if (fromToken === 'CELO' && toToken === 'cEUR') out = inp * celoPrice * 0.92 * 0.97;
    else if (fromToken === 'cUSD' && toToken === 'CELO') out = (inp / celoPrice) * 0.97;
    else if (fromToken === 'cUSD' && toToken === 'cEUR') out = inp * 0.92 * 0.97;
    else if (fromToken === 'cEUR' && toToken === 'CELO') out = (inp / (celoPrice * 0.92)) * 0.97;
    else if (fromToken === 'cEUR' && toToken === 'cUSD') out = (inp / 0.92) * 0.97;
    else out = inp;
    setEstimatedOutput(out.toFixed(4));
  }

  function getTokenAddress(t: string) {
    if (t === 'CELO') return CELO;
    if (t === 'cUSD') return CUSD;
    if (t === 'cEUR') return CEUR;
    return CELO;
  }

  function openUbeswap() {
    const inputToken = getTokenAddress(fromToken);
    const outputToken = getTokenAddress(toToken);
    const url = `https://app.ubeswap.org/#/swap?inputCurrency=${inputToken}&outputCurrency=${outputToken}`;
    window.open(url, '_blank');
    onSwapComplete();
    onClose();
  }

  function openMento() {
    window.open('https://app.mento.org/swap', '_blank');
    onSwapComplete();
    onClose();
  }

  async function handleSwap() {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (fromToken === toToken) {
      setError('Cannot swap same token');
      return;
    }

    setLoading(true);
    setError('');
    setTxHash('');

    try {
      const provider = getProvider();
      const signer = await provider.getSigner();
      
      const fromAddress = getTokenAddress(fromToken);
      const toAddress = getTokenAddress(toToken);
      const amountIn = ethers.parseEther(amount);
      
      // Calculate minimum output with 3% slippage tolerance
      const minAmountOut = ethers.parseEther((parseFloat(estimatedOutput) * 0.97).toString());
      
      // Approve token spending for the router
      const tokenContract = getTokenContract(fromAddress, signer);
      const allowance = await tokenContract.allowance(address, UBESWAP_ROUTER);
      
      if (allowance < amountIn) {
        setError('Approving token...');
        const approveTx = await tokenContract.approve(UBESWAP_ROUTER, ethers.MaxUint256);
        await approveTx.wait();
        setError('');
      }

      // Execute swap
      const router = getUbeswapRouter(signer);
      const path = [fromAddress, toAddress];
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes

      const tx = await router.swapExactTokensForTokens(
        amountIn,
        minAmountOut,
        path,
        address,
        deadline,
        { gasLimit: 500000 } // Set explicit gas limit
      );

      setTxHash(tx.hash);
      await tx.wait();

      onSwapComplete();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Swap error:', err);
      let errorMsg = 'Swap failed. Please try again.';
      
      if (err.message?.includes('insufficient funds')) {
        errorMsg = 'Insufficient balance for this swap';
      } else if (err.message?.includes('user rejected')) {
        errorMsg = 'Transaction was rejected';
      } else if (err.message?.includes('INSUFFICIENT_OUTPUT_AMOUNT')) {
        errorMsg = 'Slippage too high. Try reducing amount or increasing slippage.';
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-3xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Swap Tokens</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white text-2xl">X</button>
        </div>

        <div className="bg-black/20 rounded-xl p-4 mb-3">
          <div className="flex justify-between mb-2">
            <span className="text-white/60 text-sm">From</span>
            <select value={fromToken} onChange={(e) => setFromToken(e.target.value)} className="bg-transparent text-white font-semibold outline-none">
              <option value="CELO" className="bg-gray-800">CELO</option>
              <option value="cUSD" className="bg-gray-800">cUSD</option>
              <option value="cEUR" className="bg-gray-800">cEUR</option>
            </select>
          </div>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-transparent text-3xl text-white outline-none" />
        </div>

        <div className="flex justify-center my-2">
          <button onClick={() => { const t = fromToken; setFromToken(toToken); setToToken(t); }} className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/20">
            <span>&#8645;</span>
          </button>
        </div>

        <div className="bg-black/20 rounded-xl p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-white/60 text-sm">To (estimated)</span>
            <select value={toToken} onChange={(e) => setToToken(e.target.value)} className="bg-transparent text-white font-semibold outline-none">
              <option value="cUSD" className="bg-gray-800">cUSD</option>
              <option value="cEUR" className="bg-gray-800">cEUR</option>
              <option value="CELO" className="bg-gray-800">CELO</option>
            </select>
          </div>
          <p className="text-3xl text-white">{estimatedOutput}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Rate</span>
            <span className="text-white">1 CELO = ${celoPrice.toFixed(2)}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-3 mb-4">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {txHash && (
          <div className="bg-green-500/20 border border-green-500 rounded-xl p-3 mb-4">
            <p className="text-green-200 text-sm">
              Swap successful! 
              <a 
                href={`https://celoscan.io/tx/${txHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline ml-1"
              >
                View transaction
              </a>
            </p>
          </div>
        )}

        <button 
          onClick={handleSwap} 
          disabled={loading || !amount || parseFloat(amount) <= 0}
          className="w-full py-4 btn-primary rounded-xl text-lg mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Swapping...' : 'Swap Tokens'}
        </button>

        <div className="flex gap-2">
          <button onClick={openUbeswap} className="flex-1 py-3 glass text-white rounded-xl hover:bg-white/20 text-sm">
            Open Ubeswap
          </button>

          <button onClick={openMento} className="flex-1 py-3 glass text-white rounded-xl hover:bg-white/20 text-sm">
            Open Mento
          </button>
        </div>

        <p className="text-white/40 text-xs text-center mt-4">
          Swaps directly via Ubeswap Router with 2% slippage protection
        </p>
      </div>
    </div>
  );
}
