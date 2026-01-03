<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ProtoBase - Build on Base Mainnet 🚀

An onchain product factory that transforms ideas into functional MVPs on the Base blockchain in days, not months. Now with **full Web3 integration** including real wallet connectivity and contract deployment!

View your app in AI Studio: https://ai.studio/apps/drive/1LICGfbyxl4KJJR9cYz6J6NvmdPfvPHkM

## ✨ Features

- 🤖 **AI-Powered Architecture** - Gemini-driven scope reduction and contract generation
- 🔗 **Real Wallet Connection** - MetaMask, Coinbase Smart Wallet, WalletConnect support
- ⛓️ **Base Network Integration** - Full integration with Base L2 (Chain ID: 8453)
- 📝 **Smart Contract Templates** - Modular, audited contract modules
- 🎨 **Pre-wired UI Kits** - Ready-to-deploy frontend templates
- 🚀 **One-Click Deployment** - Deploy contracts directly to Base network

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Web3**: viem + wagmi v2
- **AI**: Google Gemini AI
- **Blockchain**: Base Mainnet (Ethereum L2)
- **State Management**: @tanstack/react-query

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Web3 wallet (MetaMask, Coinbase Wallet, etc.)
- ETH on Base network (for real deployments)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd protobase
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```

3. **Edit `.env.local` with your keys:**
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Base Network Setup

The app is pre-configured for Base Mainnet:
- **Chain ID**: 8453
- **RPC URL**: https://mainnet.base.org
- **Block Explorer**: https://basescan.org

Testnet support (Base Sepolia - Chain ID 84532) is also available.

### Enable Real Contract Deployment

By default, deployment is **simulated** for safety. To enable real deployment:

1. Open `App.tsx`
2. Find the `<DeploymentPage />` component (around line 165)
3. Add `enableRealDeployment={true}`:

```tsx
<DeploymentPage 
  enableRealDeployment={true}  // Enable this for real deployment
  // ... other props
/>
```

**⚠️ Warning**: Real deployment requires ETH for gas fees and will deploy actual contracts to Base!

## 📚 Documentation

For detailed integration documentation, see [INTEGRATION.md](INTEGRATION.md)

## 🎯 How It Works

1. **Connect Wallet** - Click "Connect Wallet" and select your preferred wallet
2. **Describe Your Idea** - AI analyzes feasibility on Base blockchain  
3. **Select Modules** - Choose from audited smart contract templates
4. **Pick UI Template** - Select a pre-built frontend design
5. **Deploy** - One-click deployment to Base network
6. **Monitor** - Track your deployed contract

## 🧪 Testing

### Testnet (Recommended for development)

1. Switch to Base Sepolia testnet
2. Get test ETH from the [Base Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
3. Enable real deployment
4. Test contract deployment
5. Verify on [sepolia.basescan.org](https://sepolia.basescan.org)

## 📦 Build for Production

```bash
npm run build
npm run preview
```

## 🔐 Security

- Never commit `.env.local` with real API keys
- Test thoroughly on testnet before mainnet
- Real deployments require explicit wallet confirmation
- Contract bytecode is placeholder - integrate proper Solidity compiler for production

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Resources

- [Base Documentation](https://docs.base.org)
- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)
- [Coinbase Smart Wallet](https://www.coinbase.com/wallet)
- [BaseScan Explorer](https://basescan.org)

## 🙏 Acknowledgments

Built for the Base ecosystem with support from:
- Coinbase & Base team
- Google Gemini AI
- Wagmi & Viem communities

---

**Made with ❤️ for builders on Base**
