import { FrontendTemplate } from '../../types';

/**
 * Frontend Templates for Base dApps
 * Next.js + wagmi + viem starter templates
 */
export const frontendTemplates: FrontendTemplate[] = [
  {
    id: 'token-dashboard',
    name: 'Token Dashboard',
    description: 'Display token balance, transfer, and approve functions',
    techStack: ['Next.js 14', 'wagmi', 'viem', 'Tailwind CSS'],
    code: {
      'app/page.tsx': `'use client';

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { useState } from 'react';

const TOKEN_ADDRESS = '0x...'; // Your deployed token address
const TOKEN_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

export default function TokenDashboard() {
  const { address } = useAccount();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const { data: balance } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { writeContract, isPending } = useWriteContract();

  const handleTransfer = () => {
    if (!recipient || !amount) return;
    writeContract({
      address: TOKEN_ADDRESS,
      abi: TOKEN_ABI,
      functionName: 'transfer',
      args: [recipient as \`0x\${string}\`, parseEther(amount)],
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Token Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Balance</h2>
        <p className="text-4xl font-bold text-blue-600">
          {balance ? formatEther(balance) : '0'} TOKENS
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Transfer Tokens</h2>
        <input
          type="text"
          placeholder="Recipient address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />
        <button
          onClick={handleTransfer}
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'Transferring...' : 'Transfer'}
        </button>
      </div>
    </div>
  );
}`,
      'app/layout.tsx': `import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './wagmi-config';

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}`,
    },
  },
  {
    id: 'nft-mint',
    name: 'NFT Minting Page',
    description: 'Mint NFTs with preview and transaction status',
    techStack: ['Next.js 14', 'wagmi', 'viem', 'Tailwind CSS'],
    code: {
      'app/page.tsx': `'use client';

import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState } from 'react';

const NFT_ADDRESS = '0x...'; // Your deployed NFT address
const NFT_ABI = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'to', type: 'address' }],
    outputs: [],
  },
] as const;

export default function NFTMint() {
  const { address } = useAccount();
  const [mintedTokenId, setMintedTokenId] = useState<number | null>(null);

  const { data: hash, writeContract, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleMint = () => {
    if (!address) return;
    writeContract({
      address: NFT_ADDRESS,
      abi: NFT_ABI,
      functionName: 'mint',
      args: [address],
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-12">Mint Your NFT</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">NFT Preview</h2>
          <div className="aspect-square bg-white/20 rounded-xl flex items-center justify-center">
            <p className="text-6xl">🎨</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Mint Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Price:</span> Free</p>
              <p><span className="font-medium">Network:</span> Base</p>
              <p><span className="font-medium">Supply:</span> Unlimited</p>
            </div>
          </div>

          <button
            onClick={handleMint}
            disabled={isPending || isConfirming || !address}
            className="w-full bg-purple-600 text-white py-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-semibold"
          >
            {isPending ? 'Confirm in wallet...' : isConfirming ? 'Minting...' : isSuccess ? '✓ Minted!' : 'Mint NFT'}
          </button>

          {hash && (
            <div className="bg-blue-50 rounded-lg p-4 text-sm">
              <p className="font-medium mb-2">Transaction Hash:</p>
              <p className="text-blue-600 break-all">{hash}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}`,
    },
  },
  {
    id: 'dao-voting',
    name: 'DAO Voting Interface',
    description: 'Create and vote on proposals',
    techStack: ['Next.js 14', 'wagmi', 'viem', 'Tailwind CSS'],
    code: {
      'app/page.tsx': `'use client';

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { useState } from 'react';

const DAO_ADDRESS = '0x...'; // Your deployed DAO address
const DAO_ABI = [
  {
    name: 'createProposal',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'description', type: 'string' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'vote',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'proposalId', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'proposalCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

export default function DAOVoting() {
  const { address } = useAccount();
  const [newProposal, setNewProposal] = useState('');

  const { data: proposalCount } = useReadContract({
    address: DAO_ADDRESS,
    abi: DAO_ABI,
    functionName: 'proposalCount',
  });

  const { writeContract, isPending } = useWriteContract();

  const handleCreateProposal = () => {
    if (!newProposal) return;
    writeContract({
      address: DAO_ADDRESS,
      abi: DAO_ABI,
      functionName: 'createProposal',
      args: [newProposal],
    });
    setNewProposal('');
  };

  const handleVote = (proposalId: number) => {
    writeContract({
      address: DAO_ADDRESS,
      abi: DAO_ABI,
      functionName: 'vote',
      args: [BigInt(proposalId)],
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">DAO Governance</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Proposal</h2>
        <textarea
          value={newProposal}
          onChange={(e) => setNewProposal(e.target.value)}
          placeholder="Describe your proposal..."
          className="w-full p-3 border rounded mb-4 h-24"
        />
        <button
          onClick={handleCreateProposal}
          disabled={isPending || !newProposal}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'Creating...' : 'Submit Proposal'}
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Active Proposals</h2>
        <p className="text-gray-600">Total: {proposalCount?.toString() || '0'}</p>
        {/* Map proposals here */}
      </div>
    </div>
  );
}`,
    },
  },
];
