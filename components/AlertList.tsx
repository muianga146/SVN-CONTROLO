
import React, { useState } from 'react';
import { StudentAlert } from '../types';

export const AlertList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faltas' | 'atrasos'>('faltas');

  const alerts: StudentAlert[] = [
    { 
      id: '1', 
      name: 'João Silva', 
      grade: '3ª Classe', 
      count: 4, 
      avatar: 'https://picsum.photos/seed/joao/100/100' 
    },
    { 
      id: '2', 
      name: 'Maria Souza', 
      grade: '5ª Classe', 
      count: 3, 
      avatar: 'https://picsum.photos/seed/maria/100/100' 
    },
    { 
      id: '3', 
      name: 'Pedro Ferreira', 
      grade: '1ª Classe', 
      count: 5 
    },
  ];

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7ebf3] dark:border-gray-700 shadow-sm flex flex-col overflow-hidden h-full min-h-[400px]">
      <div className="p-5 border-b border-[#e7ebf3] dark:border-gray-800 bg-red-50 dark:bg-red-900/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-warning filled">error</span>
          <h3 className="text-lg font-bold text-[#0d121b] dark:text-white">Atenção Necessária</h3>
        </div>
      </div>

      <div className="flex flex-col h-full">
        {/* Tabs */}
        <div className="grid grid-cols-2 p-1 bg-gray-100 dark:bg-gray-800 m-4 rounded-lg">
          <button 
            onClick={() => setActiveTab('faltas')}
            className={`py-2 text-sm font-semibold rounded-md transition-all ${
              activeTab === 'faltas' 
                ? 'bg-white dark:bg-surface-dark text-warning shadow-sm' 
                : 'text-neutral-gray hover:text-gray-700'
            }`}
          >
            Faltas (3+)
          </button>
          <button 
            onClick={() => setActiveTab('atrasos')}
            className={`py-2 text-sm font-semibold rounded-md transition-all ${
              activeTab === 'atrasos' 
                ? 'bg-white dark:bg-surface-dark text-warning shadow-sm' 
                : 'text-neutral-gray hover:text-gray-700'
            }`}
          >
            Atrasos (>30d)
          </button>
        </div>

        {/* List */}
        <ul className="flex-1 divide-y divide-[#e7ebf3] dark:divide-gray-800 overflow-y-auto px-4">
          {alerts.map((student) => (
            <li 
              key={student.id} 
              className="py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group rounded-lg px-2"
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  {student.avatar ? (
                    <img 
                      src={student.avatar} 
                      alt={student.name}
                      className="size-10 rounded-full object-cover border border-gray-100 dark:border-gray-700"
                    />
                  ) : (
                    <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 bg-warning text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-surface-dark shadow-sm">
                    {student.count}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0d121b] dark:text-white truncate">{student.name}</p>
                  <p className="text-xs text-neutral-gray truncate">{student.grade}</p>
                </div>
                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors text-lg">
                  chevron_right
                </span>
              </div>
            </li>
          ))}
        </ul>
        
        <div className="p-4 border-t border-[#e7ebf3] dark:border-gray-800">
          <button className="text-sm text-primary font-semibold w-full py-2 hover:bg-primary/5 rounded-lg transition-colors flex items-center justify-center gap-1">
            Ver todos os alertas
          </button>
        </div>
      </div>
    </div>
  );
};
