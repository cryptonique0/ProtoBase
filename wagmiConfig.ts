import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors';

// Base Mainnet configuration
export const baseChain = base;

// WalletConnect Project ID - Users should replace this with their own
const projectId = (import.meta as any).env?.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    metaMask({
      dappMetadata: {
        name: 'ProtoBase',
        url: 'https://proto-base.vercel.app',
      },
    }),
    coinbaseWallet({
      appName: 'ProtoBase',
      appLogoUrl: 'https://proto-base.vercel.app/og-image.png',
    }),
    walletConnect({
      projectId,
      metadata: {
        name: 'ProtoBase',
        description: 'Build and launch onchain MVPs on Base',
        url: 'https://proto-base.vercel.app',
        icons: ['https://proto-base.vercel.app/og-image.png'],
      },
    }),
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
