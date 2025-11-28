'use client';

interface HeaderProps {
  address: string | null;
  onConnect: () => void;
  stats: { totalFunded: string; borrowerCount: number };
}

export default function Header({ address, onConnect, stats }: HeaderProps) {
  const shortAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  return (
    <header className="mb-10">
      {/* Logo */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-500 
rounded-2xl flex items-center justify-center text-3xl shadow-lg">
            🎯
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-white">CeloQuest</h1>
            <p className="text-white/70">Gamified Micro-Lending on Celo</p>
          </div>
        </div>
        
        <button
          onClick={onConnect}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            address 
              ? 'glass text-white' 
              : 'btn-primary'
          }`}
        >
          {shortAddress || '🔗 Connect Wallet'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-5 text-center">
          <p className="text-white/70 text-sm mb-1">Total Funded</p>
          <p className="text-3xl font-bold 
text-yellow-300">${parseFloat(stats.totalFunded).toLocaleString()}</p>
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
