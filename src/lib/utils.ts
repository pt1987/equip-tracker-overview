
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

export function calculateEmploymentDuration(startDate: string | Date): string {
  const start = new Date(startDate);
  const now = new Date();
  
  const yearDiff = now.getFullYear() - start.getFullYear();
  const monthDiff = now.getMonth() - start.getMonth();
  
  const totalMonths = yearDiff * 12 + monthDiff;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  if (years > 0 && months > 0) {
    return `${years} Jahr${years !== 1 ? 'e' : ''}, ${months} Monat${months !== 1 ? 'e' : ''}`;
  } else if (years > 0) {
    return `${years} Jahr${years !== 1 ? 'e' : ''}`;
  } else {
    return `${months} Monat${months !== 1 ? 'e' : ''}`;
  }
}

// Convert ISO dates to JavaScript Date objects and back for Supabase compatibility
export function parseDateFields<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj };
  
  for (const key in result) {
    // If the key contains 'date' or 'Date', and the value is a string that looks like a date
    if ((key.toLowerCase().includes('date') || key.toLowerCase().includes('time')) && 
        typeof result[key] === 'string' && 
        /\d{4}-\d{2}-\d{2}/.test(result[key])) {
      
      // Create a new Date object from the string
      result[key] = new Date(result[key]) as any;
    }
  }
  
  return result;
}

export function stringifyDateFields<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj };
  
  for (const key in result) {
    // If the value is a Date object
    if (result[key] && result[key] instanceof Date) {
      result[key] = (result[key] as Date).toISOString() as any;
    }
  }
  
  return result;
}

export function localizeStatus(status: string): string {
  const statusMap: Record<string, string> = {
    ordered: "Bestellt",
    delivered: "Geliefert",
    in_use: "In Gebrauch",
    defective: "Defekt",
    in_repair: "In Reparatur",
    pool: "Pool"
  };
  
  return statusMap[status] || status;
}

export function localizeCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    notebook: "Notebook",
    smartphone: "Smartphone",
    tablet: "Tablet",
    mouse: "Maus",
    keyboard: "Tastatur",
    accessory: "Zubehör"
  };
  
  return categoryMap[category] || category;
}

export function localizeCluster(cluster: string): string {
  const clusterMap: Record<string, string> = {
    development: "Entwicklung",
    design: "Design",
    operations: "Betrieb",
    management: "Management",
    sales: "Vertrieb"
  };
  
  return clusterMap[cluster] || cluster;
}
