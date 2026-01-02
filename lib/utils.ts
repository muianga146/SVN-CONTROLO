
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Standard class merger for Shadcn/UI and Tailwind components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * STRICTLY formats numbers to Mozambican Metical.
 * @param value The numerical amount
 * @returns Formatted string (e.g. "1.250,00 MT")
 */
export function formatCurrency(value: number): string {
  // Use pt-MZ locale for correct decimal (,) and thousand separator (.)
  const formatted = new Intl.NumberFormat("pt-MZ", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return `${formatted} MT`;
}

/**
 * Standard date formatter for Mozambique locale.
 * @param date Date object or ISO string
 * @returns "dd/MM/yyyy"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-MZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(d);
}

// --- Smart Financial Logic ---

export const ACADEMIC_MONTHS = [
  'fevereiro', 'março', 'abril', 'maio', 'junho', 
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
];

/**
 * Calculates the current financial status of a student.
 * Rule: 
 * - Jan: Always 'paid' (Vacation).
 * - 1st to 10th: 'pending' (if not paid).
 * - 11th+: 'late' (if not paid).
 * - If month in paidMonths: 'paid'.
 */
export function getStudentFinancialStatus(paidMonths: string[]): 'paid' | 'pending' | 'late' {
  const now = new Date();
  const currentMonthIndex = now.getMonth(); // 0 = Jan, 1 = Feb...
  const currentDay = now.getDate();

  // 1. January (0) is vacation/enrollment period, usually considered "Up to date" or handled separately.
  if (currentMonthIndex === 0) return 'paid';

  // 2. Determine current academic month name (Feb is index 1, but index 0 in our ACADEMIC_MONTHS array)
  // ACADEMIC_MONTHS[0] is 'fevereiro' which corresponds to getMonth() == 1
  const academicMonthName = ACADEMIC_MONTHS[currentMonthIndex - 1];

  // 3. Check if current month is paid
  if (paidMonths && paidMonths.includes(academicMonthName)) {
    return 'paid';
  }

  // 4. If not paid, check the date
  if (currentDay <= 10) {
    return 'pending'; // Before due date
  } else {
    return 'late'; // After due date
  }
}
