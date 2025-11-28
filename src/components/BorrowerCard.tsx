'use client';

import { formatCUSD } from '@/lib/web3';

interface Borrower {
  id: number;
  name: string;
  location: string;
  business: string;
  story: string;
  photo: string;
  requested: bigint;
  funded: bigint;
}

interface BorrowerCardProps {
  borrower: Borrower;
  onLend: () => void;
}

export default function BorrowerCard({ borrower, onLend }: BorrowerCardProps) {
  const requested = parseFloat(formatCUSD(borrower.requested));
  const funded = parseFloat(formatCUSD(borrower.funded));
  const remaining = requested - funded;
  const progress = requested > 0 ? (funded / requested) * 100 : 0;

  return (
    <div className="glass rounded-3xl p-6 hover:scale-[1.02] transition-all duration-300 
hover:border-yellow-300/50">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 
to-orange-500 flex items-center justify-center text-2xl font-bold text-black">
          {borrower.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{borrower.name}</h3>
          <p className="text-white/70 text-sm">📍 {borrower.location}</p>
        </div>
      </div>

      {/* Business */}
      <div className="mb-3">
        <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-yellow-300 
text-sm font-medium">
          {borrower.business}
        </span>
      </div>

      {/* Story */}
      <p className="text-white/80 text-sm mb-4 line-clamp-3">
        "{borrower.story}"
      </p>

      {/* Amounts */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-black/20 rounded-xl p-3 text-center">
          <p className="text-white/60 text-xs">Requested</p>
          <p className="text-yellow-300 font-bold">${requested.toLocaleString()}</p>
        </div>
        <div className="bg-black/20 rounded-xl p-3 text-center">
          <p className="text-white/60 text-xs">Remaining</p>
          <p className="text-green-400 font-bold">${remaining.toLocaleString()}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
          <div 
            className="h-full progress-bar rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="text-center text-white/60 text-xs mt-1">{progress.toFixed(1)}% 
funded</p>
      </div>

      {/* Lend Button */}
      <button
        onClick={onLend}
        className="w-full py-3 btn-primary rounded-xl text-lg"
        disabled={remaining <= 0}
      >
        {remaining <= 0 ? '✅ Fully Funded' : '💰 Lend Now'}
      </button>
    </div>
  );
}
