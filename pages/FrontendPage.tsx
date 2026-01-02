
import React from 'react';
import { UITemplate } from '../types';
import { UI_TEMPLATES } from '../constants';

interface Props {
  onSelect: (ui: UITemplate) => void;
  selectedUI: UITemplate | null;
  onComplete: () => void;
  onBack: () => void;
}

const FrontendPage: React.FC<Props> = ({ onSelect, selectedUI, onComplete, onBack }) => {
  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <div className="flex flex-col gap-8 mb-12">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2">Choose Your Interface</h2>
          <p className="text-text-secondary text-lg">Select a pre-wired UI kit that matches your smart contract logic. All templates are wallet-ready.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {UI_TEMPLATES.map((ui) => {
          const isSelected = selectedUI?.id === ui.id;
          return (
            <div 
              key={ui.id}
              onClick={() => onSelect(ui)}
              className={`group relative flex flex-col rounded-2xl border overflow-hidden transition-all cursor-pointer ${
                isSelected 
                  ? 'border-primary bg-primary/5 shadow-2xl ring-2 ring-primary/20' 
                  : 'border-border-dark bg-surface-dark hover:border-gray-500'
              }`}
            >
              <div className="aspect-video w-full overflow-hidden relative">
                <img src={ui.previewUrl} alt={ui.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent" />
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-primary text-white rounded-full p-1 shadow-lg">
                    <span className="material-symbols-outlined block">check</span>
                  </div>
                )}
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{ui.name}</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                  {ui.description}
                </p>
                
                <div className="mt-auto flex flex-wrap gap-2">
                  {ui.features.map(f => (
                    <span key={f} className="text-[10px] bg-white/5 border border-white/10 text-text-secondary px-2 py-1 rounded font-bold uppercase tracking-wider">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        <div className="border-2 border-dashed border-border-dark rounded-2xl p-8 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-colors cursor-pointer">
          <div className="size-12 rounded-full bg-surface-dark border border-border-dark flex items-center justify-center mb-4 group-hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-3xl">add</span>
          </div>
          <h3 className="font-bold text-lg mb-2">Custom Template</h3>
          <p className="text-xs text-text-secondary px-4">Already have a repo? Connect your custom frontend scaffold directly.</p>
        </div>
      </div>

      <div className="mt-16 flex items-center justify-between border-t border-border-dark pt-8">
        <button 
          onClick={onBack}
          className="text-text-secondary hover:text-white font-bold px-6 py-3 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Contracts
        </button>
        <button 
          onClick={onComplete}
          disabled={!selectedUI}
          className="bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-10 py-4 rounded-xl transition-all shadow-xl shadow-primary/25 flex items-center gap-3"
        >
          Generate Dashboard
          <span className="material-symbols-outlined">rocket_launch</span>
        </button>
      </div>
    </div>
  );
};

export default FrontendPage;
