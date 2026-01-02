
import React from 'react';
import { KPIData } from '../types';

interface KpiCardProps {
  data: KPIData;
}

export const KpiCard: React.FC<KpiCardProps> = ({ data }) => {
  // Determine Badge Color
  const getBadgeStyle = () => {
    if (data.isTarget) return 'text-primary bg-primary/10';
    
    // For Inadimplência (default warning color), down is good (green), up is bad (red)
    if (data.color === 'warning') {
        return data.trendDirection === 'down' ? 'text-success bg-success/10' : 'text-warning bg-warning/10';
    }

    // Default: Up is good (green), Down is bad (red)
    return data.trendDirection === 'up' ? 'text-success bg-success/10' : 'text-warning bg-warning/10';
  };

  const getIcon = () => {
      if (data.isTarget) return 'target';
      return data.trendDirection === 'up' ? 'trending_up' : 'trending_down';
  }

  return (
    <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-[#e7ebf3] dark:border-gray-700 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-2 rounded-lg ${
          data.color === 'primary' ? 'bg-primary/10 text-primary' :
          data.color === 'success' ? 'bg-success/10 text-success' :
          data.color === 'info' ? 'bg-primary/10 text-primary' :
          'bg-warning/10 text-warning'
        }`}>
          <span className="material-symbols-outlined">{data.icon}</span>
        </div>
        <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${getBadgeStyle()}`}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{getIcon()}</span>
          {data.trendLabel}
        </span>
      </div>
      
      <div className="relative z-10">
        <p className="text-neutral-gray text-sm font-medium">{data.label}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <h3 className="text-2xl font-bold text-[#0d121b] dark:text-white">{data.value}</h3>
          {data.subValue && (
            <span className="text-sm text-neutral-gray font-normal">{data.subValue}</span>
          )}
        </div>
        
        {data.progress !== undefined && (
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${data.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Decorative Background Icon */}
      <div className="absolute -right-4 -bottom-4 text-gray-100 dark:text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <span className="material-symbols-outlined" style={{ fontSize: '96px' }}>{data.icon}</span>
      </div>
    </div>
  );
};
