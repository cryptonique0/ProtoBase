
import React from 'react';

interface Props {
  onReset: () => void;
  onShare: () => void;
}

const MonitorPage: React.FC<Props> = ({ onReset, onShare }) => {
  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-primary/40">LIVE ON BASE MAINNET</span>
            <span className="text-text-secondary text-xs">Contract Verified • Active</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight mb-2">Protocol Command Center</h2>
          <p className="text-text-secondary">Your MVP is live. Monitoring onchain telemetry and social sentiment on Warpcast.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={onShare} className="h-11 px-6 rounded-xl bg-[#855DCD] text-white font-bold flex items-center gap-2 shadow-lg shadow-[#855DCD]/20 hover:scale-105 transition-all">
            <span className="material-symbols-outlined">share</span>
            Share to Warpcast
          </button>
          <button onClick={onReset} className="h-11 px-6 rounded-xl bg-surface-dark border border-border-dark text-white font-bold hover:bg-white/5">
            New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-surface-dark p-6 rounded-2xl border border-border-dark">
          <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-4">Base Gas (L2)</div>
          <div className="text-3xl font-mono font-bold">0.001 Gwei</div>
        </div>
        <div className="bg-surface-dark p-6 rounded-2xl border border-border-dark">
          <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-4">Active Testers</div>
          <div className="text-3xl font-mono font-bold">42</div>
        </div>
        <div className="bg-surface-dark p-6 rounded-2xl border border-border-dark">
          <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-4">Warpcast Mentions</div>
          <div className="text-3xl font-mono font-bold text-[#855DCD]">156</div>
        </div>
        <div className="bg-surface-dark p-6 rounded-2xl border border-border-dark">
          <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-4">Builder XP Level</div>
          <div className="text-3xl font-mono font-bold text-primary">Lvl 4</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-surface-dark border border-border-dark rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#855DCD]">chat_bubble</span>
            Warpcast Sentiment
          </h3>
          <div className="space-y-4">
            {[
              { user: 'vbuterin.eth', text: 'This protocol looks like it has great potential on Base.', time: '2m ago' },
              { user: 'jesse.base.eth', text: 'Love the gas efficiency of this MVP! Builder score is high.', time: '15m ago' },
              { user: 'farcaster_dev', text: 'Frame integration is seamless. Nice work.', time: '1h ago' },
            ].map((cast, i) => (
              <div key={i} className="p-4 bg-black/40 rounded-xl border border-white/5 hover:border-[#855DCD]/30 transition-all">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-[#855DCD]">{cast.user}</span>
                  <span className="text-[9px] text-text-secondary">{cast.time}</span>
                </div>
                <p className="text-sm text-gray-300">{cast.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-dark border border-border-dark rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">show_chart</span>
            Base Telemetry
          </h3>
          <div className="h-64 flex items-end gap-2 p-4 bg-black/40 rounded-xl">
             {[30, 60, 45, 90, 100, 80, 50, 70, 40, 90].map((h, i) => (
               <div key={i} className="flex-1 bg-primary/20 rounded-t-md hover:bg-primary transition-all cursor-help relative group" style={{ height: `${h}%` }}>
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                   {h} TX
                 </div>
               </div>
             ))}
          </div>
          <div className="flex justify-between text-[10px] font-bold text-text-secondary mt-4 uppercase tracking-[0.2em]">
            <span>12:00</span><span>15:00</span><span>18:00</span><span>21:00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorPage;
