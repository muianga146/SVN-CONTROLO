
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../lib/utils';

const data = [
  { period: 'Sem 1', entradas: 45000, saidas: 12000 },
  { period: 'Sem 2', entradas: 52000, saidas: 38000 },
  { period: 'Sem 3', entradas: 28000, saidas: 15000 },
  { period: 'Sem 4', entradas: 61000, saidas: 42000 },
];

export const FinancialBarChart: React.FC = () => {
  return (
    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-[#e7ebf3] dark:border-gray-700 shadow-sm h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[#0d121b] dark:text-white">Fluxo de Caixa (Outubro)</h3>
        <p className="text-sm text-neutral-gray">Comparativo semanal de entradas e saídas.</p>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            barSize={32}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="period" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis hide />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#ffffff',
                color: '#1e293b'
              }}
              formatter={(value: number) => [formatCurrency(value), '']}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              wrapperStyle={{ paddingBottom: '20px' }}
            />
            <Bar 
              dataKey="entradas" 
              name="Entradas" 
              fill="#047857" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              dataKey="saidas" 
              name="Saídas" 
              fill="#e73908" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
