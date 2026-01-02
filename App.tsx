
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { StudentsView } from './components/StudentsView';
import { FinancialView } from './components/FinancialView';
import { RHView } from './components/RHView';
import { AgendaView } from './components/AgendaView';
import { SettingsView } from './components/SettingsView';
import { ViewType } from './types';
import { SettingsProvider } from './contexts/SettingsContext';
import { SchoolDataProvider } from './contexts/SchoolDataContext';

/**
 * App / Root Layout
 * Acts as the main shell for the application.
 */
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <SettingsProvider>
      <SchoolDataProvider>
        <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-background-dark font-sans antialiased text-[#0d121b]">
          {/* Sidebar - Persistent (Fixed Left) */}
          <Sidebar 
            currentView={currentView} 
            onViewChange={setCurrentView} 
            isOpen={isSidebarOpen} 
          />

          {/* Main Layout Area */}
          <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
            
            {/* Header (Top Bar) */}
            <Header onMenuClick={toggleSidebar} />
            
            {/* Content Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
              <div className="max-w-7xl mx-auto space-y-6 h-full pb-10">
                
                {/* View Router */}
                {currentView === 'dashboard' && <Dashboard />}
                {currentView === 'alunos' && <StudentsView />}
                {currentView === 'financeiro' && <FinancialView />}
                {currentView === 'rh' && <RHView />}
                {currentView === 'agenda' && <AgendaView />}
                {currentView === 'config' && <SettingsView />}
                
                {/* 404 / Work in Progress State */}
                {currentView !== 'dashboard' && currentView !== 'alunos' && currentView !== 'financeiro' && currentView !== 'rh' && currentView !== 'agenda' && currentView !== 'config' && (
                  <div className="flex flex-col items-center justify-center h-[60vh] text-neutral-gray gap-4 animate-in fade-in zoom-in-95">
                    <div className="p-6 bg-white dark:bg-surface-dark rounded-full shadow-sm">
                      <span className="material-symbols-outlined text-6xl text-primary/40">construction</span>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-[#0d121b] dark:text-white">Módulo em Desenvolvimento</h3>
                      <p className="text-sm mt-1">A seção "{currentView}" estará disponível em breve.</p>
                    </div>
                    <button 
                      onClick={() => setCurrentView('dashboard')}
                      className="mt-4 px-6 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
                    >
                      Voltar ao Início
                    </button>
                  </div>
                )}

              </div>
            </main>
          </div>
        </div>
      </SchoolDataProvider>
    </SettingsProvider>
  );
};

export default App;
