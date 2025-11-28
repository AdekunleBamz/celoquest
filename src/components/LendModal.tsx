'use client';

import { useState } from 'react';
import { formatCUSD } from '@/lib/web3';

interface Borrower {
  id: number;
  name: string;
  requested: bigint;
  funded: bigint;
}

interface LendModalProps {
  borrower: Borrower;
  onClose: () => void;
  onLend: (borrowerId: number, amount: string) => void;
  isConnected: boolean;
  onConnect: () => void;
}

export default function LendModal({ borrower, onClose, onLend, isConnected, onConnect }: 
LendModalProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  
  const remaining = parseFloat(formatCUSD(borrower.requested - borrower.funded));
  const presetAmounts = ['1', '5', '10', '25', '50', '100'];

  async function handleLend() {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter an amount');
      return;
    }
    if (parseFloat(amount) > remaining) {
      alert(`Maximum amount is $${remaining}`);
      return;
    }
    
    setLoading(true);
    try {
      await onLend(borrower.id, amount);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center 
justify-center z-50 p-4">
      <div className="glass rounded-3xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-2">💰 Lend to {borrower.name}</h2>
        <p className="text-white/70 mb-6">Maximum: ${remaining.toLocaleString()} cUSD</p>

        {/* Preset Amounts */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset)}
              className={`py-3 rounded-xl font-semibold transition-all ${
                amount === preset 
                  ? 'btn-primary' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              ${preset}
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter custom amount..."
          className="w-full p-4 rounded-xl bg-white/10 text-white placeholder-white/50 border 
border-white/20 focus:border-yellow-300 outline-none mb-6"
          min="1"
          max={remaining}
          step="0.01"
        />

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold 
hover:bg-white/20 transition-all"
          >
            Cancel
          </button>
          {isConnected ? (
            <button
              onClick={handleLend}
              disabled={loading || !amount}
              className="flex-1 py-3 btn-primary rounded-xl disabled:opacity-50"
            >
              {loading ? '⏳ Processing...' : '✅ Confirm Loan'}
            </button>
          ) : (
            <button
              onClick={onConnect}
              className="flex-1 py-3 btn-primary rounded-xl"
            >
              🔗 Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
