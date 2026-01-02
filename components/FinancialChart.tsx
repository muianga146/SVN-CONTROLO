
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FinancialData } from '../types';
import { formatCurrency } from '../lib/utils';
import { useSchoolData } from '../contexts/SchoolDataContext';
import { format, parseISO, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const FinancialChart: React.FC = () => {
  const { transactions } = useSchoolData();

  // Aggregate Data for the last 6 months
  const chartData = useMemo(() => {
    const data: FinancialData[] = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
        const date = subMonths(today, i);
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        const monthLabel = format(date, 'MMM', { locale: ptBR });

        const monthTransactions = transactions.filter(t => {
            const tDate = parseISO(t.date);
            return isWithinInterval(tDate, { start: monthStart, end: monthEnd }) && t.status === 'completed';
        });

        const entradas = monthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const saidas = monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        // Capitalize month name
        const label = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
        
        data.push({ month: label, entradas, saidas });
    }
    return data;
  }, [transactions]);

  return (
    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-[#e7ebf3] dark:border-gray-700 shadow-sm flex flex-col h-full min-h-[400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#0d121b] dark:text-white">Evolução Financeira</h3>
          <p className="text-sm text-neutral-gray">Entradas vs. Saídas (Últimos 6 meses)</p>
        </div>
        <button className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline group">
          Ver Relatório Completo
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontSize: '18px' }}>arrow_forward</span>
        </button>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#047857" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#047857" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis hide />
            <Tooltip 
              cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#ffffff',
                color: '#1e293b'
              }}
              formatter={(value: number) => [formatCurrency(value), '']}
              labelStyle={{ color: '#64748b', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="entradas" 
              stroke="#047857" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorEntradas)" 
              name="Entradas"
            />
            <Area 
              type="monotone" 
              dataKey="saidas" 
              stroke="#94a3b8" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSaidas)" 
              name="Saídas"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-8 mt-6">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-primary ring-2 ring-primary/20" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Entradas</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-slate-400 ring-2 ring-slate-400/20" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Saídas</span>
        </div>
      </div>
    </div>
  );
};
