
import React from 'react';
import { ContractModule, UITemplate } from './types';

export const CONTRACT_MODULES: ContractModule[] = [
  {
    id: 'rbac',
    name: 'RBAC Access Control',
    description: 'Granular permissioning system. Define roles like Admin, Minter, and Moderator securely.',
    category: 'Security',
    gasEstimate: '65k',
    status: 'Audited'
  },
  {
    id: 'erc721a',
    name: 'ERC-721A Base',
    description: 'Optimized NFT standard for batch minting with significantly lower gas costs on Base.',
    category: 'NFT',
    gasEstimate: '180k',
    status: 'Audited'
  },
  {
    id: 'vesting',
    name: 'Linear Vesting Vault',
    description: 'Time-locked token release mechanism perfect for team allocations and distributions.',
    category: 'DeFi',
    gasEstimate: '120k',
    status: 'Audited'
  },
  {
    id: 'governor',
    name: 'Governor Bravo',
    description: 'The standard for DAO governance. Includes proposal creation, voting, and execution.',
    category: 'Governance',
    gasEstimate: '450k',
    status: 'Audited'
  },
  {
    id: 'royalties',
    name: 'Royalties (EIP-2981)',
    description: 'Standardized royalty enforcement ensuring creators get paid on secondary marketplace sales.',
    category: 'NFT',
    gasEstimate: '25k',
    status: 'Audited'
  },
  {
    id: 'splitter',
    name: 'Payment Splitter',
    description: 'Automatically split incoming ETH payments among a group of accounts by pre-set shares.',
    category: 'Utility',
    gasEstimate: '45k',
    status: 'Audited'
  }
];

export const UI_TEMPLATES: UITemplate[] = [
  {
    id: 'crisis-hub',
    name: 'Crisis Response Hub',
    description: 'Ideal for emergency DAO coordination. Includes map views and role-aware admin controls.',
    previewUrl: 'https://picsum.photos/seed/crisis/400/225',
    features: ['Map View', 'Role-Aware', 'Fast Load']
  },
  {
    id: 'infinity-market',
    name: 'Infinity Market',
    description: 'High-performance NFT marketplace gallery with minting engine and wallet integration.',
    previewUrl: 'https://picsum.photos/seed/market/400/225',
    features: ['Mint Engine', 'Gallery View', 'React']
  },
  {
    id: 'council-gov',
    name: 'Council Governance',
    description: 'Reputation-based voting system with clear proposal tracking and history logs.',
    previewUrl: 'https://picsum.photos/seed/gov/400/225',
    features: ['Proposal UI', 'History Log', 'Web3-Wired']
  }
];
