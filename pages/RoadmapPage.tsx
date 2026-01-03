
import React from 'react';

interface Props {
  onBack: () => void;
}

const RoadmapPage: React.FC<Props> = ({ onBack }) => {
  const phases = [
    {
      title: 'Phase 0: The Forge',
      status: 'Completed',
      items: [
        'AI Idea Analyzer integration',
        'Core Solidity module library',
        'Base Mainnet RPC connection engine',
        'Initial UI templates for NFT & DeFi'
      ]
    },
    {
      title: 'Phase 1: Scale & Security',
      status: 'Current',
      items: [
        'Integration of Rabby, Zero & WalletConnect',
        'Automated BaseScan verification',
        'Role-aware frontend scaffolding',
        'Audited Multi-sig templates'
      ]
    },
    {
      title: 'Phase 2: Productization',
      status: 'Upcoming',
      items: [
        'One-click Vercel deployment',
        'Custom logic injection AI assistant',
        'Onchain reputation tracking',
        'Grant management modules'
      ]
    },
    {
      title: 'Phase 3: Ecosystem Hub',
      status: 'Future',
      items: [
        'Cross-chain MVP expansion (L2 focus)',
        'Founder subscription tiers',
        'Governance-as-a-Service integration',
        'ProtoBase Community DAO launch'
      ]
    }
  ];

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <button 
        onClick={onBack}
        className="mb-8 text-text-secondary hover:text-white flex items-center gap-2 font-bold transition-all"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        Back to Landing
      </button>

      <div className="text-center mb-16 space-y-4">
        <h2 className="text-5xl font-bold tracking-tight">The Roadmap</h2>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Building the infrastructure for the next 1,000 protocols on Base.
        </p>
      </div>

      <div className="space-y-12 relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border-dark md:left-1/2" />

        {phases.map((phase, idx) => (
          <div key={idx} className={`relative flex flex-col md:flex-row gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
            <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 size-12 rounded-full bg-surface-dark border-2 border-primary flex items-center justify-center shadow-xl">
              <span className="material-symbols-outlined text-primary text-xl">
                {phase.status === 'Completed' ? 'check' : phase.status === 'Current' ? 'bolt' : 'schedule'}
              </span>
            </div>

            <div className={`md:w-1/2 ${idx % 2 === 0 ? 'md:pr-16 pl-16 md:pl-0' : 'md:pl-16 pl-16 md:pr-0'}`}>
              <div className="bg-surface-dark border border-border-dark p-8 rounded-3xl hover:border-primary/50 transition-all shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    phase.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                    phase.status === 'Current' ? 'bg-primary/10 text-primary' :
                    'bg-white/5 text-text-secondary'
                  }`}>
                    {phase.status}
                  </span>
                </div>
                <ul className="space-y-3">
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <span className="material-symbols-outlined text-primary text-sm mt-0.5">circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="hidden md:block md:w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapPage;
