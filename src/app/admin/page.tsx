'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getAppContract, getMainContract, connectWallet, formatCUSD, parseCUSD, CUSD_ADDRESS 
} from '@/lib/web3';

interface Application {
  id: number;
  applicant: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  business: string;
  story: string;
  amount: string;
  timestamp: number;
  status: number;
}

export default function AdminPage() {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 
'rejected'>('pending');

  useEffect(() => {
    checkOwner();
  }, [address]);

  async function checkOwner() {
    if (!address) {
      setIsOwner(false);
      return;
    }
    try {
      const contract = getAppContract();
      const owner = await contract.owner();
      setIsOwner(owner.toLowerCase() === address.toLowerCase());
      if (owner.toLowerCase() === address.toLowerCase()) {
        loadApplications();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleConnect() {
    try {
      const walletSigner = await connectWallet();
      const addr = await walletSigner.getAddress();
      setSigner(walletSigner);
      setAddress(addr);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadApplications() {
    setLoading(true);
    try {
      const contract = getAppContract();
      const count = await contract.applicationCount();
      
      const apps: Application[] = [];
      for (let i = 1; i <= Number(count); i++) {
        const [applicant, name, email, phone, location, business, story, amount, timestamp, 
status] = await Promise.all([
          contract.getApplicant(i),
          contract.getName(i),
          contract.getEmail(i),
          contract.getPhone(i),
          contract.getLocation(i),
          contract.getBusiness(i),
          contract.getStory(i),
          contract.getAmount(i),
          contract.getTimestamp(i),
          contract.getStatus(i),
        ]);
        
        apps.push({
          id: i,
          applicant,
          name,
          email,
          phone,
          location,
          business,
          story,
          amount: formatCUSD(amount),
          timestamp: Number(timestamp),
          status: Number(status),
        });
      }
      
      setApplications(apps.reverse());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(app: Application) {
    if (!signer) return;
    
    const photo = prompt('Enter photo URL for this borrower:', 
'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400');
    if (!photo) return;

    try {
      // Approve in applications contract
      const appContract = getAppContract(signer);
      const tx1 = await appContract.approveApplication(app.id);
      await tx1.wait();

      // Add to main contract
      const mainContract = getMainContract(signer);
      const amountWei = parseCUSD(app.amount);
      const tx2 = await mainContract.addBorrower(
        app.name,
        app.location,
        app.business,
        app.story,
        photo,
        amountWei,
        CUSD_ADDRESS
      );
      await tx2.wait();

      alert('✅ Application approved and borrower added!');
      loadApplications();
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Failed to approve');
    }
  }

  async function handleReject(appId: number) {
    if (!signer) return;
    if (!confirm('Are you sure you want to reject this application?')) return;

    try {
      const contract = getAppContract(signer);
      const tx = await contract.rejectApplication(appId);
      await tx.wait();
      alert('Application rejected');
      loadApplications();
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Failed to reject');
    }
  }

  const filteredApps = applications.filter(app => {
    if (filter === 'all') return true;
    if (filter === 'pending') return app.status === 0;
    if (filter === 'approved') return app.status === 1;
    if (filter === 'rejected') return app.status === 2;
    return true;
  });

  const statusBadge = (status: number) => {
    if (status === 0) return <span className="px-2 py-1 rounded-full bg-yellow-500/20 
text-yellow-300 text-xs">Pending</span>;
    if (status === 1) return <span className="px-2 py-1 rounded-full bg-green-500/20 
text-green-300 text-xs">Approved</span>;
    return <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-300 
text-xs">Rejected</span>;
  };

  if (!address) {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">
        <div className="glass rounded-3xl p-10 text-center max-w-md">
          <p className="text-6xl mb-4">👑</p>
          <h1 className="text-2xl font-bold text-white mb-4">Admin Dashboard</h1>
          <button onClick={handleConnect} className="btn-primary px-8 py-3 rounded-xl">
            🔗 Connect Wallet
          </button>
        </div>
      </main>
    );
  }

  if (!isOwner) {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">
        <div className="glass rounded-3xl p-10 text-center max-w-md">
          <p className="text-6xl mb-4">🚫</p>
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-white/70">You are not the contract owner.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">👑 Admin Dashboard</h1>
            <p className="text-white/70">Manage loan applications</p>
          </div>
          <a href="/" className="glass px-4 py-2 rounded-xl text-white hover:bg-white/20">
            ← Back to App
          </a>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === f ? 'btn-primary' : 'glass text-white hover:bg-white/20'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'pending' && ` (${applications.filter(a => a.status === 0).length})`}
            </button>
          ))}
        </div>

        {/* Applications */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-white">Loading applications...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center">
            <p className="text-white/70">No applications found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <div key={app.id} className="glass rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-white">{app.name}</h3>
                      {statusBadge(app.status)}
                    </div>
                    <p className="text-white/60 text-sm">
                      📍 {app.location} • 📧 {app.email} • 📱 {app.phone || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold 
text-yellow-300">${parseFloat(app.amount).toLocaleString()}</p>
                    <p className="text-white/50 text-xs">
                      {new Date(app.timestamp * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="bg-black/20 rounded-xl p-4 mb-4">
                  <p className="text-yellow-300 font-medium mb-1">{app.business}</p>
                  <p className="text-white/80 text-sm">{app.story}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-white/50 text-xs">
                    Wallet: {app.applicant.slice(0, 10)}...{app.applicant.slice(-8)}
                  </p>
                  
                  {app.status === 0 && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReject(app.id)}
                        className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 
hover:bg-red-500/30"
                      >
                        ❌ Reject
                      </button>
                      <button
                        onClick={() => handleApprove(app)}
                        className="px-4 py-2 rounded-xl btn-primary"
                      >
                        ✅ Approve & Add
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
