'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface HeaderProps {
  address: string | null;
  onConnect: () => void;
  stats: { totalFunded: string; borrowerCount: number };
}

const CUSD = '0x765DE816845861e75A25fCA122bb6898B8B1282a';
const CEUR = '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73';
const ABI = ['function balanceOf(address) view returns (uint256)'];

export default function Header({ address, onConnect, stats }: HeaderProps) {
  const [celo, setCelo] = useState('0');
  const [cusd, setCusd] = useState('0');
  const [ceur, setCeur] = useState('0');

  const short = address ? address.slice(0, 6) + '...' + address.slice(-4) : null;

  useEffect(() => {
    if (address) fetchBalances();
  }, [address]);

  async function fetchBalances() {
    if (!address) return;
    try {
      const p = new ethers.JsonRpcProvider('https://forno.celo.org');
      const cb = await p.getBalance(address);
      const cusdC = new ethers.Contract(CUSD, ABI, p);
      const ceurC = new ethers.Contract(CEUR, ABI, p);
      const cusdB = await cusdC.balanceOf(address);
      const ceurB = await ceurC.balanceOf(address);
      setCelo(parseFloat(ethers.formatEther(cb)).toFixed(2));
      setCusd(parseFloat(ethers.formatUnits(cusdB, 18)).toFixed(2));
      setCeur(parseFloat(ethers.formatUnits(ceurB, 18)).toFixed(2));
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <header className="mb-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">T</div>
          <div>
            <h1 className="text-4xl font-extrabold text-white">CeloQuest</h1>
            <p className="text-white/70">Gamified Micro-Lending on Celo</p>
          </div>
        </div>
        <button onClick={onConnect} className={`px-6 py-3 rounded-xl font-semibold transition-all ${address ? 'glass text-white' : 'btn-primary'}`}>
          {short || 'Connect Wallet'}
        </button>
      </div>
      {address && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass rounded-2xl p-4 text-center">
            <p className="text-white/70 text-sm mb-1">CELO</p>
            <p className="text-2xl font-bold text-yellow-300">{celo}</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <p className="text-white/70 text-sm mb-1">cUSD</p>
            <p className="text-2xl font-bold text-green-400">{cusd}</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <p className="text-white/70 text-sm mb-1">cEUR</p>
            <p className="text-2xl font-bold text-blue-400">{ceur}</p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-5 text-center">
          <p className="text-white/70 text-sm mb-1">Total Funded</p>
          <p className="text-3xl font-bold text-yellow-300">${parseFloat(stats.totalFunded).toLocaleString()}</p>
        </div>
        <div className="glass rounded-2xl p-5 text-center">
          <p className="text-white/70 text-sm mb-1">Active Borrowers</p>
          <p className="text-3xl font-bold text-yellow-300">{stats.borrowerCount}</p>
        </div>
        <div className="glass rounded-2xl p-5 text-center">
          <p className="text-white/70 text-sm mb-1">Repayment Rate</p>
          <p className="text-3xl font-bold text-green-400">96.5%</p>
        </div>
        <div className="glass rounded-2xl p-5 text-center">
          <p className="text-white/70 text-sm mb-1">Min. Loan</p>
          <p className="text-3xl font-bold text-yellow-300">$1</p>
        </div>
      </div>
    </header>
  );
}
