
import React, { useState } from 'react';
import { Employee, PayrollEntry, Department } from '../types';
import { EmployeeForm } from './rh/EmployeeForm';
import { formatCurrency } from '../lib/utils';

// --- MOCK DATA ---

const MOCK_EMPLOYEES: Employee[] = [
    {
        id: '1',
        name: 'Ricardo Mendes',
        role: 'Diretor Pedagógico',
        department: 'Direção',
        email: 'ricardo.m@seiva.mz',
        phone: '+258 84 123 4567',
        avatar: 'https://picsum.photos/seed/ricardo/100/100',
        contractType: 'Tempo Integral',
        admissionDate: '2020-01-10',
        status: 'active',
        personal: { biNumber: '11001100B', nuit: '123456789', dob: '1985-05-20' },
        bank: { bankName: 'Millennium Bim', accountNumber: '12345678', nib: '0001...' },
        salary: { base: 65000, currency: 'MZN' }
    },
    {
        id: '2',
        name: 'Fátima Têmbue',
        role: 'Prof. Português',
        department: 'Docentes',
        email: 'fatima.t@seiva.mz',
        phone: '+258 82 987 6543',
        avatar: 'https://picsum.photos/seed/fatima/100/100',
        contractType: 'Tempo Integral',
        admissionDate: '2021-02-15',
        status: 'active',
        personal: { biNumber: '22002200C', nuit: '987654321', dob: '1990-08-12' },
        bank: { bankName: 'BCI', accountNumber: '87654321', nib: '0008...' },
        salary: { base: 25000, currency: 'MZN' }
    },
    {
        id: '3',
        name: 'João Macuácua',
        role: 'Segurança',
        department: 'Segurança',
        email: 'joao.m@seiva.mz',
        phone: '+258 86 111 2222',
        avatar: 'https://picsum.photos/seed/joao/100/100',
        contractType: 'Prestador de Serviço',
        admissionDate: '2022-06-01',
        status: 'active',
        personal: { biNumber: '33003300D', nuit: '456123789', dob: '1980-03-30' },
        bank: { bankName: 'Standard Bank', accountNumber: '11223344', nib: '0003...' },
        salary: { base: 12000, currency: 'MZN' }
    },
    {
        id: '4',
        name: 'Carla Dias',
        role: 'Secretária',
        department: 'Administrativo',
        email: 'carla.d@seiva.mz',
        phone: '+258 84 555 6666',
        avatar: 'https://picsum.photos/seed/carla/100/100',
        contractType: 'Tempo Integral',
        admissionDate: '2021-08-01',
        status: 'vacation',
        personal: { biNumber: '44004400E', nuit: '789456123', dob: '1995-11-15' },
        bank: { bankName: 'Absa', accountNumber: '99887766', nib: '0002...' },
        salary: { base: 18000, currency: 'MZN' }
    }
];

const MOCK_PAYROLL: PayrollEntry[] = [
    { id: 'p1', employeeId: '1', employeeName: 'Ricardo Mendes', employeeRole: 'Diretor', monthReference: 'Outubro 2023', baseSalary: 65000, bonuses: 5000, deductions: 15400, netSalary: 54600, status: 'paid' },
    { id: 'p2', employeeId: '2', employeeName: 'Fátima Têmbue', employeeRole: 'Docente', monthReference: 'Outubro 2023', baseSalary: 25000, bonuses: 2000, deductions: 4500, netSalary: 22500, status: 'paid' },
    { id: 'p3', employeeId: '3', employeeName: 'João Macuácua', employeeRole: 'Segurança', monthReference: 'Outubro 2023', baseSalary: 12000, bonuses: 500, deductions: 900, netSalary: 11600, status: 'processing' },
    { id: 'p4', employeeId: '4', employeeName: 'Carla Dias', employeeRole: 'Secretária', monthReference: 'Outubro 2023', baseSalary: 18000, bonuses: 0, deductions: 3200, netSalary: 14800, status: 'pending' },
];

export const RHView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'colaboradores' | 'folha' | 'ponto'>('colaboradores');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showValues, setShowValues] = useState(false);
  const [filterDept, setFilterDept] = useState<string>('Todos');

  const formatMoney = (val: number) => {
    if (!showValues) return '••••••';
    return formatCurrency(val);
  };

  const getDepartmentColor = (dept: Department) => {
      switch(dept) {
          case 'Docentes': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
          case 'Administrativo': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
          case 'Direção': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
          default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      }
  };

  const filteredEmployees = filterDept === 'Todos' 
    ? MOCK_EMPLOYEES 
    : MOCK_EMPLOYEES.filter(emp => emp.department === filterDept);

  return (
    <div className="space-y-6 h-full flex flex-col">
      
      {/* 1. Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0d121b] dark:text-white">Recursos Humanos</h2>
          <div className="flex items-center gap-2 text-sm text-neutral-gray mt-1">
            <span>Home</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span>RH</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
             <button 
                onClick={() => setShowValues(!showValues)}
                className={`p-2 rounded-lg border transition-colors ${showValues ? 'bg-primary/10 border-primary text-primary' : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-gray-700 text-neutral-gray'}`}
                title={showValues ? "Ocultar Valores" : "Mostrar Valores"}
             >
                <span className="material-symbols-outlined">{showValues ? 'visibility' : 'visibility_off'}</span>
             </button>
             
             {activeTab === 'colaboradores' && (
                <button 
                    onClick={() => setIsSheetOpen(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-sm"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Novo Colaborador
                </button>
             )}
             {activeTab === 'folha' && (
                <button className="px-4 py-2 text-sm font-medium text-white bg-success rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                    Processar Folha
                </button>
             )}
        </div>
      </div>

      {/* 2. Tabs Navigation */}
      <div className="border-b border-[#e7ebf3] dark:border-gray-800">
          <nav className="flex gap-6" aria-label="Tabs">
            {[
                { id: 'colaboradores', label: 'Colaboradores', icon: 'group' },
                { id: 'folha', label: 'Folha de Pagamento', icon: 'account_balance_wallet' },
                { id: 'ponto', label: 'Controle de Ponto', icon: 'schedule' },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                        group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all
                        ${activeTab === tab.id 
                            ? 'border-primary text-primary' 
                            : 'border-transparent text-neutral-gray hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'}
                    `}
                >
                    <span className={`material-symbols-outlined text-[20px] ${activeTab === tab.id ? 'filled' : ''}`}>{tab.icon}</span>
                    {tab.label}
                </button>
            ))}
          </nav>
      </div>

      {/* 3. Tab Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        
        {/* --- TAB A: COLABORADORES --- */}
        {activeTab === 'colaboradores' && (
            <div className="space-y-6 flex-1 flex flex-col animate-in fade-in duration-300">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-[#e7ebf3] dark:border-gray-700">
                     <div className="relative w-full sm:w-96">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-neutral-gray text-[20px]">search</span>
                        <input 
                        type="text" 
                        placeholder="Buscar colaborador..." 
                        className="w-full pl-10 pr-4 py-2 bg-background-light dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 border focus:border-primary rounded-lg text-sm transition-all outline-none"
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
                        {['Todos', 'Docentes', 'Administrativo', 'Segurança'].map(dept => (
                            <button 
                                key={dept}
                                onClick={() => setFilterDept(dept)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${filterDept === dept ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-neutral-gray hover:bg-gray-200'}`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7ebf3] dark:border-gray-700 shadow-sm overflow-hidden flex-1">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-[#e7ebf3] dark:border-gray-800">
                                    <th className="py-4 px-6 text-xs font-semibold text-neutral-gray uppercase tracking-wider">Nome / Cargo</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-neutral-gray uppercase tracking-wider">Departamento</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-neutral-gray uppercase tracking-wider">Contato</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-neutral-gray uppercase tracking-wider">Contrato</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-neutral-gray uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-neutral-gray uppercase tracking-wider text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e7ebf3] dark:divide-gray-800">
                                {filteredEmployees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <img src={emp.avatar} alt={emp.name} className="size-10 rounded-full object-cover border border-gray-100 dark:border-gray-700" />
                                                <div>
                                                    <p className="text-sm font-semibold text-[#0d121b] dark:text-white">{emp.name}</p>
                                                    <p className="text-xs text-neutral-gray">{emp.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getDepartmentColor(emp.department)}`}>
                                                {emp.department}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-[#0d121b] dark:text-white">{emp.email}</span>
                                                <span className="text-xs text-neutral-gray">{emp.phone}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm text-neutral-gray bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                                                {emp.contractType}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`flex items-center gap-1.5 text-xs font-semibold ${
                                                emp.status === 'active' ? 'text-success' : 
                                                emp.status === 'vacation' ? 'text-warning' : 'text-neutral-gray'
                                            }`}>
                                                <span className={`size-1.5 rounded-full ${
                                                    emp.status === 'active' ? 'bg-success' : 
                                                    emp.status === 'vacation' ? 'bg-warning' : 'bg-neutral-gray'
                                                }`}></span>
                                                {emp.status === 'active' ? 'Ativo' : emp.status === 'vacation' ? 'Férias' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button className="text-primary hover:text-primary-dark font-medium text-xs">Editar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* --- TAB B: FOLHA DE PAGAMENTO --- */}
        {activeTab === 'folha' && (
            <div className="space-y-6 flex-1 flex flex-col animate-in fade-in duration-300">
                {/* Payroll Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <PayrollCard label="Custo Total (Mês)" value={formatMoney(113500)} icon="payments" color="text-primary" />
                    <PayrollCard label="INSS/IRPS (Retido)" value={formatMoney(24000)} icon="account_balance" color="text-neutral-gray" />
                    <PayrollCard label="Próximo Pagamento" value="30 Out" icon="calendar_month" color="text-success" />
                    <PayrollCard label="Processamento" value="75%" icon="sync" color="text-warning" isProgress />
                </div>

                {/* Payroll Table */}
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7ebf3] dark:border-gray-700 shadow-sm overflow-hidden flex-1">
                    <div className="p-4 border-b border-[#e7ebf3] dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                        <h3 className="font-bold text-[#0d121b] dark:text-white">Folha de Outubro 2023</h3>
                        <div className="flex gap-2">
                             <button className="text-xs font-medium bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">download</span> PDF Geral
                             </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-[#e7ebf3] dark:border-gray-800">
                                    <th className="py-3 px-5 text-xs font-semibold text-neutral-gray uppercase tracking-wider">Colaborador</th>
                                    <th className="py-3 px-5 text-xs font-semibold text-neutral-gray uppercase tracking-wider">Cargo</th>
                                    <th className="py-3 px-5 text-xs font-semibold text-neutral-gray uppercase tracking-wider text-right">Salário Base</th>
                                    <th className="py-3 px-5 text-xs font-semibold text-neutral-gray uppercase tracking-wider text-right">Bônus</th>
                                    <th className="py-3 px-5 text-xs font-semibold text-neutral-gray uppercase tracking-wider text-right text-warning">Descontos</th>
                                    <th className="py-3 px-5 text-xs font-semibold text-neutral-gray uppercase tracking-wider text-right">Líquido</th>
                                    <th className="py-3 px-5 text-xs font-semibold text-neutral-gray uppercase tracking-wider text-center">Status</th>
                                    <th className="py-3 px-5 text-xs font-semibold text-neutral-gray uppercase tracking-wider text-right">Recibo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e7ebf3] dark:divide-gray-800">
                                {MOCK_PAYROLL.map((pay) => (
                                    <tr key={pay.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="py-3 px-5 font-medium text-[#0d121b] dark:text-white">{pay.employeeName}</td>
                                        <td className="py-3 px-5 text-xs text-neutral-gray">{pay.employeeRole}</td>
                                        <td className="py-3 px-5 text-right text-sm">{formatMoney(pay.baseSalary)}</td>
                                        <td className="py-3 px-5 text-right text-sm text-green-600">{formatMoney(pay.bonuses)}</td>
                                        <td className="py-3 px-5 text-right text-sm text-warning">{formatMoney(pay.deductions)}</td>
                                        <td className="py-3 px-5 text-right font-bold text-[#0d121b] dark:text-white">{formatMoney(pay.netSalary)}</td>
                                        <td className="py-3 px-5 text-center">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                pay.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                pay.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {pay.status === 'paid' ? 'Pago' : pay.status === 'processing' ? 'Proc.' : 'Pendente'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-5 text-right">
                                            <button className="text-neutral-gray hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">description</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* --- TAB C: PONTO (ATTENDANCE) --- */}
        {activeTab === 'ponto' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-300 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-8">
                 <div className="size-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                    <span className="material-symbols-outlined text-3xl">fingerprint</span>
                 </div>
                 <h3 className="text-xl font-bold text-[#0d121b] dark:text-white mb-2">Controle de Ponto Biométrico</h3>
                 <p className="text-neutral-gray max-w-md mb-6">Integração com o sistema biométrico da escola. Visualize entradas, saídas e horas extras em tempo real.</p>
                 <button className="px-6 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:border-primary transition-colors font-medium">
                    Conectar Dispositivo
                 </button>
            </div>
        )}

      </div>

      {/* Sheet for New Employee */}
      {isSheetOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
              <div 
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={() => setIsSheetOpen(false)}
              ></div>
              <div className="relative w-full max-w-xl bg-surface-light dark:bg-surface-dark shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
                  <div className="p-6 border-b border-[#e7ebf3] dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                      <div>
                          <h2 className="text-xl font-bold text-[#0d121b] dark:text-white">Novo Colaborador</h2>
                          <p className="text-sm text-neutral-gray">Registro de ficha de funcionário.</p>
                      </div>
                      <button onClick={() => setIsSheetOpen(false)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                          <span className="material-symbols-outlined text-neutral-gray">close</span>
                      </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
                      <EmployeeForm onSuccess={() => setIsSheetOpen(false)} onCancel={() => setIsSheetOpen(false)} />
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

const PayrollCard: React.FC<{ label: string; value: string; icon: string; color: string; isProgress?: boolean }> = ({ label, value, icon, color, isProgress }) => (
    <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-[#e7ebf3] dark:border-gray-700 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-800 ${color}`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
        </div>
        <div className="mt-4">
             <p className="text-sm text-neutral-gray font-medium">{label}</p>
             <h3 className="text-2xl font-bold text-[#0d121b] dark:text-white">{value}</h3>
             {isProgress && (
                 <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full mt-2">
                     <div className="bg-warning h-1.5 rounded-full" style={{width: '75%'}}></div>
                 </div>
             )}
        </div>
    </div>
);
