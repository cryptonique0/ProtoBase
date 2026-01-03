
import React from 'react';
import { ContractModule, UITemplate } from './types';

export const CONTRACT_MODULES: ContractModule[] = [
  {
    id: 'rbac',
    name: 'RBAC Access Control',
    description: 'Granular permissioning system. Define roles like Admin, Minter, and Moderator securely.',
    category: 'Security',
    gasEstimate: '65k',
    status: 'Audited',
    documentation: {
      functions: [
        { 
          name: 'grantRole', 
          description: 'Grants a specific role to an account.',
          params: [
            { name: 'role', type: 'bytes32', description: 'The role identifier hash.' },
            { name: 'account', type: 'address', description: 'The recipient address.' }
          ]
        },
        { 
          name: 'hasRole', 
          description: 'Checks if an account possesses a specific role.',
          params: [
            { name: 'role', type: 'bytes32', description: 'The role to check.' },
            { name: 'account', type: 'address', description: 'The address to verify.' }
          ]
        }
      ],
      events: [
        { name: 'RoleGranted', description: 'Emitted when a role is granted to an account.' },
        { name: 'RoleRevoked', description: 'Emitted when a role is revoked from an account.' }
      ]
    }
  },
  {
    id: 'erc721a',
    name: 'ERC-721A Base',
    description: 'Optimized NFT standard for batch minting with significantly lower gas costs on Base.',
    category: 'NFT',
    gasEstimate: '180k',
    status: 'Audited',
    documentation: {
      functions: [
        { 
          name: 'safeMint', 
          description: 'Mints a token safely to a specific address.',
          params: [
            { name: 'to', type: 'address', description: 'Recipient of the NFT.' },
            { name: 'quantity', type: 'uint256', description: 'Number of tokens to mint.' }
          ]
        }
      ],
      events: [
        { name: 'Transfer', description: 'Emitted when tokens are transferred.' }
      ]
    }
  },
  {
    id: 'vesting',
    name: 'Linear Vesting Vault',
    description: 'Time-locked token release mechanism perfect for team allocations and distributions.',
    category: 'DeFi',
    gasEstimate: '120k',
    status: 'Audited',
    documentation: {
      functions: [
        { 
          name: 'release', 
          description: 'Releases the tokens that have vested as of the current time.',
          params: [{ name: 'token', type: 'address', description: 'The token contract address.' }]
        },
        { 
          name: 'vestedAmount', 
          description: 'Calculates the amount of tokens that have already vested.',
          params: [{ name: 'timestamp', type: 'uint64', description: 'The time point to calculate for.' }]
        }
      ],
      events: [
        { name: 'TokensReleased', description: 'Emitted when tokens are successfully released.' }
      ]
    }
  },
  {
    id: 'governor',
    name: 'Governor Bravo',
    description: 'The standard for DAO governance. Includes proposal creation, voting, and execution.',
    category: 'Governance',
    gasEstimate: '450k',
    status: 'Audited',
    documentation: {
      functions: [
        { 
          name: 'propose', 
          description: 'Creates a new governance proposal.',
          params: [
            { name: 'targets', type: 'address[]', description: 'Contracts to call.' },
            { name: 'values', type: 'uint256[]', description: 'ETH values for calls.' },
            { name: 'description', type: 'string', description: 'Human-readable description.' }
          ]
        },
        { 
          name: 'castVote', 
          description: 'Casts a vote on an active proposal.',
          params: [
            { name: 'proposalId', type: 'uint256', description: 'Target proposal ID.' },
            { name: 'support', type: 'uint8', description: '0=Against, 1=For, 2=Abstain.' }
          ]
        }
      ],
      events: [
        { name: 'ProposalCreated', description: 'Emitted when a new proposal is indexed.' },
        { name: 'VoteCast', description: 'Emitted when a vote is recorded.' }
      ]
    }
  },
  {
    id: 'royalties',
    name: 'Royalties (EIP-2981)',
    description: 'Standardized royalty enforcement ensuring creators get paid on secondary marketplace sales.',
    category: 'NFT',
    gasEstimate: '25k',
    status: 'Audited',
    documentation: {
      functions: [
        { 
          name: 'royaltyInfo', 
          description: 'Retrieves royalty information for a token sale.',
          params: [
            { name: 'tokenId', type: 'uint256', description: 'The NFT being sold.' },
            { name: 'salePrice', type: 'uint256', description: 'The gross sale amount.' }
          ]
        }
      ],
      events: []
    }
  },
  {
    id: 'splitter',
    name: 'Payment Splitter',
    description: 'Automatically split incoming ETH payments among a group of accounts by pre-set shares.',
    category: 'Utility',
    gasEstimate: '45k',
    status: 'Audited',
    documentation: {
      functions: [
        { 
          name: 'release', 
          description: 'Triggers a payout of owed ETH to an account.',
          params: [{ name: 'account', type: 'address', description: 'Recipient address.' }]
        },
        { 
          name: 'releasable', 
          description: 'Checks how much ETH is currently due to an account.',
          params: [{ name: 'account', type: 'address', description: 'Address to check.' }]
        }
      ],
      events: [
        { name: 'PaymentReleased', description: 'Emitted when a share is paid out.' },
        { name: 'PaymentReceived', description: 'Emitted when funds enter the splitter.' }
      ]
    }
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
