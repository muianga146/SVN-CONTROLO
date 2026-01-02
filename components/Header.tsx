
import React from 'react';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-surface-light dark:bg-surface-dark border-b border-[#e7ebf3] dark:border-gray-800 shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm">
          <a className="text-neutral-gray hover:text-primary transition-colors hidden sm:block" href="#">Home</a>
          <span className="text-neutral-gray text-xs material-symbols-outlined hidden sm:block" style={{ fontSize: '16px' }}>chevron_right</span>
          <span className="font-medium text-[#0d121b] dark:text-white">Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search */}
        <div className="relative group hidden sm:flex">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-neutral-gray group-focus-within:text-primary transition-colors" style={{ fontSize: '20px' }}>search</span>
          </div>
          <input 
            className="block w-48 lg:w-64 pl-10 pr-3 py-2 border border-transparent bg-background-light dark:bg-gray-800 text-sm rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-gray-900 transition-all placeholder-neutral-gray text-[#0d121b] dark:text-white" 
            placeholder="Buscar alunos, faturas..." 
            type="text"
          />
        </div>

        <div className="flex items-center border-l border-[#e7ebf3] dark:border-gray-800 pl-4 gap-2">
          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-neutral-gray hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 size-2 bg-warning rounded-full border-2 border-surface-light dark:border-surface-dark"></span>
          </button>

          {/* User Icon Mobile */}
          <button className="sm:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-neutral-gray">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
