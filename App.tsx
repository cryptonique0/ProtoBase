
import React, { useState, useCallback } from 'react';
import { ProjectStep, IdeaAnalysis, ContractModule, UITemplate } from './types';
import LandingPage from './pages/LandingPage';
import IntakePage from './pages/IntakePage';
import ContractsPage from './pages/ContractsPage';
import FrontendPage from './pages/FrontendPage';
import DeploymentPage from './pages/DeploymentPage';
import MonitorPage from './pages/MonitorPage';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<ProjectStep>(ProjectStep.LANDING);
  const [analysis, setAnalysis] = useState<IdeaAnalysis | null>(null);
  const [selectedModules, setSelectedModules] = useState<ContractModule[]>([]);
  const [moduleCustomizations, setModuleCustomizations] = useState<Record<string, string>>({});
  const [selectedUI, setSelectedUI] = useState<UITemplate | null>(null);

  const navigateTo = useCallback((step: ProjectStep) => {
    setCurrentStep(step);
    window.scrollTo(0, 0);
  }, []);

  const handleCustomizeModule = (moduleId: string, logic: string) => {
    setModuleCustomizations(prev => ({
      ...prev,
      [moduleId]: logic
    }));
  };

  const renderPage = () => {
    switch (currentStep) {
      case ProjectStep.LANDING:
        return <LandingPage onStart={() => navigateTo(ProjectStep.INTAKE)} />;
      case ProjectStep.INTAKE:
        return <IntakePage 
          onComplete={(data) => { setAnalysis(data); navigateTo(ProjectStep.CONTRACTS); }} 
          onBack={() => navigateTo(ProjectStep.LANDING)}
        />;
      case ProjectStep.CONTRACTS:
        return <ContractsPage 
          analysis={analysis}
          selectedModules={selectedModules}
          moduleCustomizations={moduleCustomizations}
          onCustomize={handleCustomizeModule}
          onSelect={(module) => {
            setSelectedModules(prev => {
              const exists = prev.find(m => m.id === module.id);
              if (exists) {
                const newModules = prev.filter(m => m.id !== module.id);
                // Also clean up customization if deselected
                const newCustoms = { ...moduleCustomizations };
                delete newCustoms[module.id];
                setModuleCustomizations(newCustoms);
                return newModules;
              }
              return [...prev, module];
            });
          }}
          onComplete={() => navigateTo(ProjectStep.FRONTEND)}
          onBack={() => navigateTo(ProjectStep.INTAKE)}
        />;
      case ProjectStep.FRONTEND:
        return <FrontendPage 
          onSelect={(ui) => { setSelectedUI(ui); }}
          selectedUI={selectedUI}
          onComplete={() => navigateTo(ProjectStep.DEPLOYMENT)}
          onBack={() => navigateTo(ProjectStep.CONTRACTS)}
        />;
      case ProjectStep.DEPLOYMENT:
        return <DeploymentPage 
          onComplete={() => navigateTo(ProjectStep.MONITOR)}
          onBack={() => navigateTo(ProjectStep.FRONTEND)}
        />;
      case ProjectStep.MONITOR:
        return <MonitorPage 
          onReset={() => {
            setAnalysis(null);
            setSelectedModules([]);
            setModuleCustomizations({});
            setSelectedUI(null);
            navigateTo(ProjectStep.LANDING);
          }}
        />;
      default:
        return <LandingPage onStart={() => navigateTo(ProjectStep.INTAKE)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-white flex flex-col font-display">
      {/* Universal Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border-dark bg-background-dark/80 backdrop-blur-md px-6 py-4 lg:px-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo(ProjectStep.LANDING)}>
          <div className="size-8 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl font-bold">rocket_launch</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">ProtoBase</h2>
        </div>
        
        {currentStep !== ProjectStep.LANDING && (
          <div className="hidden md:flex flex-col gap-1 w-1/3 max-w-md">
            <div className="h-1.5 w-full bg-border-dark rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out" 
                style={{ 
                  width: `${
                    currentStep === ProjectStep.INTAKE ? 20 :
                    currentStep === ProjectStep.CONTRACTS ? 40 :
                    currentStep === ProjectStep.FRONTEND ? 60 :
                    currentStep === ProjectStep.DEPLOYMENT ? 80 : 100
                  }%` 
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] uppercase font-bold text-text-secondary tracking-widest">
              <span className={currentStep === ProjectStep.INTAKE ? 'text-primary' : ''}>Intake</span>
              <span className={currentStep === ProjectStep.CONTRACTS ? 'text-primary' : ''}>Contracts</span>
              <span className={currentStep === ProjectStep.FRONTEND ? 'text-primary' : ''}>Frontend</span>
              <span className={currentStep === ProjectStep.DEPLOYMENT ? 'text-primary' : ''}>Deploy</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 rounded-lg bg-surface-dark px-4 py-2 text-xs font-bold hover:bg-border-dark transition-colors border border-border-dark">
            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            <span className="hidden sm:inline">0x71...4A92</span>
          </button>
        </div>
      </header>

      <main className="flex-1">
        {renderPage()}
      </main>

      <footer className="border-t border-border-dark bg-background-dark py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-secondary">
          <p>© 2024 ProtoBase Labs. Built on Base.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
