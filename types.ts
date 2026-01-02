
// --- Core Definitions ---

export interface SchoolConfig {
  name: string;
  currency: 'MZN';
  currentYear: string;
}

// --- Entity Types ---

// Derived from Constants (Manual sync required if constants move to pure JSON)
export type GradeLevel = "1ª Classe" | "2ª Classe" | "3ª Classe" | "4ª Classe" | "5ª Classe" | "6ª Classe";

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  
  // Academic
  enrollmentId: string; // e.g. #2023-050
  grade: GradeLevel; 
  
  // Financial
  balance: number; // Positive = Credit, Negative = Debt
  financialStatus: 'paid' | 'late' | 'pending';
  paidMonths: string[]; // e.g. ['fevereiro', 'marco']
  
  // Status
  status: 'active' | 'suspended' | 'transferred';
  
  // Details
  personal: {
    dob: string;
    gender: 'M' | 'F';
    nationality: string;
    biNumber: string;
    address: string;
    city: string;
  };

  academic: {
    enrollmentDate: string;
    prevSchool: string;
    submittedDocs: string[];
  };

  guardians: {
    father: { name: string; phone: string; email: string; profession: string };
    mother: { name: string; phone: string; email: string; profession: string };
    emergency: { name: string; relation: string; phone: string };
    financialResponsible: 'Father' | 'Mother' | 'Other';
  };

  health: {
    bloodType: string;
    allergies: string;
    conditions: string;
    notes: string;
  };
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  method: 'M-Pesa' | 'E-Mola' | 'POS' | 'Bank Transfer' | 'Cash';
  status: 'completed' | 'pending' | 'cancelled';
  attachment?: string;
  // Metadata for student updates (optional, for processing)
  studentId?: string;
  paidMonths?: string[];
}

export type Department = 'Docentes' | 'Administrativo' | 'Serviços Gerais' | 'Segurança' | 'Direção';

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: Department;
  salary: {
    base: number;
    currency: string;
  };
  
  // Details
  email: string;
  phone: string;
  avatar: string;
  contractType: 'Tempo Integral' | 'Tempo Parcial' | 'Prestador de Serviço';
  admissionDate: string;
  status: 'active' | 'vacation' | 'sick_leave' | 'terminated';
  
  personal: {
    biNumber: string;
    nuit: string;
    dob: string;
  };
  bank: {
    bankName: string;
    accountNumber: string;
    nib: string;
  };
}

// --- Module Specific Types ---

export interface StudentAlert {
  id: string;
  name: string;
  grade: GradeLevel;
  count: number;
  avatar?: string;
}

export interface FinancialData {
  month: string;
  entradas: number;
  saidas: number;
}

export interface KPIData {
  label: string;
  value: string;
  subValue?: string;
  trend: number;
  trendLabel: string;
  trendDirection: 'up' | 'down' | 'neutral';
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'info';
  progress?: number;
  isTarget?: boolean;
}

export type ViewType = 'dashboard' | 'alunos' | 'financeiro' | 'rh' | 'agenda' | 'config' | 'suporte';

export interface PayrollEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  monthReference: string;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  status: 'paid' | 'processing' | 'pending';
  paymentDate?: string;
}

export type EventCategory = 'academic' | 'holiday' | 'administrative' | 'event';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  category: EventCategory;
  location?: string;
}

export interface SchoolSettings {
  profile: {
    name: string;
    slogan: string;
    nuit: string;
    address: string;
    email: string;
    phone: string;
    logo: string;
  };
  academic: {
    currentYear: string;
    gradingSystem: '0-20' | '0-100' | 'A-F';
    passingGrade: number;
    activeTerms: string[];
  };
  financial: {
    currency: string;
    dueDay: string;
    lateFee: number;
    // Updated for Primary School Cycles
    tuitionCycle1: number; // 1ª - 3ª Classe
    tuitionCycle2: number; // 4ª - 6ª Classe
    bankInfo: string;
  };
  system: {
    maintenanceMode: boolean;
    emailAlerts: boolean;
    smsIntegration: boolean;
  };
}
