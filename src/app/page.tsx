'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getMainContract, getReadOnlyProvider, connectWallet, formatCUSD, parseCUSD, 
getCUSDContract, MAIN_CONTRACT } from '@/lib/web3';
import Header from '@/components/Header';
import BorrowerCard from '@/components/BorrowerCard';
import Portfolio from '@/components/Portfolio';
import LendModal from '@/components/LendModal';
import ApplyModal from '@/components/ApplyModal';

interface Borrower {
  id: number;
  name: string;
  location: string;
  business: string;
  story: string;
  photo: string;
  requested: bigint;
  funded: bigint;
  active: boolean;
}

export default function Home() {
  const [address, setAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'browse' | 'portfolio' | 'apply'>('browse');
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null);
  const [showLendModal, setShowLendModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [stats, setStats] = useState({ totalFunded: '0', borrowerCount: 0 });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const contract = getMainContract();
      const count = await contract.borrowerCount();
      const totalLoans = await contract.totalLoansValue();
      
      setStats({
        totalFunded: formatCUSD(totalLoans),
        borrowerCount: Number(count)
      });

      const borrowerList: Borrower[] = [];
      for (let i = 1; i <= Number(count); i++) {
        try {
          const [name, location, business, story, photo, requested, funded, active] = await 
Promise.all([
            contract.getName(i),
            contract.getLocation(i),
            contract.getBusiness(i),
            contract.getStory(i),
            contract.getPhoto(i),
            contract.requestedAmounts(i),
            contract.fundedAmounts(i),
            contract.isActive(i),
          ]);
          
          if (active) {
            borrowerList.push({ id: i, name, location, business, story, photo, requested, 
funded, active });
          }
        } catch (e) {
          console.error(`Error loading borrower ${i}:`, e);
        }
      }
      
      setBorrowers(borrowerList);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleConnect() {
    try {
      const walletSigner = await connectWallet();
      const addr = await walletSigner.getAddress();
      setSigner(walletSigner);
      setAddress(addr);
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to connect wallet');
    }
  }

  async function handleLend(borrowerId: number, amount: string) {
    if (!signer) {
      alert('Please connect wallet first');
      return;
    }

    try {
      const cusd = getCUSDContract(signer);
      const amountWei = parseCUSD(amount);
      
      // Check allowance
      const allowance = await cusd.allowance(address, MAIN_CONTRACT);
      if (allowance < amountWei) {
        const approveTx = await cusd.approve(MAIN_CONTRACT, amountWei);
        await approveTx.wait();
      }
      
      // Lend
      const contract = getMainContract(signer);
      const tx = await contract.lend(borrowerId, amountWei);
      await tx.wait();
      
      alert('🎉 Loan successful! Thank you for your impact!');
      setShowLendModal(false);
      loadData();
    } catch (error: any) {
      console.error('Lend error:', error);
      alert(error.message || 'Transaction failed');
    }
  }

  function openLendModal(borrower: Borrower) {
    setSelectedBorrower(borrower);
    setShowLendModal(true);
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header 
          address={address} 
          onConnect={handleConnect}
          stats={stats}
        />

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'browse' 
                ? 'btn-primary' 
                : 'glass text-white hover:bg-white/20'
            }`}
          >
            🌍 Browse Borrowers
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'portfolio' 
                ? 'btn-primary' 
                : 'glass text-white hover:bg-white/20'
            }`}
          >
            💼 My Portfolio
          </button>
          <button
            onClick={() => setShowApplyModal(true)}
            className="px-6 py-3 rounded-xl font-semibold glass text-white hover:bg-white/20 
transition-all"
          >
            📝 Apply for Loan
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-bounce">🎯</div>
            <p className="text-white text-xl">Loading borrowers...</p>
          </div>
        ) : activeTab === 'browse' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {borrowers.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-white text-xl">No active borrowers yet.</p>
              </div>
            ) : (
              borrowers.map((borrower) => (
                <BorrowerCard
                  key={borrower.id}
                  borrower={borrower}
                  onLend={() => openLendModal(borrower)}
                />
              ))
            )}
          </div>
        ) : (
          <Portfolio address={address} signer={signer} />
        )}

        {/* Modals */}
        {showLendModal && selectedBorrower && (
          <LendModal
            borrower={selectedBorrower}
            onClose={() => setShowLendModal(false)}
            onLend={handleLend}
            isConnected={!!address}
            onConnect={handleConnect}
          />
        )}

        {showApplyModal && (
          <ApplyModal
            onClose={() => setShowApplyModal(false)}
            signer={signer}
            onConnect={handleConnect}
          />
        )}
      </div>
    </main>
  );
}
