
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Student, Transaction, CalendarEvent, KPIData } from '../types';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { getStudentFinancialStatus } from '../lib/utils';

// --- MOCK DATA SEEDS (Moved from Views to here for initialization) ---

const INITIAL_STUDENTS: Student[] = [
  {
    id: '1', name: 'Cleyton Muianga', email: 'cleyton.m@student.seiva.mz', avatar: 'https://picsum.photos/seed/cleyton/100/100', enrollmentId: '#2023-101', grade: '6ª Classe', balance: 0, status: 'active', financialStatus: 'paid', paidMonths: ['fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro'],
    personal: { dob: '2012-05-14', gender: 'M', nationality: 'Moçambicana', biNumber: '11029384B', address: 'Av. Julius Nyerere, Polana', city: 'Maputo' },
    academic: { enrollmentDate: '2023-01-15', prevSchool: 'Escola Primária da Polana', submittedDocs: ['Certificado', 'Fotos', 'BI'] },
    guardians: { father: { name: 'Paulo Muianga', phone: '+258 84 123 4567', email: 'paulo@email.com', profession: 'Engenheiro' }, mother: { name: 'Ana Muianga', phone: '+258 82 987 6543', email: 'ana@email.com', profession: 'Médica' }, emergency: { name: 'Paulo Muianga', relation: 'Pai', phone: '+258 84 123 4567' }, financialResponsible: 'Father' },
    health: { bloodType: 'O+', allergies: 'Nenhuma', conditions: '', notes: 'Aluno com excelente desempenho em Matemática.' }
  },
  {
    id: '2', name: 'Neyma Sousa', email: 'neyma.s@student.seiva.mz', avatar: 'https://picsum.photos/seed/neyma/100/100', enrollmentId: '#2023-102', grade: '5ª Classe', balance: -2500, status: 'active', financialStatus: 'late', paidMonths: ['fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto'],
    personal: { dob: '2013-08-22', gender: 'F', nationality: 'Moçambicana', biNumber: '55029384C', address: 'Bairro do Triunfo', city: 'Maputo' },
    academic: { enrollmentDate: '2023-01-20', prevSchool: 'Escola Primária 3 de Fevereiro', submittedDocs: ['Fotos', 'BI'] },
    guardians: { father: { name: 'Carlos Sousa', phone: '+258 84 555 0000', email: 'carlos@email.com', profession: 'Advogado' }, mother: { name: 'Marta Sousa', phone: '+258 82 444 1111', email: 'marta@email.com', profession: 'Gestora' }, emergency: { name: 'Carlos Sousa', relation: 'Pai', phone: '+258 84 555 0000' }, financialResponsible: 'Father' },
    health: { bloodType: 'A+', allergies: 'Amendoim', conditions: 'Asma leve', notes: 'Necessita de bombinha em atividades físicas intensas.' }
  },
  {
    id: '3', name: 'Almiro Lobo', email: 'almiro.l@student.seiva.mz', avatar: 'https://picsum.photos/seed/almiro/100/100', enrollmentId: '#2023-145', grade: '4ª Classe', balance: 0, status: 'active', financialStatus: 'pending', paidMonths: ['fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro'],
    personal: { dob: '2014-02-10', gender: 'M', nationality: 'Moçambicana', biNumber: '99887766A', address: 'Matola Rio', city: 'Matola' },
    academic: { enrollmentDate: '2023-02-01', prevSchool: 'Colégio Kitabu', submittedDocs: ['Certificado'] },
    guardians: { father: { name: 'João Lobo', phone: '+258 85 222 3333', email: 'joao@email.com', profession: 'Comerciante' }, mother: { name: 'Luísa Lobo', phone: '+258 84 111 2222', email: 'luisa@email.com', profession: 'Doméstica' }, emergency: { name: 'João Lobo', relation: 'Pai', phone: '+258 85 222 3333' }, financialResponsible: 'Father' },
    health: { bloodType: 'B-', allergies: '', conditions: '', notes: '' }
  },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2023-10-25', description: 'Mensalidade - Cleyton Muianga', category: 'Mensalidade', type: 'income', amount: 5000, method: 'M-Pesa', status: 'completed' },
  { id: '2', date: '2023-10-24', description: 'Pagamento Internet (TV Cabo)', category: 'Internet', type: 'expense', amount: 3500, method: 'Bank Transfer', status: 'completed' },
  { id: '3', date: '2023-10-24', description: 'Compra de Material de Limpeza', category: 'Material de Limpeza', type: 'expense', amount: 1200, method: 'Cash', status: 'completed' },
  { id: '4', date: '2023-10-23', description: 'Mensalidade - Neyma Sousa', category: 'Mensalidade', type: 'income', amount: 5000, method: 'E-Mola', status: 'completed' },
  { id: '5', date: '2023-10-23', description: 'Venda de Uniforme (Kit Desportivo)', category: 'Uniforme', type: 'income', amount: 2500, method: 'POS', status: 'completed' },
  { id: '6', date: '2023-10-20', description: 'Adiantamento Salarial - Prof. João', category: 'Salários', type: 'expense', amount: 10000, method: 'Bank Transfer', status: 'completed' },
  { id: '7', date: '2023-10-20', description: 'Mensalidade - Almiro Lobo', category: 'Mensalidade', type: 'income', amount: 5000, method: 'M-Pesa', status: 'pending' },
  { id: '8', date: '2023-09-15', description: 'Mensalidade - Setembro', category: 'Mensalidade', type: 'income', amount: 15000, method: 'POS', status: 'completed' },
  { id: '9', date: '2023-09-10', description: 'Manutenção Geral', category: 'Manutenção', type: 'expense', amount: 5000, method: 'Cash', status: 'completed' },
];

const INITIAL_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Dia da Paz', start: new Date(new Date().getFullYear(), 9, 4, 8, 0), end: new Date(new Date().getFullYear(), 9, 4, 18, 0), category: 'holiday' },
  { id: '2', title: 'Dia dos Professores', start: new Date(new Date().getFullYear(), 9, 12, 8, 0), end: new Date(new Date().getFullYear(), 9, 12, 17, 0), category: 'holiday' },
  { id: '3', title: 'Exames Trimestrais', start: new Date(new Date().getFullYear(), 9, 25, 8, 0), end: new Date(new Date().getFullYear(), 9, 29, 12, 0), category: 'academic' },
  { id: '4', title: 'Reunião de Pais', start: new Date(new Date().getFullYear(), 10, 5, 14, 0), end: new Date(new Date().getFullYear(), 10, 5, 16, 0), category: 'administrative', location: 'Auditório Principal' },
];

// --- CONTEXT DEFINITION ---

interface SchoolDataContextType {
  students: Student[];
  transactions: Transaction[];
  events: CalendarEvent[];
  
  // Actions
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  addTransaction: (transaction: Transaction) => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;

  // Computed KPIs
  kpis: {
    totalStudents: number;
    totalRevenue: number;
    totalExpenses: number;
    netBalance: number;
    delinquencyRate: number; // Percentage
  };
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

export const SchoolDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Load from LocalStorage
  useEffect(() => {
    const loadData = () => {
      const storedStudents = localStorage.getItem('seiva_students');
      const storedTransactions = localStorage.getItem('seiva_transactions');
      const storedEvents = localStorage.getItem('seiva_events');

      if (storedStudents) setStudents(JSON.parse(storedStudents));
      if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
      if (storedEvents) {
        // Need to revive Dates for events
        const parsedEvents = JSON.parse(storedEvents).map((ev: any) => ({
            ...ev,
            start: new Date(ev.start),
            end: new Date(ev.end)
        }));
        setEvents(parsedEvents);
      }
      setIsLoaded(true);
    };
    loadData();
  }, []);

  // 2. Persist to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('seiva_students', JSON.stringify(students));
      localStorage.setItem('seiva_transactions', JSON.stringify(transactions));
      localStorage.setItem('seiva_events', JSON.stringify(events));
    }
  }, [students, transactions, events, isLoaded]);

  // Actions
  const addStudent = (s: Student) => setStudents(prev => [s, ...prev]);
  const updateStudent = (s: Student) => setStudents(prev => prev.map(item => item.id === s.id ? s : item));
  
  const addTransaction = (t: Transaction) => {
    // 1. Add the transaction
    setTransactions(prev => [t, ...prev]);

    // 2. Check for Student Financial Updates (Smart Logic)
    if (t.studentId && t.paidMonths && t.paidMonths.length > 0) {
        setStudents(prevStudents => prevStudents.map(student => {
            if (student.id === t.studentId) {
                // Merge new paid months with existing ones, removing duplicates
                const updatedPaidMonths = Array.from(new Set([...student.paidMonths, ...t.paidMonths!]));
                
                // Recalculate status based on new history
                const newStatus = getStudentFinancialStatus(updatedPaidMonths);

                return {
                    ...student,
                    paidMonths: updatedPaidMonths,
                    financialStatus: newStatus
                };
            }
            return student;
        }));
    }
  };
  
  const addEvent = (e: CalendarEvent) => setEvents(prev => [...prev, e]);
  const updateEvent = (e: CalendarEvent) => setEvents(prev => prev.map(ev => ev.id === e.id ? e : ev));
  const deleteEvent = (id: string) => setEvents(prev => prev.filter(ev => ev.id !== id));

  // Computed KPIs
  const kpis = useMemo(() => {
    const totalStudents = students.length;
    
    const revenue = transactions
        .filter(t => t.type === 'income' && t.status === 'completed')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const expenses = transactions
        .filter(t => t.type === 'expense' && t.status === 'completed')
        .reduce((acc, curr) => acc + curr.amount, 0);

    // Dynamic Delinquency: Count students whose computed status is 'late'
    const lateStudents = students.filter(s => getStudentFinancialStatus(s.paidMonths) === 'late').length;
    const delinquencyRate = totalStudents > 0 ? (lateStudents / totalStudents) * 100 : 0;

    return {
        totalStudents,
        totalRevenue: revenue,
        totalExpenses: expenses,
        netBalance: revenue - expenses,
        delinquencyRate: parseFloat(delinquencyRate.toFixed(1))
    };
  }, [students, transactions]);

  return (
    <SchoolDataContext.Provider value={{
      students,
      transactions,
      events,
      addStudent,
      updateStudent,
      addTransaction,
      addEvent,
      updateEvent,
      deleteEvent,
      kpis
    }}>
      {children}
    </SchoolDataContext.Provider>
  );
};

export const useSchoolData = () => {
  const context = useContext(SchoolDataContext);
  if (context === undefined) {
    throw new Error('useSchoolData must be used within a SchoolDataProvider');
  }
  return context;
};
