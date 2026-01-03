
import React, { useState } from 'react';

interface Props {
  onBack: () => void;
}

const DocsPage: React.FC<Props> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    {
      title: 'Introduction',
      icon: 'info',
      content: 'ProtoBase is an onchain MVP factory. We combine AI-driven product strategy with modular smart contract engineering to help founders ship on Base in record time.'
    },
    {
      title: 'Contract Modules',
      icon: 'architecture',
      content: 'Our modules are battle-tested and audited. They range from standard RBAC and ERC-721A implementations to complex vesting vaults and governance systems.'
    },
    {
      title: 'Base Deployment',
      icon: 'cloud_upload',
      content: 'Every deployment is optimized for the Base L2. We automatically configure RPC endpoints, gas estimation, and contract verification.'
    },
    {
      title: 'API Reference',
      icon: 'api',
      content: 'ProtoBase exposes a powerful AI API for analyzing protocol ideas. You can programmatically generate contract architecture using our scope-reduction engine.'
    },
    {
      title: 'Wallet Support',
      icon: 'account_balance_wallet',
      content: 'We natively support MetaMask, Rabby, Zero, and any WalletConnect-compatible wallet for a seamless founder experience.'
    }
  ];

  const filteredSections = sections.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-8 shrink-0">
          <button 
            onClick={onBack}
            className="text-text-secondary hover:text-white flex items-center gap-2 font-bold transition-all"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back
          </button>

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">Getting Started</h4>
            <nav className="flex flex-col gap-2">
              {sections.map(s => (
                <a key={s.title} href={`#${s.title.toLowerCase().replace(' ', '-')}`} className="text-sm text-text-secondary hover:text-white transition-colors">
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-12">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary">search</span>
            <input 
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-dark border border-border-dark rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-primary transition-all shadow-xl"
            />
          </div>

          <div className="space-y-16">
            {filteredSections.map((section) => (
              <section key={section.title} id={section.title.toLowerCase().replace(' ', '-')} className="animate-fadeIn">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined">{section.icon}</span>
                  </div>
                  <h3 className="text-3xl font-bold">{section.title}</h3>
                </div>
                <div className="bg-surface-dark border border-border-dark p-8 rounded-3xl leading-relaxed text-text-secondary shadow-lg">
                  {section.content}
                </div>
              </section>
            ))}
            
            {filteredSections.length === 0 && (
              <div className="text-center py-24 text-text-secondary italic">
                No matching documentation found for "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
