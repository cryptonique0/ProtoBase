
import React, { useState, useCallback, useEffect } from 'react';
import { ProjectStep, IdeaAnalysis, ContractModule, UITemplate } from './types';
import LandingPage from './pages/LandingPage';
import IntakePage from './pages/IntakePage';
import ContractsPage from './pages/ContractsPage';
import FrontendPage from './pages/FrontendPage';
import DeploymentPage from './pages/DeploymentPage';
import MonitorPage from './pages/MonitorPage';
import RoadmapPage from './pages/RoadmapPage';
import DocsPage from './pages/DocsPage';
import { generateContractSource } from './geminiService';

const WalletIcons = {
  MetaMask: () => (
    <svg width="24" height="24" viewBox="0 0 320 292" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M304.8 15.6L166.4 100.8L160 104.8L153.6 100.8L15.2 15.6L143.2 108.8H176.8L304.8 15.6Z" fill="#E17726"/>
      <path d="M15.2 15.6L116 112L143.2 108.8L15.2 15.6Z" fill="#E27625"/>
      <path d="M304.8 15.6L176.8 108.8L204 112L304.8 15.6Z" fill="#E27625"/>
      <path d="M259.2 188.8L281.6 226.4L308.8 174L259.2 188.8Z" fill="#E27625"/>
      <path d="M11.2 174L38.4 226.4L60.8 188.8L11.2 174Z" fill="#E27625"/>
      <path d="M96.8 160.8L108 176.8L60.8 188.8L96.8 160.8Z" fill="#E27625"/>
      <path d="M223.2 160.8L259.2 188.8L212 176.8L223.2 160.8Z" fill="#E27625"/>
      <path d="M116 112L118.4 153.6L96.8 160.8L116 112Z" fill="#E27625"/>
      <path d="M204 112L223.2 160.8L201.6 153.6L204 112Z" fill="#E27625"/>
      <path d="M118.4 153.6L143.2 178.4L108 176.8L118.4 153.6Z" fill="#D5BFB2"/>
      <path d="M201.6 153.6L212 176.8L176.8 178.4L201.6 153.6Z" fill="#D5BFB2"/>
      <path d="M143.2 178.4L160 191.2L176.8 178.4L160 171.2L143.2 178.4Z" fill="#233447"/>
    </svg>
  ),
  Rabby: () => (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#7047EB"/>
      <path d="M30 40C30 34.4772 34.4772 30 40 30H60C65.5228 30 70 34.4772 70 40V60C70 65.5228 65.5228 70 60 70H40C34.4772 70 30 65.5228 30 60V40Z" fill="white"/>
      <path d="M40 45H60M40 55H60" stroke="#7047EB" strokeWidth="6" strokeLinecap="round"/>
    </svg>
  ),
  Zero: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#000000"/>
      <path d="M12 6L18 12L12 18L6 12L12 6Z" fill="#0052FF"/>
      <path d="M12 8L16 12L12 16L8 12L12 8Z" fill="white"/>
    </svg>
  ),
  Farcaster: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#855DCD"/>
      <path d="M18 12.5C18 14.9853 15.3137 17 12 17C8.68629 17 6 14.9853 6 12.5C6 10.0147 8.68629 8 12 8C15.3137 8 18 10.0147 18 12.5Z" fill="white"/>
    </svg>
  ),
  X: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Discord: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.419-2.157 2.419z"/>
    </svg>
  ),
  Github: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  )
};

const WalletModal: React.FC<{ isOpen: boolean; onClose: () => void; onSelect: (name: string) => void }> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const wallets = [
    { name: 'MetaMask', Icon: WalletIcons.MetaMask },
    { name: 'Rabby', Icon: WalletIcons.Rabby },
    { name: 'Zero', Icon: WalletIcons.Zero },
    { name: 'Coinbase Smart Wallet', Icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#0052FF"/>
        <circle cx="12" cy="12" r="5" fill="white"/>
      </svg>
    )}
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-surface-dark border border-border-dark rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scaleUp">
        <div className="p-6 border-b border-border-dark flex justify-between items-center bg-black/40">
          <h3 className="text-xl font-bold">Connect to Base</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-white transition-all">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-3">
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => onSelect(wallet.name)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-border-dark hover:border-primary hover:bg-primary/10 transition-all group active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="bg-black/40 p-2 rounded-xl">
                  <wallet.Icon />
                </div>
                <span className="font-bold text-gray-200 group-hover:text-white">{wallet.name}</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-text-secondary opacity-0 group-hover:opacity-100 tracking-widest">Connect</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<ProjectStep>(ProjectStep.LANDING);
  const [analysis, setAnalysis] = useState<IdeaAnalysis | null>(null);
  const [selectedModules, setSelectedModules] = useState<ContractModule[]>([]);
  const [moduleCustomizations, setModuleCustomizations] = useState<Record<string, string>>({});
  const [selectedUI, setSelectedUI] = useState<UITemplate | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [generatedSource, setGeneratedSource] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [builderXP, setBuilderXP] = useState(0);

  const navigateTo = useCallback((step: ProjectStep) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const stepXP: Record<string, number> = {
      [ProjectStep.INTAKE]: 100,
      [ProjectStep.CONTRACTS]: 300,
      [ProjectStep.FRONTEND]: 500,
      [ProjectStep.DEPLOYMENT]: 1000,
      [ProjectStep.MONITOR]: 2500
    };
    if (stepXP[step]) setBuilderXP(prev => Math.max(prev, stepXP[step]));
  }, []);

  const handleSelectWallet = async (walletName: string) => {
    setIsWalletModalOpen(false);
    setWalletAddress('0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6));
    setBuilderXP(prev => prev + 50);
  };

  const handleWarpcastShare = () => {
    const text = encodeURIComponent(`I just architected a new protocol on Base Mainnet using ProtoBase! 🚀 XP: ${builderXP}`);
    window.open(`https://warpcast.com/~/compose?text=${text}`, '_blank');
    setBuilderXP(prev => prev + 250);
  };

  const renderPage = () => {
    switch (currentStep) {
      case ProjectStep.LANDING:
        return <LandingPage onStart={() => navigateTo(ProjectStep.INTAKE)} onRoadmap={() => navigateTo(ProjectStep.ROADMAP)} />;
      case ProjectStep.INTAKE:
        return <IntakePage 
          onComplete={(data) => { setAnalysis(data); navigateTo(ProjectStep.CONTRACTS); }} 
          onBack={() => navigateTo(ProjectStep.LANDING)}
        />;
      case ProjectStep.CONTRACTS:
        return <ContractsPage 
          analysis={analysis}
          selectedModules={selectedModules}
          moduleCustomizations={moduleCustomizations}
          onCustomize={(id, logic) => setModuleCustomizations(prev => ({ ...prev, [id]: logic }))}
          onSelect={(module) => {
            setSelectedModules(prev => prev.find(m => m.id === module.id) ? prev.filter(m => m.id !== module.id) : [...prev, module]);
          }}
          onComplete={() => navigateTo(ProjectStep.FRONTEND)}
          onGenerate={async () => {
             setIsGenerating(true);
             navigateTo(ProjectStep.DEPLOYMENT);
             const source = await generateContractSource(analysis!, selectedModules, moduleCustomizations);
             setGeneratedSource(source);
             setIsGenerating(false);
          }}
          onBack={() => navigateTo(ProjectStep.INTAKE)}
        />;
      case ProjectStep.FRONTEND:
        return <FrontendPage onSelect={setSelectedUI} selectedUI={selectedUI} onComplete={() => navigateTo(ProjectStep.DEPLOYMENT)} onBack={() => navigateTo(ProjectStep.CONTRACTS)} />;
      case ProjectStep.DEPLOYMENT:
        return <DeploymentPage isGenerating={isGenerating} sourceCode={generatedSource} onComplete={() => navigateTo(ProjectStep.MONITOR)} onBack={() => navigateTo(ProjectStep.FRONTEND)} />;
      case ProjectStep.MONITOR:
        return <MonitorPage onReset={() => navigateTo(ProjectStep.LANDING)} onShare={handleWarpcastShare} />;
      case ProjectStep.ROADMAP:
        return <RoadmapPage onBack={() => navigateTo(ProjectStep.LANDING)} />;
      case ProjectStep.DOCS:
        return <DocsPage onBack={() => navigateTo(ProjectStep.LANDING)} />;
      default:
        return <LandingPage onStart={() => navigateTo(ProjectStep.INTAKE)} onRoadmap={() => navigateTo(ProjectStep.ROADMAP)} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-display selection:bg-primary/40">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border-dark bg-black/80 backdrop-blur-md px-6 py-4">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigateTo(ProjectStep.LANDING)}>
          <div className="size-10 bg-primary/20 text-primary flex items-center justify-center rounded-xl border border-primary/40 shadow-[0_0_20px_rgba(0,82,255,0.2)]">
            <span className="material-symbols-outlined text-2xl font-bold">rocket_launch</span>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">ProtoBase</h2>
            <div className="flex items-center gap-2">
               <span className="text-[9px] uppercase font-bold tracking-widest text-primary">Base Mainnet</span>
               <div className="size-1 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => navigateTo(ProjectStep.LANDING)} className="text-sm font-bold text-text-secondary hover:text-white transition-colors">Home</button>
          <button onClick={() => navigateTo(ProjectStep.ROADMAP)} className="text-sm font-bold text-text-secondary hover:text-white transition-colors">Roadmap</button>
          <button onClick={() => navigateTo(ProjectStep.DOCS)} className="text-sm font-bold text-text-secondary hover:text-white transition-colors">Docs</button>
        </nav>

        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Builder XP</span>
            <span className="text-sm font-mono font-bold text-primary">{builderXP.toLocaleString()}</span>
          </div>
          <button 
            onClick={() => setIsWalletModalOpen(true)}
            className={`px-4 py-2 lg:px-5 lg:py-2.5 rounded-xl text-xs font-bold border transition-all ${walletAddress ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-surface-dark border-border-dark text-white hover:border-gray-500'}`}
          >
            {walletAddress || 'Connect Wallet'}
          </button>
          <button onClick={handleWarpcastShare} className="size-10 bg-surface-dark border border-border-dark flex items-center justify-center rounded-xl hover:border-[#855DCD] hover:text-[#855DCD] transition-all">
            <WalletIcons.Farcaster />
          </button>
        </div>
      </header>

      <main className="flex-1">{renderPage()}</main>

      {/* Global Footer */}
      <footer className="bg-surface-dark border-t border-border-dark px-6 py-16">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="size-8 bg-primary/20 text-primary flex items-center justify-center rounded-lg border border-primary/40">
                  <span className="material-symbols-outlined text-lg">rocket_launch</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight">ProtoBase</h3>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Empowering the next generation of founders to build and launch onchain MVPs on Base in record time.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-text-secondary hover:text-white transition-colors"><WalletIcons.X /></a>
                <a href="#" className="text-text-secondary hover:text-[#5865F2] transition-colors"><WalletIcons.Discord /></a>
                <a href="#" className="text-text-secondary hover:text-white transition-colors"><WalletIcons.Github /></a>
                <a href="#" className="text-text-secondary hover:text-[#855DCD] transition-colors"><WalletIcons.Farcaster /></a>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Platform</h4>
              <nav className="flex flex-col gap-3">
                <button onClick={() => navigateTo(ProjectStep.INTAKE)} className="text-sm text-text-secondary hover:text-white transition-colors text-left">Launch MVP</button>
                <button onClick={() => navigateTo(ProjectStep.CONTRACTS)} className="text-sm text-text-secondary hover:text-white transition-colors text-left">Smart Contracts</button>
                <button onClick={() => navigateTo(ProjectStep.FRONTEND)} className="text-sm text-text-secondary hover:text-white transition-colors text-left">UI Templates</button>
                <button onClick={() => navigateTo(ProjectStep.ROADMAP)} className="text-sm text-text-secondary hover:text-white transition-colors text-left">Roadmap</button>
              </nav>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Resources</h4>
              <nav className="flex flex-col gap-3">
                <button onClick={() => navigateTo(ProjectStep.DOCS)} className="text-sm text-text-secondary hover:text-white transition-colors text-left">Documentation</button>
                <a href="https://docs.base.org" target="_blank" className="text-sm text-text-secondary hover:text-white transition-colors text-left">Base Docs</a>
                <a href="https://coinbase.com/smart-wallet" target="_blank" className="text-sm text-text-secondary hover:text-white transition-colors text-left">Smart Wallet</a>
                <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors text-left">Brand Kit</a>
              </nav>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Community</h4>
              <nav className="flex flex-col gap-3">
                <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors text-left">Discord Server</a>
                <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors text-left">Warpcast Channel</a>
                <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors text-left">Ecosystem Grants</a>
                <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors text-left">Hackathons</a>
              </nav>
            </div>
          </div>

          <div className="pt-8 border-t border-border-dark flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-text-secondary font-mono">© 2024 ProtoBase. Forging on Base Mainnet.</p>
            <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500" />
                Base Status: Operational
              </div>
            </div>
          </div>
        </div>
      </footer>

      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} onSelect={handleSelectWallet} />
    </div>
  );
};

export default App;
