// Test the solc compiler integration
// Run with: npx ts-node testCompiler.ts

import { compileSoliditySource } from './contractDeployer';

// Simple test contract
const testContract = `
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 private storedValue;

    event ValueChanged(uint256 indexed newValue);

    function store(uint256 value) public {
        storedValue = value;
        emit ValueChanged(value);
    }

    function retrieve() public view returns (uint256) {
        return storedValue;
    }
}
`;

// Test compilation
console.log('🧪 Testing Solidity Compiler...\n');

try {
  console.log('📝 Compiling contract...');
  const { bytecode, abi } = compileSoliditySource(testContract);
  
  console.log('✅ Compilation successful!\n');
  console.log('📊 Compilation Results:');
  console.log(`  Bytecode length: ${bytecode.length} chars`);
  console.log(`  Bytecode (first 50): ${bytecode.slice(0, 50)}...`);
  console.log(`  ABI functions: ${abi.length}`);
  console.log('\n📋 ABI:');
  abi.forEach((func, idx) => {
    console.log(`  ${idx + 1}. ${func.name} (${func.type})`);
  });
  
  console.log('\n✨ All tests passed! Compiler is working correctly.');
  
} catch (error) {
  console.error('❌ Compilation failed:');
  console.error(error);
  process.exit(1);
}
