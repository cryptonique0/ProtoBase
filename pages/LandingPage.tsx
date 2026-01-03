
import React from 'react';

interface Props {
  onStart: () => void;
  onRoadmap: () => void;
}

const LandingPage: React.FC<Props> = ({ onStart, onRoadmap }) => {
  return (
    <div className="relative overflow-hidden pt-20 pb-32 bg-black">
      {/* Base Blue Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <div className="container mx-auto px-6 max-w-7xl text-center lg:text-left">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest w-fit mx-auto lg:mx-0">
              <span className="material-symbols-outlined text-base">verified</span>
              Built for Base Mainnet
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Build Onchain <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Products</span> <br />
              in Days.
            </h1>
            
            <p className="text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed font-body">
              The onchain MVP launchpad for the Base ecosystem. Seamlessly integrated with Warpcast, Coinbase Smart Wallets, and audited Base templates.
            </p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <button 
                onClick={onStart}
                className="flex items-center justify-center h-14 px-8 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-lg transition-all shadow-xl shadow-primary/25 hover:-translate-y-1"
              >
                Start Building
                <span className="material-symbols-outlined ml-2 text-2xl">rocket_launch</span>
              </button>
              <button 
                onClick={onRoadmap}
                className="flex items-center justify-center h-14 px-8 rounded-xl bg-white/5 border border-border-dark hover:bg-white/10 text-white font-bold text-lg transition-all"
              >
                Ecosystem Roadmap
              </button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 text-[10px] text-text-secondary font-bold uppercase tracking-[0.2em] pt-4">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary" />
                Coinbase Native
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#855DCD]" />
                Farcaster Integrated
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500" />
                99% Gas Savings
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-primary rounded-3xl blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-surface-dark border border-border-dark rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-[#0a0a0a] p-4 flex items-center justify-between border-b border-border-dark">
                <div className="flex gap-2">
                  <div className="size-3 rounded-full bg-primary/20" />
                  <div className="size-3 rounded-full bg-primary/20" />
                  <div className="size-3 rounded-full bg-primary/20" />
                </div>
                <div className="text-[10px] font-mono text-primary px-3 py-1 rounded bg-primary/10 uppercase tracking-widest font-bold">Base Mainnet</div>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between mb-4">
                   <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-3xl">smart_wallet</span>
                   </div>
                   <div className="text-right">
                      <div className="text-xs font-bold text-white uppercase tracking-widest">Paymaster Active</div>
                      <div className="text-[10px] text-emerald-400 font-mono">0.00 Gas Expense</div>
                   </div>
                </div>
                <div className="h-40 bg-black/40 rounded-xl border border-white/5 p-6 flex flex-col justify-center gap-4">
                   <div className="h-2 w-3/4 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-2/3 animate-shimmer" />
                   </div>
                   <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                   <div className="mt-4 flex gap-4">
                      <div className="size-8 rounded-lg bg-[#855DCD]/20 flex items-center justify-center text-[#855DCD]">
                         <span className="material-symbols-outlined text-sm">chat</span>
                      </div>
                      <div className="flex-1 h-8 rounded-lg bg-primary text-white text-[10px] font-bold flex items-center justify-center uppercase tracking-widest">
                        Deploy to Mainnet
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 pt-16 border-t border-border-dark">
          <p className="text-center text-xs font-bold text-text-secondary uppercase tracking-[0.3em] mb-12">Integrated with the Base Universe</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 hover:opacity-100 transition-all duration-500">
            <span className="text-2xl font-black tracking-tighter hover:text-primary transition-colors cursor-default">BASE</span>
            <span className="text-2xl font-black tracking-tighter hover:text-primary transition-colors cursor-default">COINBASE</span>
            <span className="text-2xl font-black tracking-tighter hover:text-[#855DCD] transition-colors cursor-default">WARPCAST</span>
            <span className="text-2xl font-black tracking-tighter hover:text-primary transition-colors cursor-default">OPTIMISM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
