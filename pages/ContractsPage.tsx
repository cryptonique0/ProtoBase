
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IdeaAnalysis, ContractModule } from '../types';
import { CONTRACT_MODULES } from '../constants';

interface Props {
  analysis: IdeaAnalysis | null;
  selectedModules: ContractModule[];
  moduleCustomizations: Record<string, string>;
  onCustomize: (moduleId: string, logic: string) => void;
  onSelect: (module: ContractModule) => void;
  onComplete: () => void;
  onBack: () => void;
}

const SOLIDITY_KEYWORDS = [
  'pragma', 'solidity', 'contract', 'library', 'interface', 'function', 'modifier',
  'event', 'struct', 'enum', 'mapping', 'address', 'uint', 'uint256', 'int', 'bool',
  'string', 'bytes', 'memory', 'storage', 'calldata', 'public', 'private', 'internal',
  'external', 'pure', 'view', 'payable', 'returns', 'return', 'if', 'else', 'for',
  'while', 'do', 'break', 'continue', 'emit', 'override', 'virtual', 'is', 'constructor'
];

const BUILT_INS = [
  'msg', 'block', 'tx', 'now', 'require', 'revert', 'assert', 'keccak256', 
  'abi', 'address', 'this', 'super', 'selfdestruct', 'sender', 'value', 'timestamp', 'gasleft'
];

const SolidityHighlighter: React.FC<{ code: string }> = ({ code }) => {
  const highlight = (text: string) => {
    if (!text) return '';
    
    // Escape HTML first
    let highlighted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Use a tokenization approach to prevent highlighting keywords inside strings/comments
    const protectedTokens: { [key: string]: string } = {};
    let tokenCount = 0;

    // 1. Protect Strings and Comments (they take precedence)
    // Regex matches multi-line comments, single-line comments, and double/single quoted strings
    const protectRegex = /(\/\*[\s\S]*?\*\/|\/\/.+|(["'])(?:(?=(\\?))\3.)*?\2)/g;
    
    highlighted = highlighted.replace(protectRegex, (match) => {
      const tokenId = `__PB_TOKEN_${tokenCount++}__`;
      let className = 'text-gray-500 italic'; // Default for comments
      
      // If it starts with quote, it's a string
      if (match.startsWith('"') || match.startsWith("'")) {
        className = 'text-emerald-400';
      }
      
      protectedTokens[tokenId] = `<span class="${className}">${match}</span>`;
      return tokenId;
    });

    // 2. Highlight Built-ins (msg, block, require, etc.)
    const builtInRegex = new RegExp(`\\b(${BUILT_INS.join('|')})\\b`, 'g');
    highlighted = highlighted.replace(builtInRegex, '<span class="text-blue-400 italic">$1</span>');

    // 3. Highlight Keywords
    const keywordRegex = new RegExp(`\\b(${SOLIDITY_KEYWORDS.join('|')})\\b`, 'g');
    highlighted = highlighted.replace(keywordRegex, '<span class="text-purple-400 font-bold">$1</span>');

    // 4. Highlight Numbers (hex and decimals)
    highlighted = highlighted.replace(/\b(0x[a-fA-F0-9]+|\d+)\b/g, '<span class="text-orange-400">$1</span>');

    // 5. Highlight Function declarations
    highlighted = highlighted.replace(/\b(function)\b\s+([a-zA-Z_]\w*)/g, 
      '<span class="text-purple-400 font-bold">$1</span> <span class="text-yellow-200 font-semibold">$2</span>');

    // 6. Restore Protected Tokens
    Object.keys(protectedTokens).forEach(tokenId => {
      highlighted = highlighted.replace(tokenId, protectedTokens[tokenId]);
    });

    return highlighted;
  };

  return (
    <pre 
      className="absolute top-0 left-0 w-full h-full p-6 pl-14 m-0 pointer-events-none font-mono text-sm leading-relaxed whitespace-pre-wrap break-all overflow-hidden bg-transparent"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: highlight(code) + '\n' }}
    />
  );
};

const ContractsPage: React.FC<Props> = ({ 
  analysis, 
  selectedModules, 
  moduleCustomizations,
  onCustomize,
  onSelect, 
  onComplete, 
  onBack 
}) => {
  const [editingModule, setEditingModule] = useState<ContractModule | null>(null);
  const [tempLogic, setTempLogic] = useState('');
  
  // Undo/Redo State
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      handleLogicChange(newValue);
      
      // We must defer the cursor position update to after React renders the new value
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const saveCustomization = () => {
    if (editingModule) {
      onCustomize(editingModule.id, tempLogic);
      setEditingModule(null);
    }
  };

  const lineCount = tempLogic.split('\n').length;

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
                  className={`group relative p-6 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' 
                      : 'border-border-dark bg-surface-dark hover:border-gray-500 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="absolute top-4 right-4 flex gap-2">
                    {hasCustomLogic && (
                      <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400">
                        <span className="material-symbols-outlined text-[12px]">code</span>
                        LOGIC INJECTED
                      </div>
                    )}
                    {isSelected ? (
                      <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                    ) : (
                      <span className="material-symbols-outlined text-text-secondary group-hover:text-white">add</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-white' : 'bg-white/5 text-primary'}`}>
                      <span className="material-symbols-outlined">
                        {module.category === 'Security' ? 'admin_panel_settings' :
                         module.category === 'NFT' ? 'token' :
                         module.category === 'DeFi' ? 'hourglass_top' :
                         module.category === 'Governance' ? 'account_balance' : 'payments'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white">{module.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-text-secondary">{module.category}</span>
                        <span className="size-1 rounded-full bg-text-secondary/30" />
                        <span className="text-[10px] text-green-400 font-bold uppercase">{module.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">
                    {module.description}
                  </p>
                  
                  <div className="pt-4 border-t border-border-dark flex items-center justify-between text-[10px] font-mono text-text-secondary">
                    <span>Est. Gas: {module.gasEstimate}</span>
                    <div className="flex gap-4">
                       <button 
                         onClick={(e) => { e.stopPropagation(); openEditor(module); }} 
                         className="hover:text-white transition-colors flex items-center gap-1 font-bold group/btn"
                       >
                         <span className="material-symbols-outlined text-[14px]">edit_square</span>
                         Edit Code
                       </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="w-full lg:w-[380px] shrink-0 space-y-6">
          <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden shadow-2xl sticky top-24">
            <div className="p-6 border-b border-border-dark bg-black/20">
              <h3 className="font-bold text-white flex items-center justify-between">
                Project Stack
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{selectedModules.length} Modules</span>
              </h3>
            </div>
            
            <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto scrollbar-hide">
              {selectedModules.length === 0 ? (
                <div className="text-center py-8 text-text-secondary opacity-50 italic text-sm">
                  No modules selected yet
                </div>
              ) : (
                selectedModules.map(m => (
                  <div key={m.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-lg">check</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{m.name}</span>
                        {moduleCustomizations[m.id] && (
                          <span className="text-[9px] text-emerald-400 font-mono italic">Custom logic applied</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); openEditor(m); }}
                        className="text-text-secondary hover:text-white transition-colors"
                        title="Edit Code"
                      >
                        <span className="material-symbols-outlined text-sm">code</span>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSelect(m); }} 
                        className="text-text-secondary hover:text-red-400 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 bg-black/20 border-t border-border-dark space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">Deployment Cost (Est)</span>
                <span className="font-mono text-white">~450k units</span>
              </div>
              <button 
                onClick={onComplete}
                disabled={selectedModules.length === 0}
                className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                Proceed to Frontend
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          {analysis && (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-xl">lightbulb</span>
                <h4 className="font-bold text-sm text-white">AI Strategy</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed italic">
                "{analysis.scopeReduction}"
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* Code Editor Modal */}
      {editingModule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/95 backdrop-blur-md animate-fadeIn">
          <div className="bg-surface-dark border border-border-dark rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp">
            <div className="px-6 py-4 border-b border-border-dark flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <span className="material-symbols-outlined">terminal</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{editingModule.name} Module</h3>
                  <div className="flex items-center gap-2 text-[10px] text-text-secondary font-mono tracking-wider uppercase">
                    <span>contracts/modules/{editingModule.id}.sol</span>
                    <span className="size-1 rounded-full bg-white/20" />
                    <span className="text-emerald-400">Solidity 0.8.20</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-black/60 rounded-xl p-1 border border-border-dark">
                  <button 
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-20 transition-colors text-white flex items-center justify-center"
                    title="Undo (Ctrl+Z)"
                  >
                    <span className="material-symbols-outlined text-base">undo</span>
                  </button>
                  <button 
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-20 transition-colors text-white flex items-center justify-center"
                    title="Redo (Ctrl+Y)"
                  >
                    <span className="material-symbols-outlined text-base">redo</span>
                  </button>
                </div>
                <button 
                  onClick={() => setEditingModule(null)}
                  className="size-10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 rounded-full transition-all"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden bg-black/30 relative">
              {/* Line Numbers */}
              <div 
                ref={scrollContainerRef}
                className="w-14 bg-black/20 border-r border-border-dark py-6 flex flex-col items-center select-none font-mono text-[10px] text-text-secondary/40 leading-relaxed overflow-hidden"
              >
                {Array.from({ length: Math.max(30, lineCount + 10) }).map((_, i) => (
                  <div key={i} className="h-[21px] flex items-center">{i + 1}</div>
                ))}
              </div>

              {/* Editor Surface */}
              <div className="flex-1 relative overflow-hidden">
                <textarea
                  ref={textareaRef}
                  value={tempLogic}
                  onChange={handleLogicChange}
                  onKeyDown={handleKeyDown}
                  onScroll={handleScroll}
                  placeholder={`// Custom implementation for ${editingModule.name}...`}
                  className="absolute inset-0 w-full h-full p-6 pl-0 bg-transparent text-transparent caret-white font-mono text-sm leading-relaxed resize-none outline-none z-10 selection:bg-primary/40 scrollbar-hide"
                  spellCheck={false}
                />
                {/* The highlighter mirrors the textarea content but with colors */}
                <SolidityHighlighter code={tempLogic} />
              </div>

              {/* Syntax Helper Overlay (Right Side) */}
              <div className="w-64 border-l border-border-dark bg-black/20 p-6 hidden xl:block overflow-y-auto">
                <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">Solidity Quick Tips</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-white">Access Control</p>
                    <code className="block text-[10px] p-2 bg-black/40 rounded border border-white/5 text-purple-400">
                      onlyRole(ADMIN_ROLE)
                    </code>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-white">Events</p>
                    <code className="block text-[10px] p-2 bg-black/40 rounded border border-white/5 text-emerald-400">
                      emit TaskExecuted(msg.sender);
                    </code>
                  </div>
                  <div className="space-y-2 text-[10px] text-text-secondary leading-relaxed">
                    Custom logic is automatically wrapped in internal functions to maintain security standards.
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-border-dark bg-black/40 flex items-center justify-between">
              <div className="flex items-center gap-6 text-[10px] text-text-secondary font-mono">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Code Validated
                </div>
                <div>{lineCount} Lines</div>
                <div>{tempLogic.length} Characters</div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    const boilerplate = `// Protocol: ProtoBase\n// Module: ${editingModule.name}\n\nfunction _customLogic() internal {\n    // Injected logic begins\n    require(msg.sender != address(0), "Invalid sender");\n    \n    // Add your onchain operations here\n    \n    emit LogAction(msg.sender, block.timestamp);\n}`;
                    handleLogicChange(boilerplate);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-border-dark text-[10px] font-bold text-white hover:bg-white/10 transition-colors uppercase tracking-widest"
                >
                  Boilerplate
                </button>
                <button 
                  onClick={saveCustomization}
                  className="px-12 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm transition-all shadow-lg shadow-primary/20 flex items-center gap-3 active:scale-95"
                >
                  Apply Injection
                  <span className="material-symbols-outlined text-base">flash_on</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
        .animate-scaleUp { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default ContractsPage;
