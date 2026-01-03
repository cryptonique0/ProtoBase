
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
            <div className="relative bg-[#0a0a0a] border border-border-dark rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-[#0a0a0a] px-6 py-4 flex items-center justify-between border-b border-border-dark/50">
                <div className="flex gap-2">
                  <div className="size-3 rounded-full bg-border-dark" />
                  <div className="size-3 rounded-full bg-border-dark" />
                  <div className="size-3 rounded-full bg-border-dark" />
                </div>
                <div className="text-[10px] font-mono text-primary px-3 py-1 rounded bg-primary/10 uppercase tracking-widest font-bold border border-primary/20">Base Mainnet</div>
              </div>
              <div className="p-8 space-y-8 relative">
                {/* Visual Mockup Header Section */}
                <div className="flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-3">
                      <div className="text-3xl font-black tracking-tighter text-primary/80 flex items-center gap-2">
                        <span className="opacity-40 -ml-8 overflow-hidden whitespace-nowrap">SMART_</span>
                        <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                          <span className="material-symbols-outlined text-white text-2xl">account_balance_wallet</span>
                        </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-[10px] font-bold text-white uppercase tracking-widest opacity-80">Paymaster Active</div>
                      <div className="text-sm text-emerald-400 font-mono font-bold">0.00 Gas Expense</div>
                   </div>
                </div>

                {/* Progress Visualizer */}
                <div className="bg-black/60 rounded-2xl border border-white/5 p-8 flex flex-col gap-6 shadow-inner relative overflow-hidden">
                   <div className="space-y-4">
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-primary w-3/4 animate-shimmer" />
                      </div>
                      <div className="h-2 w-2/3 bg-white/5 rounded-full" />
                   </div>
                   
                   <div className="flex gap-4 mt-2">
                      <div className="size-10 rounded-xl bg-[#855DCD]/10 border border-[#855DCD]/20 flex items-center justify-center text-[#855DCD]">
                         <span className="material-symbols-outlined text-xl">forum</span>
                      </div>
                      <button 
                        onClick={onStart}
                        className="flex-1 h-10 rounded-xl bg-primary hover:bg-primary-hover text-white text-[11px] font-bold flex items-center justify-center uppercase tracking-widest transition-all shadow-lg shadow-primary/20 active:scale-95"
                      >
                        Deploy to Mainnet
                      </button>
                   </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 bg-primary/5 blur-3xl rounded-full -z-0 pointer-events-none" />
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
