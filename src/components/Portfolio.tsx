'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getMainContract, formatCUSD } from '@/lib/web3';

interface PortfolioProps {
  address: string | null;
  signer: ethers.Signer | null;
}

export default function Portfolio({ address, signer }: PortfolioProps) {
  const [stats, setStats] = useState({
    totalLent: '0',
    impactPoints: 0,
    badgeLevel: 0,
    badgeName: 'New'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address) {
      loadPortfolio();
    }
  }, [address]);

  async function loadPortfolio() {
    if (!address) return;
    setLoading(true);
    
    try {
      const contract = getMainContract();
      const [totalLent, impactPoints, badgeLevel] = await Promise.all([
        contract.totalLent(address),
        contract.impactPoints(address),
        contract.badgeLevel(address),
      ]);
      
      const badgeName = await contract.getBadgeName(badgeLevel);
      
      setStats({
        totalLent: formatCUSD(totalLent),
        impactPoints: Number(impactPoints),
        badgeLevel: Number(badgeLevel),
        badgeName
      });
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setLoading(false);
    }
  }

  const badgeEmoji = ['🆕', '🥉', '🥈', '🥇', '💎'][stats.badgeLevel] || '🆕';

  if (!address) {
    return (
      <div className="glass rounded-3xl p-10 text-center">
        <p className="text-6xl mb-4">🔗</p>
        <h2 className="text-2xl font-bold text-white mb-2">Connect Wallet</h2>
        <p className="text-white/70">Connect your wallet to view your lending portfolio</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass rounded-3xl p-10 text-center">
        <p className="text-6xl mb-4 animate-spin">⏳</p>
        <p className="text-white">Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">💼 My Lending Portfolio</h2>
      
      {/* Badge */}
      <div className="text-center mb-8">
        <div className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-300 
to-orange-500 text-black font-bold text-lg">
          {badgeEmoji} {stats.badgeName}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-black/20 rounded-2xl p-6 text-center">
          <p className="text-white/60 mb-1">Total Lent</p>
          <p className="text-3xl font-bold 
text-yellow-300">${parseFloat(stats.totalLent).toLocaleString()}</p>
        </div>
        <div className="bg-black/20 rounded-2xl p-6 text-center">
          <p className="text-white/60 mb-1">Impact Points</p>
          <p className="text-3xl font-bold 
text-green-400">{stats.impactPoints.toLocaleString()}</p>
        </div>
        <div className="bg-black/20 rounded-2xl p-6 text-center">
          <p className="text-white/60 mb-1">Badge Level</p>
          <p className="text-3xl font-bold text-purple-400">{stats.badgeLevel}/4</p>
        </div>
      </div>

      {/* Badge Progress */}
      <div className="bg-black/20 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Badge Progress</h3>
        <div className="space-y-3">
          {[
            { name: 'Bronze', threshold: 10, emoji: '🥉' },
            { name: 'Silver', threshold: 50, emoji: '🥈' },
            { name: 'Gold', threshold: 250, emoji: '🥇' },
            { name: 'Platinum', threshold: 1000, emoji: '💎' },
          ].map((badge, i) => {
            const progress = Math.min((parseFloat(stats.totalLent) / badge.threshold) * 100, 
100);
            const achieved = stats.badgeLevel > i;
            
            return (
              <div key={badge.name} className="flex items-center gap-3">
                <span className="text-2xl">{badge.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className={achieved ? 'text-yellow-300' : 
'text-white/60'}>{badge.name}</span>
                    <span className="text-white/60">${badge.threshold}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${achieved ? 
'bg-yellow-300' : 'bg-white/30'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                {achieved && <span className="text-green-400">✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
