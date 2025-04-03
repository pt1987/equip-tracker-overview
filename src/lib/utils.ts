
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency helper function for consistency across the app
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

// Format date helper function for consistency across the app
export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Calculate age in months
export const calculateAgeInMonths = (date: string) => {
  const purchaseDate = new Date(date);
  const today = new Date();
  let months = (today.getFullYear() - purchaseDate.getFullYear()) * 12;
  months -= purchaseDate.getMonth();
  months += today.getMonth();
  
  return months <= 0 ? 0 : months;
};

// Calculate employment duration
export const calculateEmploymentDuration = (startDate: string) => {
  const start = new Date(startDate);
  const today = new Date();
  let years = today.getFullYear() - start.getFullYear();
  let months = today.getMonth() - start.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  const yearText = years === 1 ? 'Jahr' : 'Jahre';
  const monthText = months === 1 ? 'Monat' : 'Monate';

  if (years > 0) {
    return `${years} ${yearText}, ${months} ${monthText}`;
  } else {
    return `${months} ${monthText}`;
  }
};

// Format date helper function for consistency across the app
export const formatDateString = (date: string | Date | null): string => {
  if (!date) return '';
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    // Format: YYYY-MM-DD
    return d.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

// Localize asset category for display
export const localizeCategory = (category: string): string => {
  const categoryMap: Record<string, string> = {
    notebook: 'Notebook',
    smartphone: 'Smartphone',
    tablet: 'Tablet',
    peripheral: 'Peripheriegerät',
    monitor: 'Monitor',
    audio: 'Audio',
    other: 'Sonstiges'
  };
  
  return categoryMap[category] || category;
};

// Utility function to group an array by a key selector function
export const groupBy = <T>(array: T[], keySelector: (item: T) => string): Record<string, T[]> => {
  return array.reduce((groups: Record<string, T[]>, item) => {
    const key = keySelector(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
};
