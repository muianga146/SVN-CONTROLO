
import React from 'react';
import { ViewType } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen }) => {
  const { settings } = useSettings();
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'alunos', label: 'Alunos', icon: 'school' },
    { id: 'financeiro', label: 'Financeiro', icon: 'payments' },
    { id: 'rh', label: 'RH', icon: 'group' },
    { id: 'agenda', label: 'Agenda', icon: 'calendar_month' },
  ];

  const systemItems = [
    { id: 'config', label: 'Configurações', icon: 'settings' },
    { id: 'suporte', label: 'Suporte', icon: 'help' },
  ];

  return (
    <aside className={`
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      fixed md:relative md:translate-x-0 z-40
      w-64 h-full flex-shrink-0 bg-surface-light dark:bg-surface-dark border-r border-[#e7ebf3] dark:border-gray-800 
      flex flex-col justify-between transition-all duration-300
    `}>
      <div className="flex flex-col h-full">
        {/* Brand - Connected to Context */}
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
             {settings.profile.logo ? (
                <img src={settings.profile.logo} alt="Logo" className="w-full h-full object-contain" />
             ) : (
                <div className="bg-primary size-full flex items-center justify-center text-white">
                  <span className="font-bold text-xl">S</span>
                </div>
             )}
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-[#0d121b] dark:text-white text-base font-bold leading-tight truncate">{settings.profile.name}</h1>
            <p className="text-neutral-gray text-xs font-normal truncate">{settings.profile.slogan}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 gap-6 flex flex-col overflow-y-auto">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as ViewType)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group
                  ${currentView === item.id 
                    ? 'bg-brand-green-50 text-brand-green-700 dark:text-brand-green-500 dark:bg-brand-green-900/20' 
                    : 'text-[#4c669a] hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#0d121b] dark:hover:text-white'}
                `}
              >
                <span className={`material-symbols-outlined ${currentView === item.id ? 'filled' : ''} group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </span>
                <p className="text-sm font-medium leading-normal">{item.label}</p>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-[#e7ebf3] dark:border-gray-800">
            <p className="px-3 text-xs font-semibold text-[#4c669a] uppercase tracking-wider mb-2">Sistema</p>
            <div className="flex flex-col gap-1">
              {systemItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id as ViewType)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group
                    ${currentView === item.id 
                      ? 'bg-brand-green-50 text-brand-green-700 dark:text-brand-green-500 dark:bg-brand-green-900/20' 
                      : 'text-[#4c669a] hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#0d121b] dark:hover:text-white'}
                  `}
                >
                  <span className={`material-symbols-outlined ${currentView === item.id ? 'filled' : ''} group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </span>
                  <p className="text-sm font-medium leading-normal">{item.label}</p>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* User Mini Profile - Connected to Context */}
        <div className="p-4 border-t border-[#e7ebf3] dark:border-gray-800">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
            <img 
              src={settings.user.avatar} 
              alt={settings.user.name}
              className="size-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-700 group-hover:ring-primary transition-all"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#0d121b] dark:text-white truncate">{settings.user.name}</p>
              <p className="text-xs text-neutral-gray truncate">{settings.user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
