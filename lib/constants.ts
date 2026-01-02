
export const SCHOOL_NAME = "Seiva da Nação";
export const SCHOOL_SLOGAN = "Gestão Integrada";
export const CURRENCY_CODE = "MZN";
export const CURRENCY_SYMBOL = "MT";
export const LOCALE = "pt-MZ";

// --- Mozambican Primary School (SNE - Sistema Nacional de Educação) ---

export const SCHOOL_PHASE = "Ensino Primário do 1º Grau";

export const AVAILABLE_GRADES = [
  "1ª Classe",
  "2ª Classe",
  "3ª Classe",
  "4ª Classe",
  "5ª Classe",
  "6ª Classe"
] as const;

export const EDUCATION_CYCLES = {
  CYCLE_1: ["1ª Classe", "2ª Classe", "3ª Classe"], // 1º Ciclo: Aprendizagem
  CYCLE_2: ["4ª Classe", "5ª Classe", "6ª Classe"]  // 2º Ciclo: Aprofundamento
};

export const CLASS_LETTERS = ["A", "B", "C", "D", "E"] as const;

export const ACADEMIC_SHIFTS = [
  { value: 'manha', label: 'Manhã (07:00 - 12:00)' },
  { value: 'tarde', label: 'Tarde (12:30 - 17:30)' }
] as const;

export const ACADEMIC_SUBJECTS = [
  // Disciplinas Transversais / Comuns
  "Português",
  "Matemática",
  "Educação Visual",
  "Educação Física",
  "Noções de Empreendedorismo",
  
  // Específicas 1º Ciclo (1ª-3ª)
  "Estudo do Meio",
  
  // Específicas 2º Ciclo (4ª-6ª)
  "Ciências Naturais",
  "Ciências Sociais",
  "Inglês",
  "Educação Musical",
  "Ofícios"
] as const;

export const PAYMENT_METHODS = [
  "M-Pesa",
  "E-Mola",
  "Transferência Bancária",
  "Depósito Bancário",
  "POS",
  "Numerário"
] as const;

export const MOCK_SCHOOL_DATA = {
  name: SCHOOL_NAME,
  currency: CURRENCY_CODE,
  currentYear: new Date().getFullYear().toString(),
  phase: SCHOOL_PHASE
};
