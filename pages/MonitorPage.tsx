
import React from 'react';

interface Props {
  onReset: () => void;
}

const MonitorPage: React.FC<Props> = ({ onReset }) => {
  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">LIVE ON BASE</span>
            <span className="text-text-secondary text-xs">Contract Verified • Active</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight mb-2">MVP Command Center</h2>
          <p className="text-text-secondary">Project Alpha is live. Monitoring onchain activity and network telemetry.</p>
        </div>
        <div className="flex gap-4">
          <button className="h-11 px-6 rounded-xl bg-primary text-white font-bold flex items-center gap-2 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined">share</span>
            Share Live Link
          </button>
          <button onClick={onReset} className="h-11 px-6 rounded-xl bg-surface-dark border border-border-dark text-white font-bold hover:bg-white/5">
            New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-surface-dark p-6 rounded-2xl border border-border-dark flex flex-col justify-between group hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-2 text-text-secondary text-sm font-bold uppercase tracking-widest mb-4">
            <span className="material-symbols-outlined text-primary">hub</span>
            Network Latency
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-mono font-bold">98ms</span>
            <span className="text-emerald-400 text-xs font-bold mb-1">Excellent</span>
          </div>
        </div>
        
        <div className="bg-surface-dark p-6 rounded-2xl border border-border-dark flex flex-col justify-between group hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-2 text-text-secondary text-sm font-bold uppercase tracking-widest mb-4">
            <span className="material-symbols-outlined text-primary">local_gas_station</span>
            Gas Price (Base)
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-mono font-bold">0.12</span>
            <span className="text-text-secondary text-xs font-bold mb-1">Gwei</span>
          </div>
        </div>

        <div className="bg-surface-dark p-6 rounded-2xl border border-border-dark flex flex-col justify-between group hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-2 text-text-secondary text-sm font-bold uppercase tracking-widest mb-4">
            <span className="material-symbols-outlined text-primary">groups</span>
            Active Testers
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-mono font-bold">12</span>
            <span className="text-primary text-xs font-bold mb-1">+3 Today</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-surface-dark border border-border-dark rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-6">Onchain Activity</h3>
          <div className="space-y-6">
            <div className="h-48 w-full bg-black/40 rounded-xl flex items-end justify-between p-4 gap-2">
              {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                <div 
                  key={i} 
                  className="w-full bg-primary/20 hover:bg-primary transition-colors rounded-t-sm relative group cursor-help"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {h} TXs
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase tracking-widest">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-dark border border-border-dark rounded-2xl p-8 flex flex-col">
          <h3 className="text-xl font-bold mb-6">Recent Transactions</h3>
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] scrollbar-hide">
            {[
              { tx: '0x8a...4b2', method: 'APPROVE', status: 'Success' },
              { tx: '0x7c...1f9', method: 'MINT_MVP', status: 'Success' },
              { tx: '0x3d...a0e', method: 'SET_ROLES', status: 'Success' },
              { tx: '0x9f...e4a', method: 'MINT_MVP', status: 'Success' },
            ].map((tx, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <span className="material-symbols-outlined text-sm">receipt_long</span>
                  </div>
                  <div>
                    <div className="text-sm font-mono font-bold text-white">{tx.tx}</div>
                    <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{tx.method}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase">{tx.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorPage;
