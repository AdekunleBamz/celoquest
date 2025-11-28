'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface SwapModalProps {
  address: string;
  onClose: () => void;
  onSwapComplete: () => void;
}

const CUSD = '0x765DE816845861e75A25fCA122bb6898B8B1282a';
const CEUR = '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73';
const WCELO = '0x471EcE3750Da237f93B8E339c536989b8978a438';
const UBESWAP_ROUTER = '0xE3D8bd6Aed4F159bc8000a9cD47CffDb95F96121';

export default function SwapModal({ address, onClose, onSwapComplete }: SwapModalProps) {
  const [fromToken, setFromToken] = useState('CELO');
  const [toToken, setToToken] = useState('cUSD');
  const [amount, setAmount] = useState('');
  const [estimatedOutput, setEstimatedOutput] = useState('0.00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [celoPrice, setCeloPrice] = useState(0.5);

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

  function calcEstimate() {
    if (!amount || parseFloat(amount) <= 0) {
      setEstimatedOutput('0.00');
      return;
    }
    const inp = parseFloat(amount);
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
    if (t === 'CELO') return WCELO;
    if (t === 'cUSD') return CUSD;
    if (t === 'cEUR') return CEUR;
    return WCELO;
  }

  async function handleSwap() {
    if (!window.ethereum || !amount || parseFloat(amount) <= 0) return;
    if (fromToken === toToken) { setError('Same token'); return; }
    setLoading(true);
    setError('');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const amountIn = ethers.parseEther(amount);
      const minOut = ethers.parseEther((parseFloat(estimatedOutput) * 0.9).toString());
      const deadline = Math.floor(Date.now() / 1000) + 600;
      const path = [getTokenAddress(fromToken), getTokenAddress(toToken)];

      const routerAbi = [
        'function swapExactETHForTokens(uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external payable returns (uint256[] memory amounts)',
        'function swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external returns (uint256[] memory amounts)',
        'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external returns (uint256[] memory amounts)'
      ];
      const erc20Abi = ['function approve(address,uint256) returns (bool)'];
      const router = new ethers.Contract(UBESWAP_ROUTER, routerAbi, signer);

      if (fromToken === 'CELO') {
        const tx = await router.swapExactETHForTokens(minOut, path, address, deadline, { value: amountIn });
        await tx.wait();
      } else if (toToken === 'CELO') {
        const token = new ethers.Contract(getTokenAddress(fromToken), erc20Abi, signer);
        await (await token.approve(UBESWAP_ROUTER, amountIn)).wait();
        const tx = await router.swapExactTokensForETH(amountIn, minOut, path, address, deadline);
        await tx.wait();
      } else {
        const token = new ethers.Contract(getTokenAddress(fromToken), erc20Abi, signer);
        await (await token.approve(UBESWAP_ROUTER, amountIn)).wait();
        const tx = await router.swapExactTokensForTokens(amountIn, minOut, path, address, deadline);
        await tx.wait();
      }

      alert('Swap successful!');
      onSwapComplete();
      onClose();
    } catch (e: any) {
      console.error('Swap error:', e);
      setError(e.reason || e.message || 'Swap failed');
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
        {error && <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 mb-4"><p className="text-red-300 text-sm">{error}</p></div>}
        <button onClick={handleSwap} disabled={loading || !amount || parseFloat(amount) <= 0 || fromToken === toToken} className="w-full py-4 btn-primary rounded-xl text-lg disabled:opacity-50 mb-3">
          {loading ? 'Swapping...' : 'Swap'}
        </button>
        <button onClick={() => window.open('https://app.ubeswap.org/#/swap', '_blank')} className="w-full py-3 glass text-white rounded-xl hover:bg-white/20">
          Open Ubeswap
        </button>
      </div>
    </div>
  );
}
