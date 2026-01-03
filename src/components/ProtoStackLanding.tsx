import React from 'react';

interface ProtoStackLandingProps {
  onGetStarted: () => void;
}

export const ProtoStackLanding: React.FC<ProtoStackLandingProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-sm font-bold text-primary uppercase tracking-widest">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            Building on Base
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
            ProtoStack
          </h1>
          
          <p className="text-2xl text-text-secondary max-w-2xl mx-auto">
            The Idea → MVP Launchpad for Base builders
          </p>

          <p className="text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Transform your onchain ideas into deployed protocols in days, not months. 
            AI-powered architecture, modular smart contracts, and builder-first tooling.
          </p>

          <div className="flex items-center justify-center gap-4 pt-8">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-lg transition-all shadow-lg shadow-primary/20 hover:-translate-y-1"
            >
              Launch Your MVP
            </button>
            <a
              href="#vision"
              className="px-8 py-4 bg-surface-dark border border-border-dark hover:border-gray-500 text-white font-bold rounded-xl text-lg transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Core Modules */}
      <section id="vision" className="container mx-auto px-6 py-20 border-t border-border-dark">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">The ProtoStack Platform</h2>
          <p className="text-center text-text-secondary mb-12 max-w-2xl mx-auto">
            A suite of interconnected modules that take you from idea to deployed MVP
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ProtoVM Profiles */}
            <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 hover:border-primary/30 transition-all">
              <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-2xl text-primary">account_circle</span>
              </div>
              <h3 className="text-xl font-bold mb-2">ProtoVM Profiles</h3>
              <p className="text-sm text-text-secondary mb-4">
                Builder identity, reputation tracking, and project ownership. Your onchain portfolio.
              </p>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">✓ Week 1 - Live</span>
            </div>

            {/* ProtoGen AI */}
            <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 hover:border-primary/30 transition-all">
              <div className="size-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-2xl text-blue-400">psychology</span>
              </div>
              <h3 className="text-xl font-bold mb-2">ProtoGen AI</h3>
              <p className="text-sm text-text-secondary mb-4">
                AI-driven feasibility analysis and smart contract generation for Base-native features.
              </p>
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Week 2 - Coming Soon</span>
            </div>

            {/* ProtoKit */}
            <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 hover:border-primary/30 transition-all">
              <div className="size-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-2xl text-emerald-400">view_module</span>
              </div>
              <h3 className="text-xl font-bold mb-2">ProtoKit</h3>
              <p className="text-sm text-text-secondary mb-4">
                Audited smart contract modules (ERC-721A, RBAC, Vesting, Governor) ready to compose.
              </p>
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Week 3 - Coming Soon</span>
            </div>

            {/* ProtoDeploy */}
            <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 hover:border-primary/30 transition-all">
              <div className="size-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-2xl text-purple-400">rocket_launch</span>
              </div>
              <h3 className="text-xl font-bold mb-2">ProtoDeploy</h3>
              <p className="text-sm text-text-secondary mb-4">
                One-click deployment to Base with automatic verification and gas optimization.
              </p>
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Week 4 - Coming Soon</span>
            </div>

            {/* ProtoUI */}
            <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 hover:border-primary/30 transition-all">
              <div className="size-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-2xl text-yellow-400">palette</span>
              </div>
              <h3 className="text-xl font-bold mb-2">ProtoUI</h3>
              <p className="text-sm text-text-secondary mb-4">
                Pre-wired frontend templates with wallet integration and smart contract hooks.
              </p>
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Week 5 - Coming Soon</span>
            </div>

            {/* ProtoMonitor */}
            <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 hover:border-primary/30 transition-all">
              <div className="size-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-2xl text-red-400">monitoring</span>
              </div>
              <h3 className="text-xl font-bold mb-2">ProtoMonitor</h3>
              <p className="text-sm text-text-secondary mb-4">
                Real-time contract analytics, transaction monitoring, and social sentiment tracking.
              </p>
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Week 6 - Coming Soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why ProtoStack */}
      <section className="container mx-auto px-6 py-20 border-t border-border-dark">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold">Why ProtoStack?</h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <div className="text-4xl mb-2">⚡</div>
              <h3 className="font-bold mb-2">Ship Fast</h3>
              <p className="text-sm text-text-secondary">
                Go from idea to deployed MVP in days. No boilerplate, no setup friction.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">🛡️</div>
              <h3 className="font-bold mb-2">Production-Ready</h3>
              <p className="text-sm text-text-secondary">
                Audited contracts, gas-optimized, and verified on BaseScan automatically.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">🧠</div>
              <h3 className="font-bold mb-2">AI-Powered</h3>
              <p className="text-sm text-text-secondary">
                Smart scope reduction and architecture recommendations for Base L2.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-20 border-t border-border-dark">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to build?</h2>
          <p className="text-text-secondary">
            Join the builders launching the next wave of Base protocols
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-lg transition-all shadow-lg shadow-primary/20"
          >
            Start Building on Base
          </button>
        </div>
      </section>
    </div>
  );
};
