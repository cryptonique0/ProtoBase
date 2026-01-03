# 🚀 Project Workspace System - Complete Guide

## Overview

ProtoBase now includes a **Project Workspace System** that transforms validated ideas into **production-ready MVPs**. This system bridges the gap between idea validation and actual deployment on Base.

## 🎯 Features

### 1. **Project Status Flow**
Ideas progress through a clear 5-stage lifecycle:

```
Idea → MVP Planning → MVP Building → MVP Deployed (Testnet) → Mainnet Deployed
```

Each stage provides specific tools and guidance to move forward.

### 2. **Smart Contract Templates** (5 Templates)

Pre-built, Base-optimized contracts ready to customize:

- **ERC20 Token**: Mintable/burnable fungible tokens
- **ERC721 NFT**: Basic NFT collection with metadata
- **Simple Staking**: DeFi staking pool with rewards
- **Simple DAO**: Governance with proposals and voting
- **Simple Escrow**: Secure P2P transactions

All templates use OpenZeppelin contracts and are gas-optimized for Base.

### 3. **Frontend Templates** (3 Templates)

Next.js 14 starter apps with wagmi/viem integration:

- **Token Dashboard**: Balance display + transfer UI
- **NFT Mint Page**: Minting interface with tx tracking
- **DAO Voting Interface**: Proposal creation + voting

### 4. **One-Click Deployment**

Deploy contracts to **Base Sepolia testnet** directly from the UI:

- Real Solidity compilation with `solc`
- Wallet integration (MetaMask, Coinbase Wallet, etc.)
- Transaction tracking on BaseScan
- Gas estimation

### 5. **Supabase Integration**

Workspaces are persisted in database:

- User-owned workspaces
- Code versioning (contract + frontend)
- Deployment history
- Row-level security

---

## 🏗️ Architecture

### Data Model

```typescript
interface ProjectWorkspace {
  id: string;
  ideaId: string;                    // Link to original idea
  name: string;
  status: ProjectStatus;
  
  // Templates
  contractTemplateId?: string;
  frontendTemplateId?: string;
  
  // Code
  contractCode?: string;             // Editable Solidity
  frontendFiles?: { [key: string]: string };
  
  // Deployment
  testnetAddress?: string;
  testnetTxHash?: string;
  mainnetAddress?: string;
  mainnetTxHash?: string;
  
  createdAt: string;
  updatedAt: string;
}
```

### State Management (Zustand)

```typescript
// src/store/index.ts
export const useProjectsStore = create<ProjectsState>((set) => ({
  workspaces: [],
  activeWorkspaceId: null,
  
  addWorkspace: (workspace) => ...,
  updateWorkspace: (id, updates) => ...,
  updateStatus: (id, status) => ...,
}));
```

### Services

1. **workspaceService.ts**: Supabase CRUD operations
2. **deploymentService.ts**: Base Sepolia deployment with viem

---

## 🎮 User Flow

### 1. Launch a Project

From any idea detail page, creators see a **"🚀 Launch as Project"** button:

```tsx
<LaunchProjectButton ideaId={idea.id} ideaTitle={idea.title} />
```

This creates a new workspace in `MVP_PLANNING` status.

### 2. Select Templates

**Contract Tab**: Choose from 5 contract templates:
- Click template card to select
- View/edit Solidity code in textarea
- Templates are pre-filled with working code

**Frontend Tab**: Choose from 3 frontend templates:
- View tech stack (Next.js, wagmi, viem)
- Expand file tree to see code
- Copy code to local project

### 3. Customize Code

Edit contract directly in the UI:
```solidity
// Example: Change token supply
constructor(...) {
    _mint(msg.sender, 1000000 * 10 ** decimals()); // ← Edit here
}
```

### 4. Deploy to Testnet

**Deploy Tab**:
1. Connects wallet automatically
2. Compiles contract with solc
3. Estimates gas (~0.001 ETH)
4. Sends deployment transaction
5. Waits for confirmation
6. Updates workspace with address + tx hash

### 5. View on BaseScan

Once deployed:
```
Contract: 0xABC...
Tx Hash: 0x123...
[View on BaseScan →]
```

Status automatically updates to `MVP_DEPLOYED`.

---

## 📂 File Structure

```
protobase/
├── pages/
│   └── ProjectWorkspacePage.tsx       # Main workspace UI
├── src/
│   ├── components/
│   │   └── LaunchProjectButton.tsx    # Converts idea → workspace
│   ├── templates/
│   │   ├── contracts.ts               # 5 smart contract templates
│   │   └── frontend.ts                # 3 frontend templates
│   ├── services/
│   │   ├── workspaceService.ts        # Supabase CRUD
│   │   └── deploymentService.ts       # Base deployment
│   └── store/
│       └── index.ts                   # useProjectsStore
└── types.ts                            # ProjectWorkspace, ProjectStatus
```

---

## 🗄️ Database Schema

Run in Supabase SQL Editor:

```sql
CREATE TABLE project_workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID NOT NULL REFERENCES ideas(id),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'mvp_planning',
  
  contract_template_id TEXT,
  frontend_template_id TEXT,
  contract_code TEXT,
  frontend_files JSONB,
  
  testnet_address TEXT,
  testnet_tx_hash TEXT,
  mainnet_address TEXT,
  mainnet_tx_hash TEXT,
  
  creator_id UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deployed_at TIMESTAMPTZ
);
```

See `supabase_setup.sql` for complete schema with indexes and RLS.

---

## 🚀 Deployment Guide

### Prerequisites

1. **Wallet**: MetaMask or Coinbase Wallet
2. **Testnet ETH**: Get from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
3. **Supabase**: Update schema with workspace tables

### Steps

1. **Update Supabase Schema**:
   ```bash
   # In Supabase SQL Editor, run:
   cat supabase_setup.sql
   ```

2. **Connect Wallet**:
   - Click "Connect Wallet" in ProtoBase
   - Switch to Base Sepolia network

3. **Get Testnet ETH**:
   - Visit Base faucet
   - Request 0.1 ETH for testing

4. **Launch Project**:
   - Go to Ideate page
   - View your idea
   - Click "🚀 Launch as Project"

5. **Select Templates**:
   - Choose ERC20 or NFT template
   - Optionally choose frontend template

6. **Deploy**:
   - Go to Deploy tab
   - Click "🚀 Deploy Contract"
   - Confirm transaction in wallet

7. **Verify on BaseScan**:
   - Click "View on BaseScan →"
   - See contract code and transactions

---

## 🔧 Configuration

### Environment Variables

```env
# Required for deployment
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key

# Optional for contract verification
VITE_BASESCAN_API_KEY=your_api_key
```

### Adding New Templates

**Contract Template**:
```typescript
// src/templates/contracts.ts
{
  id: 'my-template',
  name: 'My Contract',
  description: 'Does something cool',
  category: 'defi',
  baseOptimized: true,
  contractCode: `
    pragma solidity ^0.8.20;
    // Your contract here
  `,
}
```

**Frontend Template**:
```typescript
// src/templates/frontend.ts
{
  id: 'my-frontend',
  name: 'My dApp',
  description: 'Frontend for my contract',
  techStack: ['Next.js 14', 'wagmi'],
  code: {
    'app/page.tsx': '...',
    'app/layout.tsx': '...',
  },
}
```

---

## 🎨 UI Components

### ProjectWorkspacePage

Main workspace interface with 4 tabs:

1. **Overview**: Status, metadata, quick actions
2. **Contract**: Template selection + code editor
3. **Frontend**: Template selection + code preview
4. **Deploy**: Deployment UI + transaction tracking

### LaunchProjectButton

Appears on idea detail pages for creators:

```tsx
{userId === idea.creator.id && (
  <LaunchProjectButton ideaId={idea.id} ideaTitle={idea.title} />
)}
```

### StatusBadge

Visual indicator of project progress:

- **Idea**: Gray
- **Planning**: Blue
- **Building**: Yellow
- **Deployed (Testnet)**: Green
- **Live (Mainnet)**: Purple

---

## 🔍 Technical Details

### Solidity Compilation

Uses `solc` package for in-browser compilation:

```typescript
import solc from 'solc';

export function compileSoliditySource(source: string) {
  const input = {
    language: 'Solidity',
    sources: { 'Contract.sol': { content: source } },
    settings: {
      outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } },
      optimizer: { enabled: true, runs: 200 },
    },
  };
  
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  // Extract bytecode and ABI
}
```

### Deployment with viem

```typescript
const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: custom(window.ethereum),
});

const hash = await walletClient.deployContract({
  abi,
  bytecode,
  account,
  args: constructorArgs,
});

const receipt = await publicClient.waitForTransactionReceipt({ hash });
```

### State Persistence

Workspaces auto-save to Supabase on every update:

```typescript
updateWorkspace(id, { contractCode: newCode });
// → Triggers Supabase UPDATE with updated_at timestamp
```

---

## 📊 Metrics & Analytics

Track user progress through MVP funnel:

1. **Ideas Created**: Users submit ideas
2. **Projects Launched**: Click "Launch as Project"
3. **Templates Selected**: Choose contract/frontend
4. **Deployments**: Successfully deploy to testnet
5. **Mainnet Launches**: Deploy to Base mainnet

Use these metrics to optimize the launch flow.

---

## 🐛 Troubleshooting

### Build Issues

**Problem**: Large bundle size (10MB+)
**Solution**: solc package is large. Consider backend compilation for production.

**Problem**: Module externalization warnings
**Solution**: Expected for Node.js modules. Vite polyfills automatically.

### Deployment Issues

**Problem**: "No wallet detected"
**Solution**: Install MetaMask or use Coinbase Wallet

**Problem**: "Transaction failed"
**Solution**: 
- Check wallet has testnet ETH
- Verify network is Base Sepolia
- Check contract compiles without errors

**Problem**: "Compilation failed"
**Solution**:
- Check Solidity syntax
- Verify pragma version matches solc (^0.8.20)
- Check OpenZeppelin imports are correct

---

## 🔮 Future Enhancements

1. **Constructor Params UI**: Dynamic forms for deployment params
2. **Backend Compilation**: Move solc to server for faster builds
3. **Contract Verification**: Auto-verify on BaseScan
4. **Mainnet Deployment**: Add mainnet deployment flow
5. **Template Marketplace**: Let users share custom templates
6. **CI/CD Integration**: Deploy on git push
7. **Multi-chain Support**: Deploy to other chains (Optimism, Arbitrum)

---

## 📚 Resources

- [Base Docs](https://docs.base.org)
- [Solidity Docs](https://docs.soliditylang.org)
- [wagmi Docs](https://wagmi.sh)
- [viem Docs](https://viem.sh)
- [OpenZeppelin](https://docs.openzeppelin.com)

---

## ✅ Checklist for Launch

- [ ] Update Supabase schema with workspace tables
- [ ] Test deployment on Base Sepolia
- [ ] Verify contracts on BaseScan
- [ ] Add frontend template deployment instructions
- [ ] Set up monitoring for failed deployments
- [ ] Create video tutorial for first-time users
- [ ] Add tooltips for complex UI elements
- [ ] Test with 5+ different wallet types

---

**Built with ❤️ for Base builders**
