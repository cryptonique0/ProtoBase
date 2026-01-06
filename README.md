# ProtoStack

**The Idea → MVP Launchpad for Base Builders**

Transform your onchain ideas into deployed protocols in days, not months. ProtoStack is an integrated platform that combines AI-powered architecture, modular smart contracts, and builder-first tooling to accelerate MVP development on Base L2.

---

## 🎯 Vision

ProtoStack empowers the next generation of Base builders to:
- **Ship faster** - Go from idea to deployed MVP in days
- **Build smarter** - AI-driven feasibility analysis and gas optimization
- **Own their work** - Builder profiles with reputation and project ownership
- **Launch with confidence** - Audited contracts and automated verification

---

## 🏗️ Architecture

ProtoStack is organized into **interconnected modules**, each solving a specific part of the builder journey:

```
ProtoStack/
├── ProtoVM Profiles    → Builder identity & reputation (Week 1 ✓)
├── ProtoGen AI         → AI contract generation (Week 2)
├── ProtoKit            → Modular contract library (Week 3)
├── ProtoDeploy         → One-click Base deployment (Week 4)
├── ProtoUI             → Pre-wired frontend templates (Week 5)
└── ProtoMonitor        → Analytics & monitoring (Week 6)
```

---

## 📦 Current Modules

### ✅ ProtoVM Profiles (Week 1 - LIVE)

**Builder identity and project ownership system**

Located in: `src/modules/profiles/`

**Features:**
- Builder profiles with address-based identity
- Reputation tracking (XP, level, projects launched)
- Project ownership and portfolio
- Social links (Warpcast, Twitter, GitHub)
- Empty state for first-time builders
- Leaderboard boosters: deployment streaks + XP multipliers for fast shippers

**Types:**
```typescript
interface BuilderProfile {
  id: string;
  address: `0x${string}`;
  username?: string;
  reputation: BuilderReputation;
  socials?: BuilderSocials;
}

interface BuilderProject {
  id: string;
  name: string;
  ownerId: string;
  contractAddress?: `0x${string}`;
  status: ProjectStatus;
  modules: string[];
}
```

**Components:**
- `ProfileHeader` - Display builder info and stats
- `ProjectsList` - Grid of owned projects
- `ProjectCard` - Individual project preview
- `EmptyProjectsState` - Onboarding for new builders

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Web3 wallet (MetaMask, Coinbase Wallet)
- ETH on Base (for deployments)

### Installation

```bash
# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local

# Add your API keys to .env.local:
# - GEMINI_API_KEY
# - VITE_WALLETCONNECT_PROJECT_ID
# - VITE_BASESCAN_API_KEY

# Run development server
npm run dev
```

### Project Structure

```
protobase/
├── src/
│   ├── modules/          # Feature modules
│   │   ├── profiles/     # ProtoVM Profiles
│   │   ├── projects/     # Project management (TODO)
│   │   └── contracts/    # Contract generation (TODO)
│   ├── components/       # Shared UI components
│   ├── lib/              # Utilities and helpers
│   └── types/            # TypeScript definitions
├── pages/                # Legacy pages (to be migrated)
├── wagmiConfig.ts        # Web3 configuration
└── contractDeployer.ts   # Deployment utilities
```

---

## 🗓️ Development Roadmap

### Week 1 (✅ Complete) - Foundation
- [x] ProtoVM Profiles architecture
- [x] Builder profile types and interfaces  
- [x] Profile header with stats
- [x] Projects list with empty state
- [x] Clean folder structure
- [x] ProtoStack landing page

### Week 2 - AI Generation
- [ ] ProtoGen AI module setup
- [ ] Gemini integration for contract generation
- [ ] Feasibility scoring for Base L2
- [ ] Scope reduction recommendations
- [ ] Module suggestion engine

### Week 3 - Contract Library
- [ ] ProtoKit module architecture
- [ ] Audited contract templates
- [ ] Module composition system
- [ ] Gas estimation per module
- [ ] Documentation generation

### Week 4 - Deployment
- [ ] ProtoDeploy module
- [ ] One-click Base deployment
- [ ] Automatic BaseScan verification
- [ ] Transaction monitoring
- [ ] Deployment history

### Week 5 - Frontend
- [ ] ProtoUI module
- [ ] Template library
- [ ] Wagmi hooks generation
- [ ] Wallet integration presets
- [ ] Component theming

### Week 6 - Monitoring
- [ ] ProtoMonitor module
- [ ] Real-time analytics
- [ ] Contract event tracking
- [ ] Social sentiment analysis
- [ ] Builder dashboard

---

## 🛠️ Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite (bundler)
- Tailwind CSS (styling)

**Web3:**
- wagmi v3 (React hooks)
- viem v2 (Ethereum library)
- Base Mainnet & Sepolia

**AI:**
- Google Gemini AI
- Contract generation
- Scope analysis

**Backend (Future):**
- Supabase (profiles, projects)
- PostgreSQL
- Real-time subscriptions

**Smart Contracts:**
- Solidity 0.8.20+
- Foundry (testing)
- OpenZeppelin (base contracts)

---

## 🏛️ Module Deep Dive

### ProtoVM Profiles

**Purpose:** Identity layer for ProtoStack builders

**Key Features:**
- **Address-based identity** - No email, just wallet
- **Reputation system** - XP, levels, achievements
- **Project ownership** - Link deployed contracts to profile
- **Social integration** - Warpcast, Twitter, GitHub

**Implementation:**
```typescript
// Types
src/types/profile.types.ts

// Components
src/modules/profiles/
  ├── ProfileHeader.tsx
  ├── ProjectsList.tsx
  ├── ProjectCard.tsx
  └── EmptyProjectsState.tsx

// Hooks (TODO: Week 2)
src/modules/profiles/hooks/
  ├── useBuilderProfile.ts
  └── useBuilderProjects.ts
```

**Future Enhancements:**
- [ ] Supabase integration for persistence
- [ ] ENS name resolution
- [ ] Badge/achievement system
- [ ] Profile editing
- [ ] Avatar upload
- [ ] Social graph

---

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

**Testing Roadmap:**
- [ ] Unit tests (Vitest)
- [ ] Component tests (React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] Contract tests (Foundry)

---

## 🔐 Security

- Smart contracts audited by [TODO]
- Environment variables for sensitive data
- No private keys in code
- Wallet-based authentication only
- BaseScan verification enabled

---

## 🤝 Contributing

ProtoStack is evolving rapidly. Contributions welcome!

**Areas for contribution:**
- Module development
- UI/UX improvements
- Documentation
- Testing
- Smart contract security

---

## 📚 Resources

**Base Network:**
- [Base Docs](https://docs.base.org)
- [BaseScan](https://basescan.org)
- [Base Faucet (Testnet)](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

**Development:**
- [wagmi Docs](https://wagmi.sh)
- [viem Docs](https://viem.sh)
- [Tailwind CSS](https://tailwindcss.com)

**Community:**
- Discord: [TODO]
- Warpcast: [TODO]
- Twitter: [TODO]

---

## 📄 License

MIT License - See LICENSE file

---

## 🙏 Acknowledgments

Built for the Base ecosystem with support from:
- Coinbase & Base team
- Google Gemini AI
- wagmi & viem communities
- Base builder community

---

**Current Status:** Week 1 Foundation Complete ✅

Next up: Week 2 - AI Generation Module

*Last updated: January 3, 2026*
