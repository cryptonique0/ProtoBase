
import React, { useState } from 'react';
import { analyzeIdea } from '../geminiService';
import { IdeaAnalysis } from '../types';

interface Props {
  onComplete: (analysis: IdeaAnalysis) => void;
  onBack: () => void;
}

const IntakePage: React.FC<Props> = ({ onComplete, onBack }) => {
  const [problem, setProblem] = useState('');
  const [users, setUsers] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem || !users) return;

    setLoading(true);
    setError(null);
    try {
      const result = await analyzeIdea(problem, users);
      onComplete(result);
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      <div className="grid lg:grid-cols-[1fr_350px] gap-12">
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Define Your Concept</h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Tell us about the onchain problem you're solving. Our AI analyst will strip it to the 
              essentials and recommend a modular smart contract stack.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 bg-surface-dark p-8 rounded-2xl border border-border-dark shadow-xl">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-primary">The Core Problem</label>
              <textarea 
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="e.g., Artists on Base aren't getting fair royalties because current marketplaces take high fees and don't support automated split payments..."
                className="w-full bg-black/40 border-border-dark rounded-xl p-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none min-h-[160px] resize-none border transition-all"
                required
              />
              <div className="flex justify-between text-[10px] text-text-secondary font-mono">
                <span>Minimum 50 characters recommended</span>
                <span>{problem.length} chars</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-primary">Target Audience</label>
              <input 
                value={users}
                onChange={(e) => setUsers(e.target.value)}
                type="text" 
                placeholder="e.g., Digital Artists, Collector DAOs, Protocol Treasuries"
                className="w-full bg-black/40 border-border-dark rounded-xl p-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none border transition-all"
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <button 
                type="button"
                onClick={onBack}
                className="text-text-secondary hover:text-white font-bold transition-colors px-4 py-2"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading || problem.length < 20}
                className="flex items-center gap-3 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Analyzing Idea...
                  </>
                ) : (
                  <>
                    Generate MVP Scope
                    <span className="material-symbols-outlined">auto_fix_high</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <aside className="space-y-6">
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl">smart_toy</span>
            </div>
            <h3 className="font-bold text-primary uppercase tracking-widest text-xs mb-4">ProtoBase Intelligence</h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              Our analyzer uses the latest Base network specifications to evaluate your idea's 
              onchain feasibility.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-xs text-text-secondary">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                Identifies optimal contract patterns
              </li>
              <li className="flex items-start gap-2 text-xs text-text-secondary">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                Flags potential gas bottlenecks
              </li>
              <li className="flex items-start gap-2 text-xs text-text-secondary">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                Suggests MVP feature pruning
              </li>
            </ul>
          </div>

          <div className="bg-surface-dark border border-border-dark rounded-2xl p-6">
            <h3 className="font-bold text-white mb-2">Need Inspiration?</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              "A reputation-based DAO voting system where votes are weighted by contributor trust scores, stored in soulbound tokens on Base."
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default IntakePage;
