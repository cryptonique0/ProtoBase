import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IdeaAnalysis, ContractModule, ContractDocItem } from '../types';
import { CONTRACT_MODULES } from '../constants';

interface Props {
  analysis: IdeaAnalysis | null;
  selectedModules: ContractModule[];
  moduleCustomizations: Record<string, string>;
  onCustomize: (moduleId: string, logic: string) => void;
  onSelect: (module: ContractModule) => void;
  onComplete: () => void;
  onGenerate: () => void;
  onBack: () => void;
}

const SOLIDITY_KEYWORDS = [
  'pragma', 'solidity', 'contract', 'library', 'interface', 'function', 'modifier',
  'event', 'struct', 'enum', 'mapping', 'public', 'private', 'internal',
  'external', 'pure', 'view', 'payable', 'returns', 'return', 'if', 'else', 'for',
  'while', 'do', 'break', 'continue', 'emit', 'override', 'virtual', 'is', 'constructor',
  'indexed', 'import', 'using', 'as', 'new', 'delete', 'try', 'catch', 'assembly', 
  'unchecked', 'abstract', 'anonymous', 'constant', 'immutable', 'error', 'receive', 
  'fallback', 'virtual', 'override', 'type'
];

const SOLIDITY_TYPES = [
  'address', 'uint', 'uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256',
  'int', 'int8', 'int16', 'int32', 'int64', 'int128', 'int256',
  'bool', 'string', 'bytes', 'bytes1', 'bytes2', 'bytes4', 'bytes8', 'bytes16', 'bytes32', 
  'byte', 'mapping', 'fixed', 'ufixed'
];

const DATA_LOCATIONS = [
  'storage', 'memory', 'calldata'
];

const BUILT_INS = [
  'msg', 'block', 'tx', 'now', 'require', 'revert', 'assert', 'keccak256', 
  'abi', 'this', 'super', 'selfdestruct', 'sender', 'value', 'timestamp', 'gasleft',
  'encode', 'encodePacked', 'decode', 'selector', 'sig', 'data', 'gas', 'origin',
  'sha256', 'ripemd160', 'ecrecover', 'addmod', 'mulmod', 'blockhash', 'gaslimit',
  'basefee', 'chainid', 'coinbase', 'prevrandao', 'difficulty', 'selfbalance'
];

const SolidityHighlighter = React.forwardRef<HTMLPreElement, { code: string }>(({ code }, ref) => {
  const highlight = (text: string) => {
    if (!text) return '';
    
    // 1. Escape HTML to prevent injection
    let highlighted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const protectedTokens: { [key: string]: string } = {};
    let tokenCount = 0;

    // 2. Protect Strings and Comments (they should not be processed by other regexes)
    const protectRegex = /(\/\*[\s\S]*?\*\/|\/\/.+|(["'])(?:(?=(\\?))\3.)*?\2)/g;
    highlighted = highlighted.replace(protectRegex, (match) => {
      const tokenId = `__PB_TOKEN_${tokenCount++}__`;
      let className = 'text-gray-500 italic';
      if (match.startsWith('"') || match.startsWith("'")) {
        className = 'text-emerald-400 font-medium';
      }
      protectedTokens[tokenId] = `<span class="${className}">${match}</span>`;
      return tokenId;
    });

    // 3. Types (Blue/Cyan)
    const typeRegex = new RegExp(`\\b(${SOLIDITY_TYPES.join('|')})\\b`, 'g');
    highlighted = highlighted.replace(typeRegex, '<span class="text-blue-300">$1</span>');

    // 4. Data Locations (Sky Blue)
    const locationRegex = new RegExp(`\\b(${DATA_LOCATIONS.join('|')})\\b`, 'g');
    highlighted = highlighted.replace(locationRegex, '<span class="text-sky-300 italic font-medium">$1</span>');

    // 5. Built-ins (Light Blue/Italic)
    const builtInRegex = new RegExp(`\\b(${BUILT_INS.join('|')})\\b`, 'g');
    highlighted = highlighted.replace(builtInRegex, '<span class="text-sky-400 italic font-medium">$1</span>');

    // 6. Keywords (Purple/Pink)
    const keywordRegex = new RegExp(`\\b(${SOLIDITY_KEYWORDS.join('|')})\\b`, 'g');
    highlighted = highlighted.replace(keywordRegex, '<span class="text-purple-400 font-bold">$1</span>');

    // 7. Numbers (Orange/Amber)
    highlighted = highlighted.replace(/\b(0x[a-fA-F0-9]+|\d+)\b/g, '<span class="text-orange-300 font-mono">$1</span>');

    // 8. Function names (Yellow)
    highlighted = highlighted.replace(/\b(function)\b\s+([a-zA-Z_]\w*)/g, 
      '<span class="text-purple-400 font-bold">$1</span> <span class="text-yellow-200 font-semibold">$2</span>');

    // 9. Operators and Punctuation (Dimmed White)
    highlighted = highlighted.replace(/([=+\-*/%&|^!<>?:;.,\[\]{}()]|&&|\|\||\*\*|>>|<<|>=|<=|==|!=)/g, '<span class="text-white/30">$1</span>');

    // 10. Restore Protected Tokens
    Object.keys(protectedTokens).forEach(tokenId => {
      highlighted = highlighted.replace(tokenId, protectedTokens[tokenId]);
    });

    return highlighted;
  };

  return (
    <pre 
      ref={ref}
      className="absolute top-0 left-0 w-full h-full p-6 pl-0 m-0 pointer-events-none font-mono text-sm leading-relaxed whitespace-pre-wrap break-all overflow-hidden bg-transparent"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: highlight(code) + '\n' }}
    />
  );
});

const ContractsPage: React.FC<Props> = ({ 
  analysis, 
  selectedModules, 
  moduleCustomizations,
  onCustomize,
  onSelect, 
  onComplete, 
  onGenerate,
  onBack 
}) => {
  const [editingModule, setEditingModule] = useState<ContractModule | null>(null);
  const [viewingDocs, setViewingDocs] = useState<ContractModule | null>(null);
  const [tempLogic, setTempLogic] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlighterRef = useRef<HTMLPreElement>(null);

  const openEditor = (module: ContractModule) => {
    const initialLogic = moduleCustomizations[module.id] || '';
    setEditingModule(module);
    setTempLogic(initialLogic);
    setHistory([initialLogic]);
    setHistoryIndex(0);
    
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleLogicChange = (e: React.ChangeEvent<HTMLTextAreaElement> | string) => {
    const newValue = typeof e === 'string' ? e : e.target.value;
    setTempLogic(newValue);
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newValue);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const insertAtCursor = (snippet: string) => {
    if (!textareaRef.current) return;
    const { selectionStart, selectionEnd, value } = textareaRef.current;
    const newValue = value.substring(0, selectionStart) + snippet + value.substring(selectionEnd);
    handleLogicChange(newValue);
    
    // Restore focus and position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = selectionStart + snippet.length;
      }
    }, 0);
  };

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setTempLogic(history[nextIndex]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setTempLogic(history[nextIndex]);
    }
  }, [history, historyIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      if (e.shiftKey) redo(); else undo();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault();
      redo();
    }
    
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const value = e.currentTarget.value;
      const newValue = value.substring(0, start) + "    " + value.substring(end);
      handleLogicChange(newValue);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const { scrollTop, scrollLeft } = e.currentTarget;
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = scrollTop;
    }
    if (highlighterRef.current) {
      highlighterRef.current.scrollTop = scrollTop;
      highlighterRef.current.scrollLeft = scrollLeft;
    }
  };

  const saveCustomization = () => {
    if (editingModule) {
      onCustomize(editingModule.id, tempLogic);
      setEditingModule(null);
    }
  };

  const lines = tempLogic.split('\n');
  const lineCount = Math.max(lines.length, 1);

  // Calculate total gas for sidebar
  const totalGas = selectedModules.reduce((sum, m) => {
    const gasVal = parseInt(m.gasEstimate.replace('k', '')) || 0;
    return sum + gasVal;
  }, 0);

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl relative">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-bold tracking-tight mb-2 text-white">Assemble Your Protocol</h2>
              <p className="text-text-secondary text-lg">Select battle-tested modules to build your custom architecture on Base.</p>
            </div>
            <div className="bg-surface-dark border border-border-dark px-4 py-2 rounded-full hidden sm:flex items-center gap-3">
              <span className="text-xs font-bold text-text-secondary">Network Status:</span>
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-white">Live</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {CONTRACT_MODULES.map((module) => {
              const isSelected = selectedModules.some(m => m.id === module.id);
              const hasCustomLogic = !!moduleCustomizations[module.id];
              
              return (
                <div 
                  key={module.id}
                  onClick={() => onSelect(module)}
                  className={`group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/5 ring-1 ring-primary/20' 
                      : 'border-border-dark bg-surface-dark hover:border-gray-500 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setViewingDocs(module); }}
                      className="size-8 flex items-center justify-center text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      title="View Documentation"
                    >
                      <span className="material-symbols-outlined text-[18px]">info</span>
                    </button>
                    {hasCustomLogic && (
                      <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400 animate-pulse">
                        <span className="material-symbols-outlined text-[12px]">flash_on</span>
                        LOGIC INJECTED
                      </div>
                    )}
                    {isSelected ? (
                      <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                    ) : (
                      <span className="material-symbols-outlined text-text-secondary group-hover:text-white transition-colors">add</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg transition-colors ${isSelected ? 'bg-primary text-white' : 'bg-white/5 text-primary'}`}>
                      <span className="material-symbols-outlined">
                        {module.category === 'Security' ? 'admin_panel_settings' :
                         module.category === 'NFT' ? 'token' :
                         module.category === 'DeFi' ? 'hourglass_top' :
                         module.category === 'Governance' ? 'account_balance' : 'payments'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{module.name}</h4>
                        <span className="text-[10px] font-mono font-bold bg-primary/10 border border-primary/20 px-2 py-0.5 rounded text-primary shadow-sm shadow-primary/5">
                          {module.gasEstimate} gas
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">{module.category}</span>
                        <span className="size-1 rounded-full bg-text-secondary/30" />
                        <span className="text-[10px] text-green-400 font-bold uppercase">{module.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">
                    {module.description}
                  </p>
                  
                  <div className="pt-4 border-t border-border-dark flex items-center justify-between text-[10px] font-mono text-text-secondary">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">local_gas_station</span>
                      {module.gasEstimate} est.
                    </div>
                    <div className="flex gap-3">
                       <button 
                         onClick={(e) => { e.stopPropagation(); setViewingDocs(module); }} 
                         className="hover:text-white transition-colors flex items-center gap-1 font-bold group/btn"
                       >
                         <span className="material-symbols-outlined text-[14px]">menu_book</span>
                         Docs
                       </button>
                       <button 
                         onClick={(e) => { e.stopPropagation(); openEditor(module); }} 
                         className="hover:text-white transition-colors flex items-center gap-1 font-bold group/btn"
                       >
                         <span className="material-symbols-outlined text-[14px]">edit_square</span>
                         Edit Logic
                       </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="w-full lg:w-[380px] shrink-0 space-y-6">
          <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden shadow-2xl sticky top-24 transition-all duration-500">
            <div className="p-6 border-b border-border-dark bg-black/20">
              <h3 className="font-bold text-white flex items-center justify-between">
                Project Stack
                <span className="text-[10px] bg-primary/20 text-primary px-3 py-1 rounded-full uppercase tracking-widest font-bold">{selectedModules.length} Modules</span>
              </h3>
            </div>
            
            <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
              {selectedModules.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-4xl text-text-secondary/20">view_module</span>
                  <p className="text-text-secondary opacity-50 italic text-sm">No modules selected yet</p>
                </div>
              ) : (
                selectedModules.map(m => (
                  <div key={m.id} className="flex items-center justify-between group animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-primary" />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{m.name}</span>
                          <span className="text-[9px] font-mono text-primary/60 border border-primary/20 px-1 rounded bg-primary/5">
                            {m.gasEstimate}
                          </span>
                        </div>
                        {moduleCustomizations[m.id] && (
                          <span className="text-[9px] text-emerald-400 font-mono italic flex items-center gap-1">
                            <span className="size-1 rounded-full bg-emerald-400 animate-pulse" />
                            Active Logic Injected
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setViewingDocs(m); }}
                        className="text-text-secondary hover:text-white transition-colors p-1"
                        title="View Documentation"
                      >
                        <span className="material-symbols-outlined text-sm">menu_book</span>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); openEditor(m); }}
                        className="text-text-secondary hover:text-white transition-colors p-1"
                        title="Edit Code"
                      >
                        <span className="material-symbols-outlined text-sm">code</span>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSelect(m); }} 
                        className="text-text-secondary hover:text-red-400 transition-colors p-1"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 bg-black/20 border-t border-border-dark space-y-4">
              <div className="flex justify-between items-center text-sm font-mono">
                <span className="text-text-secondary">Est. Deployment</span>
                <span className="text-white font-bold">~{totalGas > 0 ? totalGas : 0}k gas</span>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={onComplete}
                  disabled={selectedModules.length === 0}
                  className="w-full bg-primary hover:bg-primary-hover disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
                >
                  Assemble Full MVP
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">bolt</span>
                </button>
                <button 
                  onClick={onGenerate}
                  disabled={selectedModules.length === 0}
                  className="w-full bg-surface-dark border border-border-dark hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
                >
                  Generate Contract Only
                  <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">code</span>
                </button>
              </div>
            </div>
          </div>

          {analysis && (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-xl">psychology</span>
                <h4 className="font-bold text-sm text-white uppercase tracking-widest">Architect's Note</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {analysis.scopeReduction}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {analysis.suggestedFunctions.slice(0, 2).map(fn => (
                  <span key={fn} className="text-[9px] font-mono bg-white/5 border border-white/10 px-2 py-1 rounded text-text-secondary">
                    {fn}()
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Documentation Modal */}
      {viewingDocs && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-background-dark/95 backdrop-blur-lg animate-fadeIn">
           <div className="bg-surface-dark border border-border-dark rounded-3xl w-full max-w-4xl h-[75vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp">
              <div className="px-8 py-5 border-b border-border-dark flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                    <span className="material-symbols-outlined text-2xl">menu_book</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{viewingDocs.name}</h3>
                    <p className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">Documentation & Reference</p>
                  </div>
                </div>
                <button 
                  onClick={() => setViewingDocs(null)}
                  className="size-10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 rounded-full transition-all"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
                <section>
                  <h4 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">functions</span>
                    Public Functions
                  </h4>
                  <div className="space-y-6">
                    {viewingDocs.documentation.functions.map((fn, idx) => (
                      <div key={idx} className="bg-black/20 rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                          <code className="text-lg font-bold text-yellow-200">{fn.name}</code>
                        </div>
                        <p className="text-sm text-text-secondary mb-4">{fn.description}</p>
                        {fn.params && fn.params.length > 0 && (
                          <div className="space-y-3">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Parameters</span>
                            <div className="grid gap-2">
                              {fn.params.map((p, pIdx) => (
                                <div key={pIdx} className="flex gap-4 items-start text-[13px] font-mono p-3 bg-white/[0.02] rounded-lg">
                                  <span className="text-blue-400 shrink-0">{p.type}</span>
                                  <span className="text-emerald-400 font-bold shrink-0">{p.name}</span>
                                  <span className="text-text-secondary">— {p.description}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {viewingDocs.documentation.events.length > 0 && (
                  <section>
                    <h4 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">notifications</span>
                      Events
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {viewingDocs.documentation.events.map((ev, idx) => (
                        <div key={idx} className="bg-black/20 rounded-xl border border-white/5 p-4 flex flex-col gap-2">
                          <code className="text-purple-400 font-bold text-sm">event {ev.name}</code>
                          <p className="text-xs text-text-secondary">{ev.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <div className="px-8 py-5 border-t border-border-dark bg-black/40 flex justify-end">
                <button 
                  onClick={() => setViewingDocs(null)}
                  className="px-8 py-2.5 rounded-xl bg-white/5 border border-border-dark text-xs font-bold text-white hover:bg-white/10 transition-all"
                >
                  Dismiss
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Code Editor Modal */}
      {editingModule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/95 backdrop-blur-lg animate-fadeIn">
          <div className="bg-surface-dark border border-border-dark rounded-3xl w-full max-w-6xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp">
            <div className="px-8 py-5 border-b border-border-dark flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner">
                  <span className="material-symbols-outlined text-2xl">developer_mode_tv</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{editingModule.name}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-text-secondary font-mono tracking-widest uppercase">
                    <span>contracts/modules/{editingModule.id}.sol</span>
                    <span className="size-1 rounded-full bg-white/20" />
                    <span className="text-emerald-400 font-bold">Solc 0.8.20</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-black/60 rounded-xl p-1 border border-border-dark shadow-inner">
                  <button 
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-20 transition-all text-white flex items-center justify-center"
                    title="Undo (Ctrl+Z)"
                  >
                    <span className="material-symbols-outlined text-lg">undo</span>
                  </button>
                  <button 
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-20 transition-all text-white flex items-center justify-center"
                    title="Redo (Ctrl+Y)"
                  >
                    <span className="material-symbols-outlined text-lg">redo</span>
                  </button>
                </div>
                <button 
                  onClick={() => setEditingModule(null)}
                  className="size-10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-red-500/20 hover:text-red-400 rounded-full transition-all"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden bg-black/30 relative group">
              {/* Line Numbers */}
              <div 
                ref={lineNumbersRef}
                className="w-14 bg-black/40 border-r border-border-dark py-6 flex flex-col items-center select-none font-mono text-[10px] text-text-secondary/30 leading-relaxed overflow-hidden"
              >
                {Array.from({ length: Math.max(lineCount + 10, 35) }).map((_, i) => (
                  <div key={i} className={`h-[21px] flex items-center transition-colors ${i < lineCount ? 'text-text-secondary/60' : 'text-text-secondary/10'}`}>
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Editor Surface */}
              <div className="flex-1 relative overflow-hidden bg-transparent">
                <textarea
                  ref={textareaRef}
                  value={tempLogic}
                  onChange={handleLogicChange}
                  onKeyDown={handleKeyDown}
                  onScroll={handleScroll}
                  placeholder={`// Inject custom logic for ${editingModule.name} here...\n// Standard libraries are pre-imported.`}
                  className="absolute inset-0 w-full h-full p-6 pl-0 bg-transparent text-transparent caret-white font-mono text-sm leading-relaxed resize-none outline-none z-10 selection:bg-primary/40 custom-scrollbar"
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                />
                <SolidityHighlighter ref={highlighterRef} code={tempLogic} />
              </div>

              {/* Tips Sidebar */}
              <div className="w-80 border-l border-border-dark bg-black/40 p-6 hidden xl:block overflow-y-auto custom-scrollbar">
                <div className="space-y-8">
                  <section>
                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4">Snippet Library</h4>
                    <div className="grid gap-2">
                      <button 
                        onClick={() => insertAtCursor(`require(condition, "Error message");`)}
                        className="w-full text-left p-2.5 rounded-lg bg-white/5 border border-border-dark hover:border-primary/50 hover:bg-primary/5 transition-all text-[11px] font-mono group"
                      >
                        <span className="text-text-secondary group-hover:text-white">Guard Clause</span>
                      </button>
                      <button 
                        onClick={() => insertAtCursor(`emit ActionExecuted(msg.sender, block.timestamp);`)}
                        className="w-full text-left p-2.5 rounded-lg bg-white/5 border border-border-dark hover:border-primary/50 hover:bg-primary/5 transition-all text-[11px] font-mono group"
                      >
                        <span className="text-text-secondary group-hover:text-white">Emit Pattern</span>
                      </button>
                      <button 
                        onClick={() => insertAtCursor(`mapping(address => uint256) public balances;`)}
                        className="w-full text-left p-2.5 rounded-lg bg-white/5 border border-border-dark hover:border-primary/50 hover:bg-primary/5 transition-all text-[11px] font-mono group"
                      >
                        <span className="text-text-secondary group-hover:text-white">State Mapping</span>
                      </button>
                      <button 
                        onClick={() => {
                          const boilerplate = `// Protocol: ProtoBase\n// Module: ${editingModule.name}\n\n/**\n * @dev Custom Logic Injection\n */\nfunction _handleCustomAction() internal {\n    // 1. Validate Input\n    require(msg.sender != address(0), "Invalid Sender");\n\n    // 2. Business Logic\n    // TODO: Implement custom state transition\n    \n    // 3. Emit Trace\n    emit LogCustomAction(msg.sender, block.timestamp);\n}`;
                          insertAtCursor(boilerplate);
                        }}
                        className="w-full text-left p-2.5 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-all text-[11px] font-mono group"
                      >
                        <span className="text-primary group-hover:text-white font-bold">Inject Full Boilerplate</span>
                      </button>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Global Context</h4>
                    <div className="flex flex-wrap gap-2">
                      {['msg.sender', 'msg.value', 'block.timestamp', 'tx.origin'].map(snippet => (
                        <button 
                          key={snippet}
                          onClick={() => insertAtCursor(snippet)}
                          className="px-2 py-1 rounded border border-white/10 bg-black/40 text-[10px] font-mono text-purple-400 hover:text-white hover:border-white/30 transition-all"
                        >
                          {snippet}
                        </button>
                      ))}
                    </div>
                  </section>

                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="text-[10px] text-text-secondary leading-relaxed italic">
                      "Custom logic is injected at the protocol layer. Use memory variables for temporary computations to save gas on Base."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-border-dark bg-black/40 flex items-center justify-between">
              <div className="flex items-center gap-8 text-[10px] text-text-secondary font-mono">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary shadow-sm shadow-primary/50" />
                  Mode: Logic Injection
                </div>
                <div className="flex items-center gap-4 opacity-60">
                  <span>Lines: {lineCount}</span>
                  <span>Chars: {tempLogic.length}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    const boilerplate = `// Protocol: ProtoBase\n// Module: ${editingModule.name}\n\n/**\n * @dev Custom Logic Injection\n */\nfunction _handleCustomAction() internal {\n    // 1. Validate Input\n    require(msg.sender != address(0), "Invalid Sender");\n\n    // 2. Business Logic\n    // TODO: Implement custom state transition\n    \n    // 3. Emit Trace\n    emit LogCustomAction(msg.sender, block.timestamp);\n}`;
                    handleLogicChange(boilerplate);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-white/5 border border-border-dark text-[10px] font-bold text-white hover:bg-white/10 transition-all uppercase tracking-widest shadow-sm"
                >
                  Clear & Use Boilerplate
                </button>
                <button 
                  onClick={saveCustomization}
                  className="px-14 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm transition-all shadow-xl shadow-primary/30 flex items-center gap-3 active:scale-95"
                >
                  Apply & Close
                  <span className="material-symbols-outlined text-base">save_as</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-scaleUp { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        
        textarea::placeholder {
          color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default ContractsPage;