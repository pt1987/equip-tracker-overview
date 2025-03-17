
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function groupBy<T>(array: T[], key: (item: T) => string): Record<string, T[]> {
  return array.reduce((result, currentItem) => {
    const groupKey = key(currentItem);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(currentItem);
    return result;
  }, {} as Record<string, T[]>);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function calculateAgeInMonths(date: string | Date): number {
  const purchaseDate = new Date(date);
  const now = new Date();
  
  const yearDiff = now.getFullYear() - purchaseDate.getFullYear();
  const monthDiff = now.getMonth() - purchaseDate.getMonth();
  
  return yearDiff * 12 + monthDiff;
}
