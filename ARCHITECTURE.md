# ProtoStack Architecture Document

## Week 1 Implementation Summary

### Overview
ProtoStack is an integrated platform for rapid MVP development on Base L2. Week 1 focused on establishing clean architecture and the foundational ProtoVM Profiles module.

---

## 📁 Folder Structure

```
protobase/
├── src/
│   ├── modules/                 # Feature modules (new)
│   │   ├── profiles/            # ProtoVM Profiles
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── ProjectsList.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── EmptyProjectsState.tsx
│   │   │   └── index.ts
│   │   ├── projects/            # TODO: Week 2
│   │   └── contracts/           # TODO: Week 2
│   ├── components/              # Shared UI components
│   │   ├── ProtoStackLanding.tsx
│   │   └── index.ts
│   ├── lib/                     # Utilities (TODO)
│   └── types/                   # TypeScript definitions
│       ├── profile.types.ts     # ProtoVM types
│       └── index.ts
├── pages/                       # Legacy pages (to be migrated)
├── wagmiConfig.ts               # Web3 configuration
├── contractDeployer.ts          # Deployment utilities
└── App.tsx                      # Main app component
```

---

## 🏗️ Module Architecture

### Design Principles

1. **Module Isolation**: Each module in `src/modules/` is self-contained
2. **Clean Exports**: Modules export through index.ts barrel files
3. **Type Safety**: All interfaces defined in `src/types/`
4. **Composability**: Components designed to work together
5. **Future-Ready**: TODO comments mark extension points

### Module Pattern

```typescript
src/modules/[module-name]/
├── components/              # Module-specific components
├── hooks/                  # Module-specific hooks (Week 2)
├── utils/                  # Module-specific utilities
├── types.ts                # Module-specific types (if needed)
└── index.ts                # Public API exports
```

---

## 📊 Type System

### Core Types (src/types/profile.types.ts)

```typescript
// Builder Identity
interface BuilderProfile {
  id: string;
  address: `0x${string}`;
  username?: string;
  displayName?: string;
  bio?: string;
  reputation: BuilderReputation;
  socials?: BuilderSocials;
  createdAt: Date;
  updatedAt: Date;
}

// Project Ownership
interface BuilderProject {
  id: string;
  name: string;
  ownerId: string;
  ownerAddress: `0x${string}`;
  contractAddress?: `0x${string}`;
  chainId: number;
  category: ProjectCategory;
  status: ProjectStatus;
  modules: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Reputation System
interface BuilderReputation {
  xp: number;
  level: number;
  projectsLaunched: number;
  contractsDeployed: number;
  totalGasOptimized: bigint;
  badges?: Badge[];
}
```

---

## 🎨 Component Architecture

### ProtoVM Profiles Components

#### ProfileHeader
- **Purpose**: Display builder identity and stats
- **Props**: `profile`, `isOwnProfile`, `onEdit`
- **Features**:
  - Avatar display (with fallback)
  - Username and display name
  - Bio text
  - Reputation metrics (XP, Level, Projects)
  - Social links
  - Edit button (owner only)

#### ProjectsList
- **Purpose**: Display builder's projects
- **Props**: `projects`, `isOwnProfile`, `onCreateProject`
- **Features**:
  - Grid layout (responsive)
  - Project count
  - Create button (owner only)
  - Empty state handling

#### ProjectCard
- **Purpose**: Individual project preview
- **Props**: `project`
- **Features**:
  - Status badge
  - Project name and description
  - Module tags
  - BaseScan link (if deployed)
  - Category display
  - Deployment date

#### EmptyProjectsState
- **Purpose**: Onboarding for builders without projects
- **Props**: `isOwnProfile`, `onCreateProject`
- **Features**:
  - Different messages for owner vs visitor
  - CTA button for owners
  - Icon and descriptive text

---

## 🔄 Data Flow (Future)

### Week 2+ Architecture

```
User Action → React Component → Hook → Supabase → Database
                                  ↓
                            Wagmi Hook → Base Network
```

### Planned Hooks (Week 2)

```typescript
// Profile management
useBuilderProfile(address: `0x${string}`)
useUpdateProfile()
useCreateProfile()

// Project management
useBuilderProjects(ownerId: string)
useCreateProject()
useUpdateProject()
useDeployProject()
```

---

## 🚀 Integration Points

### Current Integrations

1. **Wagmi/Viem** (wagmiConfig.ts)
   - Wallet connection
   - Network switching
   - Transaction signing

2. **Gemini AI** (geminiService.ts)
   - Contract generation
   - Feasibility analysis

3. **Base Network**
   - Mainnet (8453)
   - Sepolia testnet (84532)

### Future Integrations (Week 2+)

1. **Supabase**
   - Profile storage
   - Project database
   - Real-time updates

2. **BaseScan API**
   - Contract verification
   - Transaction monitoring

3. **IPFS**
   - Metadata storage
   - Avatar uploads

---

## 🎯 Week 2 Planning

### ProtoGen AI Module

**Location**: `src/modules/ai/`

**Files to Create**:
```
src/modules/ai/
├── ContractGenerator.tsx    # UI for generation
├── FeasibilityAnalyzer.tsx  # Analysis display
├── ModuleSuggester.tsx       # Recommend modules
├── hooks/
│   ├── useGenerateContract.ts
│   └── useAnalyzeIdea.ts
└── index.ts
```

**Types to Add**:
```typescript
interface ContractGenerationRequest {
  idea: string;
  targetUsers: string;
  modules: string[];
}

interface GenerationResult {
  sourceCode: string;
  abi: any[];
  bytecode: `0x${string}`;
  gasEstimate: bigint;
  suggestions: string[];
}
```

---

## 🛠️ Development Guidelines

### Code Style

1. **TypeScript**: Strict mode enabled
2. **Components**: Functional components with TypeScript
3. **Props**: Always define interfaces
4. **Exports**: Use named exports
5. **TODOs**: Mark future work clearly

### File Naming

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Types: `kebab-case.types.ts`
- Utils: `kebab-case.utils.ts`

### Component Structure

```typescript
import React from 'react';
import type { /* types */ } from '../../types';

interface ComponentProps {
  // Props definition
}

export const Component: React.FC<ComponentProps> = ({ /* props */ }) => {
  // Component logic
  
  return (
    // JSX
  );
};
```

---

## 📈 Scalability Considerations

### Current Decisions

1. **Module-based architecture**: Easy to add new features
2. **Type-first development**: Prevents bugs early
3. **Composition over inheritance**: Flexible component design
4. **Barrel exports**: Clean import paths

### Future Optimizations

1. **Code splitting**: Dynamic imports for modules
2. **State management**: Zustand/Jotai for global state
3. **Caching**: React Query for server state
4. **Performance**: React.memo for expensive components

---

## 🔒 Security Architecture

### Current Measures

1. **Wallet-only auth**: No passwords or emails
2. **Environment variables**: Sensitive data protected
3. **Type safety**: Prevents common bugs
4. **Address validation**: Checksummed addresses only

### Future Security

1. **Rate limiting**: API call throttling
2. **Input validation**: Zod schemas
3. **CSRF protection**: Token-based
4. **Audit logs**: Track profile changes

---

## 📝 Migration Plan

### Legacy Code

Files in root and `pages/` directory are legacy code from the original ProtoBase implementation.

**Migration Strategy**:
1. Keep working during Week 1-2
2. Week 3: Move contract-related code to `src/modules/contracts/`
3. Week 4: Move deployment logic to `src/modules/deploy/`
4. Week 5: Move UI templates to `src/modules/ui/`
5. Week 6: Complete migration, remove legacy files

---

## ✅ Week 1 Accomplishments

- [x] Clean folder structure established
- [x] Type system for profiles and projects
- [x] ProfileHeader component with stats
- [x] ProjectsList with empty state
- [x] ProjectCard display
- [x] ProtoStack landing page
- [x] Comprehensive README
- [x] Architecture documentation

---

**Status**: Week 1 Foundation Complete ✅

**Next**: Week 2 - ProtoGen AI Module

*Document version: 1.0*
*Last updated: January 3, 2026*
