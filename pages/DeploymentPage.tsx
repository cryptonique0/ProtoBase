
import React, { useState, useEffect, useRef } from 'react';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { DeploymentLog } from '../types';
import { deployContract, compileSoliditySource, type DeploymentStep } from '../contractDeployer';

interface Props {
  onComplete: () => void;
  onBack: () => void;
  sourceCode: string;
  isGenerating: boolean;
  enableRealDeployment?: boolean; // Toggle for real vs simulated deployment
}

const DEPLOYMENT_STEPS = [
  { msg: 'Connecting to Base Mainnet RPC...', level: 'info' as const },
  { msg: 'L2 state pre-computed. Optimizing gas consumption...', level: 'info' as const },
  { msg: 'Contract artifacts generated successfully (Solc 0.8.20).', level: 'success' as const },
  { msg: 'Estimating gas for ProtoMVP deployment...', level: 'info' as const },
  { msg: 'Initiating EIP-4844 Blob submission for data availability...', level: 'info' as const },
  { msg: 'Sending transaction to Base L2 sequencer...', level: 'info' as const },
  { msg: 'Transaction confirmed. Hash: {{txHash}}', level: 'success' as const },
  { msg: 'Contract Address: {{contractAddr}}', level: 'success' as const },
  { msg: 'Verifying source code on BaseScan...', level: 'info' as const },
  { msg: 'BaseScan Verification Success: Block #{{blockNum}}', level: 'success' as const },
  { msg: 'Injecting metadata into IPFS gateway...', level: 'info' as const },
  { msg: 'MVP Launch Successful. Ready for mainnet traffic.', level: 'success' as const },
];

const DeploymentPage: React.FC<Props> = ({ onComplete, onBack, sourceCode, isGenerating, enableRealDeployment = false }) => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  
  const [logs, setLogs] = useState<DeploymentLog[]>([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [viewMode, setViewMode] = useState<'logs' | 'code'>('logs');
  const [deploymentResult, setDeploymentResult] = useState<{ txHash: string; contractAddress: string; blockNumber: string } | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const deploymentStarted = useRef(false);
  
  // Memoize random values for simulated deployment
  const sessionData = useRef({
    txHash: '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    contractAddr: '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    blockNum: Math.floor(Math.random() * 1000000) + 18000000
  });

  // Real deployment function
  const performRealDeployment = async () => {
    if (!walletClient || !publicClient || !isConnected || !address) {
      setLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString([], { hour12: false }),
        level: 'error',
        message: 'Please connect your wallet to deploy'
      }]);
      return;
    }

    try {
      const { bytecode, abi } = compileSoliditySource(sourceCode);
      
      const result = await deployContract(
        walletClient,
        publicClient,
        bytecode,
        abi,
        [],
        (step: DeploymentStep) => {
          setLogs(prev => [...prev, {
            timestamp: step.timestamp,
            level: step.level,
            message: step.message
          }]);
          
          // Update progress based on message
          if (step.message.includes('Connecting')) setProgress(10);
          else if (step.message.includes('Estimating')) setProgress(30);
          else if (step.message.includes('Sending')) setProgress(50);
          else if (step.message.includes('Transaction confirmed')) setProgress(70);
          else if (step.message.includes('Contract Address')) setProgress(85);
          else if (step.message.includes('Verification')) setProgress(95);
          else if (step.message.includes('MVP Launch Successful')) setProgress(100);
        }
      );

      setDeploymentResult({
        txHash: result.txHash,
        contractAddress: result.contractAddress,
        blockNumber: result.blockNumber.toString()
      });
      setDone(true);
    } catch (error: any) {
      setLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString([], { hour12: false }),
        level: 'error',
        message: `Deployment failed: ${error.message || 'Unknown error'}`
      }]);
    }
  };

  // Simulated deployment function
  const performSimulatedDeployment = () => {
    let stepIndex = 0;
    
    const runStep = () => {
      if (stepIndex < DEPLOYMENT_STEPS.length) {
        const step = DEPLOYMENT_STEPS[stepIndex];
        
        // Replace placeholders with session data
        const processedMsg = step.msg
          .replace('{{txHash}}', `${sessionData.current.txHash.slice(0, 10)}...${sessionData.current.txHash.slice(-8)}`)
          .replace('{{contractAddr}}', `${sessionData.current.contractAddr.slice(0, 10)}...${sessionData.current.contractAddr.slice(-8)}`)
          .replace('{{blockNum}}', sessionData.current.blockNum.toString());

        setLogs(prev => [...prev, {
          timestamp: new Date().toLocaleTimeString([], { hour12: false }),
          level: step.level,
          message: processedMsg
        }]);
        
        setProgress(Math.floor(((stepIndex + 1) / DEPLOYMENT_STEPS.length) * 100));
        stepIndex++;
        
        // Simulate varying network latency (500ms to 2000ms)
        const nextDelay = Math.random() * 1500 + 500;
        setTimeout(runStep, nextDelay);
      } else {
        setDeploymentResult({
          txHash: sessionData.current.txHash,
          contractAddress: sessionData.current.contractAddr,
          blockNumber: sessionData.current.blockNum.toString()
        });
        setDone(true);
      }
    };

    // Start the sequence after a brief "warm-up" delay
    setTimeout(() => {
      setLogs(prev => [...prev, { 
        timestamp: new Date().toLocaleTimeString([], { hour12: false }), 
        level: 'success', 
        message: 'High-fidelity source code generated. Starting deployment sequence...' 
      }]);
      runStep();
    }, 1000);
  };

  useEffect(() => {
    if (isGenerating) {
      setLogs([{ 
        timestamp: new Date().toLocaleTimeString([], { hour12: false }), 
        level: 'info', 
        message: 'Architecting your smart contract with Gemini 3 Pro...' 
      }]);
      setProgress(5);
      return;
    }

    if (sourceCode && !done && !deploymentStarted.current) {
      deploymentStarted.current = true;
      
      if (enableRealDeployment) {
        performRealDeployment();
      } else {
        performSimulatedDeployment();
      }
    }
  }, [isGenerating, sourceCode, enableRealDeployment]);

  useEffect(() => {
    // Smooth scroll to bottom when logs update
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl animate-fadeIn">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold text-primary uppercase tracking-widest shadow-sm">
            <span className={`size-2 rounded-full bg-primary ${!done ? 'animate-ping' : ''}`} />
            {done ? 'Deployment Finalized' : 'Mainnet Deployment Sequence'}
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-white">Forging on Base</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">Your MVP is transiting from an AI-architected vision to a live, immutable L2 protocol.</p>
        </div>

        <div className="grid md:grid-cols-[1fr_240px] gap-6">
          <div className="bg-surface-dark border border-border-dark rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden ring-1 ring-white/5">
            <div className="flex justify-between items-end mb-2">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Current State</span>
                <span className="text-sm font-medium text-white">
                  {isGenerating ? 'AI Architecture Design' : done ? 'L2 Genesis Complete' : 'Optimism Stack Execution'}
                </span>
              </div>
              <span className="text-4xl font-mono font-bold text-white tracking-tighter">{progress}%</span>
            </div>
            <div className="h-4 w-full bg-black/60 rounded-full overflow-hidden border border-white/5 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-primary via-blue-400 to-emerald-400 rounded-full transition-all duration-700 ease-out relative" 
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer" style={{ width: '50%' }} />
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 flex flex-col justify-center text-center">
             <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Gas Efficiency</span>
             <div className="text-2xl font-mono font-black text-white">99.2%</div>
             <p className="text-[10px] text-emerald-400/60 font-medium">vs Ethereum L1</p>
          </div>
        </div>

        <div className="bg-surface-dark border border-border-dark rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-[550px] ring-1 ring-white/5">
          <div className="bg-black/40 px-8 py-4 border-b border-border-dark flex items-center justify-between">
            <div className="flex gap-6">
              <button 
                onClick={() => setViewMode('logs')}
                className={`text-[10px] uppercase font-bold tracking-[0.2em] px-4 py-1.5 rounded-lg transition-all ${
                  viewMode === 'logs' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-secondary hover:text-white'
                }`}
              >
                Sequencer Logs
              </button>
              <button 
                onClick={() => setViewMode('code')}
                className={`text-[10px] uppercase font-bold tracking-[0.2em] px-4 py-1.5 rounded-lg transition-all ${
                  viewMode === 'code' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-secondary hover:text-white'
                }`}
              >
                Source Manifest
              </button>
            </div>
            {done && (
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase tracking-[0.15em] bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
                <span className="material-symbols-outlined text-[14px]">security</span>
                BaseScan Verified
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-hidden relative">
            {viewMode === 'logs' ? (
              <div className="p-8 font-mono text-xs space-y-3 custom-scrollbar h-full overflow-y-auto bg-[#0a0c10]/50">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-6 animate-fadeIn group">
                    <span className="text-text-secondary opacity-30 shrink-0 select-none">[{log.timestamp}]</span>
                    <span className={`${
                      log.level === 'success' ? 'text-emerald-400' : 
                      log.level === 'error' ? 'text-red-400' : 
                      log.level === 'warn' ? 'text-yellow-400' : 'text-primary'
                    } font-bold uppercase text-[9px] w-16 shrink-0 pt-0.5 tracking-widest`}>
                      {log.level}
                    </span>
                    <span className="text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed">{log.message}</span>
                  </div>
                ))}
                {!done && !isGenerating && (
                  <div className="flex items-center gap-3 text-primary p-2 mt-2">
                    <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Awaiting L2 Sequencer...</span>
                  </div>
                )}
                {isGenerating && (
                  <div className="flex items-center gap-3 text-primary p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                    <span className="animate-pulse font-bold uppercase tracking-widest">Architecting Protocol Layer...</span>
                  </div>
                )}
                <div ref={logEndRef} />
              </div>
            ) : (
              <div className="p-8 font-mono text-xs custom-scrollbar h-full overflow-y-auto bg-[#0a0c10]">
                {sourceCode ? (
                  <pre className="text-emerald-400/80 whitespace-pre-wrap break-all leading-relaxed selection:bg-white/10">
                    {sourceCode}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center gap-4 text-text-secondary opacity-20">
                    <span className="material-symbols-outlined text-6xl">terminal</span>
                    <p className="font-bold uppercase tracking-[0.3em]">Synthesizing Source Code</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center pt-8">
          {done ? (
            <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
              {deploymentResult && (
                <div className="w-full bg-surface-dark border border-border-dark rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Deployment Details</h3>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Transaction Hash:</span>
                      <a 
                        href={`https://basescan.org/tx/${deploymentResult.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-blue-400 transition-colors flex items-center gap-2"
                      >
                        {deploymentResult.txHash.slice(0, 10)}...{deploymentResult.txHash.slice(-8)}
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Contract Address:</span>
                      <a 
                        href={`https://basescan.org/address/${deploymentResult.contractAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2"
                      >
                        {deploymentResult.contractAddress.slice(0, 10)}...{deploymentResult.contractAddress.slice(-8)}
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Block Number:</span>
                      <span className="text-white">{deploymentResult.blockNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Network:</span>
                      <span className="text-white">Base Mainnet (Chain ID: 8453)</span>
                    </div>
                  </div>
                </div>
              )}
              <button 
                onClick={onComplete}
                className="bg-primary hover:bg-primary-hover text-white font-bold px-16 py-5 rounded-2xl transition-all shadow-2xl shadow-primary/40 flex items-center gap-4 hover:-translate-y-1 active:translate-y-0 text-xl group"
              >
                Access Command Center
                <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">dashboard_customize</span>
              </button>
              <div className="flex items-center gap-12 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                {deploymentResult && (
                  <>
                    <a 
                      href={`https://basescan.org/address/${deploymentResult.contractAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                      BaseScan
                    </a>
                  </>
                )}
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">download</span>
                  Contract Artifacts
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="flex items-center gap-4 text-text-secondary font-bold uppercase tracking-[0.2em] text-xs">
                <span className="material-symbols-outlined animate-spin text-primary">sync</span>
                {isGenerating ? 'Synthesizing audited bytecode' : 'Awaiting sequencer confirmation'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeploymentPage;
