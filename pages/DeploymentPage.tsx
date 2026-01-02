
import React, { useState, useEffect, useRef } from 'react';
import { DeploymentLog } from '../types';

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

const INITIAL_LOGS: DeploymentLog[] = [
  { timestamp: '10:42:01', level: 'info', message: 'Initializing build environment...' },
  { timestamp: '10:42:05', level: 'info', message: 'Compiling smart contracts (Solidity v0.8.20)...' },
];

const DEPLOYMENT_STEPS = [
  { msg: 'Contract artifacts generated successfully.', level: 'success' as const },
  { msg: 'Simulating deployment on Base Sepolia...', level: 'info' as const },
  { msg: 'Deployment successful. Contract Hash: 0x71C...9E2C', level: 'success' as const },
  { msg: 'Indexing contract events on Base Graph...', level: 'info' as const },
  { msg: 'Wiring UI components to live contract hooks...', level: 'info' as const },
  { msg: 'Verifying source code on BaseScan...', level: 'info' as const },
  { msg: 'Deployment sequence completed.', level: 'success' as const },
];

const DeploymentPage: React.FC<Props> = ({ onComplete, onBack }) => {
  const [logs, setLogs] = useState<DeploymentLog[]>(INITIAL_LOGS);
  const [progress, setProgress] = useState(15);
  const [done, setDone] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < DEPLOYMENT_STEPS.length) {
        const step = DEPLOYMENT_STEPS[stepIndex];
        setLogs(prev => [...prev, {
          timestamp: new Date().toLocaleTimeString([], { hour12: false }),
          level: step.level,
          message: step.msg
        }]);
        setProgress(prev => Math.min(prev + 12, 100));
        stepIndex++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold tracking-tight">Deploying to Base</h2>
          <p className="text-text-secondary text-lg">Your MVP is being manufactured in the ProtoBase factory.</p>
        </div>

        <div className="bg-surface-dark border border-border-dark rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">Manufacturing Progress</span>
            <span className="text-2xl font-mono font-bold text-white">{progress}%</span>
          </div>
          <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 p-1">
            <div 
              className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-700 relative overflow-hidden" 
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-shimmer" style={{ width: '50%' }} />
            </div>
          </div>
        </div>

        <div className="bg-[#0d1117] border border-border-dark rounded-2xl overflow-hidden shadow-inner flex flex-col h-[400px]">
          <div className="bg-surface-dark px-4 py-2 border-b border-border-dark flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-2 bg-red-500/50 rounded-full" />
              <div className="size-2 bg-yellow-500/50 rounded-full" />
              <div className="size-2 bg-green-500/50 rounded-full" />
              <span className="text-[10px] font-mono text-text-secondary ml-2 uppercase tracking-widest">Build Console</span>
            </div>
            <div className="animate-pulse flex items-center gap-2 text-[10px] text-primary font-bold">
              <span className="material-symbols-outlined text-[12px]">progress_activity</span>
              LIVE_BUILD
            </div>
          </div>
          
          <div className="p-6 font-mono text-sm overflow-y-auto space-y-3 custom-scrollbar flex-1">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-text-secondary shrink-0">[{log.timestamp}]</span>
                <span className={`${
                  log.level === 'success' ? 'text-emerald-400' : 
                  log.level === 'error' ? 'text-red-400' : 
                  log.level === 'warn' ? 'text-yellow-400' : 'text-blue-400'
                } font-bold uppercase text-[10px] w-14 shrink-0 pt-0.5`}>
                  {log.level}
                </span>
                <span className="text-gray-300">{log.message}</span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>

        <div className="flex justify-center pt-8">
          {done ? (
            <button 
              onClick={onComplete}
              className="bg-primary hover:bg-primary-hover text-white font-bold px-12 py-5 rounded-2xl transition-all shadow-2xl shadow-primary/30 flex items-center gap-3 scale-110 animate-bounce"
            >
              Enter Dashboard
              <span className="material-symbols-outlined">dashboard</span>
            </button>
          ) : (
            <button 
              disabled
              className="text-text-secondary font-bold px-6 py-3 opacity-50 cursor-not-allowed"
            >
              Please wait for build completion...
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeploymentPage;
