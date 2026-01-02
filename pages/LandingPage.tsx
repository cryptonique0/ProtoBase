
import React from 'react';

interface Props {
  onStart: () => void;
}

const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden pt-20 pb-32">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <div className="container mx-auto px-6 max-w-7xl text-center lg:text-left">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest w-fit mx-auto lg:mx-0 animate-pulse">
              <span className="material-symbols-outlined text-base">timer</span>
              Accelerate Your Launch
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              From Idea to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 italic">Onchain MVP</span> <br />
              in Days.
            </h1>
            
            <p className="text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed font-body">
              ProtoBase is the industrial-grade launchpad for Web3 founders. Skip months of boilerplate. 
              Deploy audited contracts and role-aware UIs on Base in record time.
            </p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <button 
                onClick={onStart}
                className="flex items-center justify-center h-14 px-8 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-lg transition-all shadow-xl shadow-primary/25 hover:-translate-y-1"
              >
                Launch Your MVP
                <span className="material-symbols-outlined ml-2 text-2xl">rocket_launch</span>
              </button>
              <button className="flex items-center justify-center h-14 px-8 rounded-xl bg-white/5 border border-border-dark hover:bg-white/10 text-white font-bold text-lg transition-all">
                Read Roadmap
              </button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-text-secondary font-medium pt-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-500 font-bold">verified</span>
                Audited Templates
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-500 font-bold">verified</span>
                One-Click Deploy
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-surface-dark border border-border-dark rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-[#0d1117] p-4 flex items-center justify-between border-b border-border-dark">
                <div className="flex gap-2">
                  <div className="size-3 rounded-full bg-red-500/20" />
                  <div className="size-3 rounded-full bg-yellow-500/20" />
                  <div className="size-3 rounded-full bg-green-500/20" />
                </div>
                <div className="text-[10px] font-mono text-text-secondary px-3 py-1 rounded bg-white/5 uppercase tracking-widest">Base Sepolia</div>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <div className="h-4 w-1/3 bg-primary/20 rounded animate-pulse" />
                  <div className="h-8 w-full bg-white/5 rounded" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-white/5 rounded border border-white/5 p-4 flex flex-col justify-between">
                    <span className="material-symbols-outlined text-primary text-xl">token</span>
                    <div className="h-2 w-1/2 bg-white/10 rounded" />
                  </div>
                  <div className="h-24 bg-white/5 rounded border border-white/5 p-4 flex flex-col justify-between">
                    <span className="material-symbols-outlined text-primary text-xl">security</span>
                    <div className="h-2 w-2/3 bg-white/10 rounded" />
                  </div>
                </div>
                <div className="h-32 bg-primary/5 border border-primary/20 border-dashed rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="material-symbols-outlined text-primary text-3xl animate-bounce">rocket_launch</div>
                    <div className="text-xs font-bold text-primary uppercase tracking-widest mt-2">Deploying...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 pt-16 border-t border-border-dark/50">
          <p className="text-center text-xs font-bold text-text-secondary uppercase tracking-[0.3em] mb-12">Trusted by founders shipping on</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <span className="text-2xl font-black italic tracking-tighter">BASE</span>
            <span className="text-2xl font-black italic tracking-tighter">COINBASE</span>
            <span className="text-2xl font-black italic tracking-tighter">OPTIMISM</span>
            <span className="text-2xl font-black italic tracking-tighter">ZORA</span>
            <span className="text-2xl font-black italic tracking-tighter">WARPCAST</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
