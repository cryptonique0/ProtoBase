# Solidity Compiler Integration Guide

## Overview

The `contractDeployer.ts` now supports **real Solidity compilation** using three different approaches.

---

## Option 1: `solc` Package (✅ RECOMMENDED - Already Installed)

### What is it?
The official Solidity compiler compiled to JavaScript/WebAssembly. Works in the browser and Node.js.

### ✅ Already Done
```bash
npm install solc  # Already installed ✓
```

### Status
**ACTIVE** - The `compileSoliditySource` function now uses solc for real compilation.

### Usage Example

```typescript
import { deployContract, compileSoliditySource } from './contractDeployer';

// Define your Solidity contract
const solidityCode = `
pragma solidity ^0.8.20;

contract MyToken {
    string public name = "MyToken";
    uint256 public totalSupply = 1000;
    
    function burn(uint256 amount) public {
        totalSupply -= amount;
    }
}
`;

// Compile it
const { bytecode, abi } = compileSoliditySource(solidityCode);

// Deploy it
const result = await deployContract(
  walletClient,
  publicClient,
  bytecode,
  abi,
  [] // constructor args
);

console.log('Contract deployed at:', result.contractAddress);
```

### Pros ✅
- Works client-side (no backend needed)
- Lightweight
- Already installed
- No additional dependencies
- Good for MVP

### Cons ❌
- Slower first compilation (~5-10 seconds, cached after)
- Large bundle size (~1.4 MB compressed to 350KB)
- Limited optimization options

### Configuration

Edit Solidity version in your contract:
```solidity
pragma solidity ^0.8.20;  // solc will compile to this version
```

The compiler automatically optimizes with:
```typescript
optimizer: {
  enabled: true,
  runs: 200,  // Gas optimization level (200 = balanced)
}
```

---

## Option 2: Backend Compilation Service (Recommended for Production)

### What is it?
Offload compilation to a backend server or third-party API.

### Services Available

#### **A) Etherscan API** (Free, Fast)
```bash
npm install axios
```

```typescript
// src/lib/etherscanCompiler.ts
export async function compileWithEtherscan(source: string, version: string = 'v0.8.20') {
  const response = await fetch('https://api.etherscan.io/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      apikey: process.env.VITE_ETHERSCAN_API_KEY || '',
      module: 'contract',
      action: 'verifysourcecode',
      sourceCode: source,
      codeformat: 'solidity-single-file',
      contractname: 'Contract',
      compilerversion: version,
      optimizationUsed: '1',
      runs: '200',
    }),
  });
  
  const data = await response.json();
  if (data.status === '0') throw new Error(data.message);
  return data.result;
}
```

#### **B) Alchemy Compiler API**
```typescript
export async function compileWithAlchemy(source: string) {
  const response = await fetch('https://api.alchemy.com/compile', {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.VITE_ALCHEMY_API_KEY || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      language: 'Solidity',
      sources: { 'contract.sol': { content: source } },
      settings: {
        outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } },
        optimizer: { enabled: true, runs: 200 },
      },
    }),
  });
  
  return response.json();
}
```

#### **C) Your Own Backend**
```typescript
export async function compileWithBackend(source: string) {
  const response = await fetch('https://your-backend.com/api/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: source }),
  });
  
  const { bytecode, abi } = await response.json();
  return { bytecode: `0x${bytecode}`, abi };
}
```

### Pros ✅
- Fastest compilation
- Smaller bundle (no compiler code)
- Professional (can cache, optimize)
- Support multiple Solidity versions
- Can add custom optimizations

### Cons ❌
- Requires backend/API
- Network latency
- API costs (sometimes)
- Extra complexity

---

## Option 3: Hardhat / Foundry (Advanced)

### What is it?
Professional development frameworks with built-in compilers.

### Install Hardhat
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

npx hardhat  # Initialize project
```

### Use in Project

```typescript
// src/lib/hardhatCompiler.ts
import { execSync } from 'child_process';
import * as fs from 'fs';

export async function compileWithHardhat(source: string, filename: string = 'temp.sol') {
  // Write contract to temp file
  fs.writeFileSync(filename, source);
  
  // Run hardhat compile
  try {
    execSync('npx hardhat compile', { stdio: 'pipe' });
    
    // Read artifacts
    const artifact = JSON.parse(
      fs.readFileSync(`./artifacts/contracts/${filename}/Contract.json`, 'utf-8')
    );
    
    return {
      bytecode: artifact.bytecode as `0x${string}`,
      abi: artifact.abi,
    };
  } finally {
    fs.unlinkSync(filename);
  }
}
```

### Pros ✅
- Industrial-strength compiler
- Best optimization
- Test integration
- Network integration
- Gas estimation

### Cons ❌
- Complex setup
- Backend/CLI only (not browser)
- Slower first compile
- Overkill for MVP

---

## Comparison Table

| Feature | solc | Backend API | Hardhat |
|---------|------|-------------|---------|
| **Speed** | Slow (5-10s) | Fast (<1s) | Medium (2-5s) |
| **Setup** | Easy | Medium | Hard |
| **Bundle Size** | Large (+350KB) | None | None |
| **Client-side** | ✅ Yes | ❌ No | ❌ No |
| **Production Ready** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Cost** | Free | Free-$$ | Free |
| **Recommended** | **MVP** | **Production** | **Enterprise** |

---

## Current Implementation

### What's Active Right Now

Your `contractDeployer.ts` now uses **solc** (Option 1):

```typescript
export function compileSoliditySource(source: string): { bytecode: `0x${string}`; abi: any[] } {
  const solc = require('solc');
  
  const input = {
    language: 'Solidity',
    sources: { 'Contract.sol': { content: source } },
    settings: {
      outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } },
      optimizer: { enabled: true, runs: 200 },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  
  // Extract and return bytecode + ABI
  const contract = output.contracts['Contract.sol'][contractName];
  return { 
    bytecode: `0x${contract.evm.bytecode.object}`,
    abi: contract.abi 
  };
}
```

### How to Switch Options

#### To use Backend API instead of solc:

```typescript
// src/lib/backendCompiler.ts
export async function compileSoliditySource(source: string): Promise<{ bytecode: `0x${string}`; abi: any[] }> {
  const response = await fetch('/api/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: source }),
  });
  
  const { bytecode, abi } = await response.json();
  return { bytecode: `0x${bytecode}`, abi };
}
```

Then update `contractDeployer.ts`:
```typescript
import { compileSoliditySource } from './lib/backendCompiler';
// Rest stays the same!
```

---

## Testing Your Compiler

### Simple Test

```typescript
// Test compilation
const code = `
pragma solidity ^0.8.20;
contract Test {
  uint public x = 1;
}
`;

try {
  const { bytecode, abi } = compileSoliditySource(code);
  console.log('✅ Compilation successful!');
  console.log('Bytecode length:', bytecode.length);
  console.log('ABI functions:', abi.length);
} catch (error) {
  console.error('❌ Compilation failed:', error);
}
```

### Full End-to-End Test

```typescript
async function testFullFlow() {
  // 1. Compile
  const source = `pragma solidity ^0.8.20; contract Test { function hello() public pure returns (string memory) { return "world"; } }`;
  const { bytecode, abi } = compileSoliditySource(source);
  console.log('✅ Compiled:', bytecode.slice(0, 20) + '...');

  // 2. Deploy
  try {
    const result = await deployContract(
      walletClient,
      publicClient,
      bytecode,
      abi,
      []
    );
    console.log('✅ Deployed at:', result.contractAddress);
  } catch (error) {
    console.error('❌ Deployment failed:', error);
  }
}
```

---

## Troubleshooting

### "Module not found: solc"
```bash
npm install solc
npm run build  # Rebuild
```

### "Compilation errors" message
Check your Solidity syntax:
- Missing semicolons
- Invalid pragma version
- Undefined variables

Example error handling:
```typescript
try {
  const { bytecode, abi } = compileSoliditySource(source);
} catch (error) {
  console.error('Compilation failed:', error);
  // Show user-friendly error
}
```

### Slow Compilation (First Time)
Normal! solc caches after first compilation. Subsequent runs are faster.

---

## Migration Path

### From MVP to Production

**Week 1-2 (Now):** Use solc ✅
```
✅ Works
✅ No backend needed
✅ Good for testing
```

**Week 3-4:** Add Backend Option
```
✅ Better performance
✅ Smaller bundle
✅ More scalable
```

**Week 5+:** Full Backend Integration
```
✅ Production-ready
✅ Custom optimizations
✅ Gas estimation
```

---

## Deployment Checklist

- [x] solc installed
- [x] compileSoliditySource updated
- [x] Error handling added
- [ ] Test with sample contract
- [ ] Optimize gas settings (if needed)
- [ ] Add rate limiting (for production)
- [ ] Cache compiled bytecodes

---

## Environment Variables (If Using Backend)

```env
# For backend compilation
VITE_ETHERSCAN_API_KEY=your_key_here
VITE_ALCHEMY_API_KEY=your_key_here
VITE_COMPILE_API_URL=https://your-backend.com/api/compile
```

---

## Next Steps

1. **Test It**: Deploy a simple contract using solc
2. **Monitor Performance**: Check compilation times
3. **Decide on Scale**: If too slow, switch to backend option
4. **Document Flow**: Update README with how to submit contracts

---

## Resources

- [Solc Documentation](https://docs.soliditylang.org/en/latest/using-the-compiler.html)
- [Solc JS Package](https://github.com/ethereum/solc-js)
- [Hardhat Docs](https://hardhat.org/docs)
- [Foundry Docs](https://book.getfoundry.sh)
- [Etherscan API](https://docs.etherscan.io)
