
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
  if (!date) return '';
  return new Date(date).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function calculateAgeInMonths(date: string | Date): number {
  if (!date) return 0;
  const purchaseDate = new Date(date);
  const now = new Date();
  
  const yearDiff = now.getFullYear() - purchaseDate.getFullYear();
  const monthDiff = now.getMonth() - purchaseDate.getMonth();
  
  return yearDiff * 12 + monthDiff;
}

export function calculateEmploymentDuration(startDate: string | Date): string {
  if (!startDate) return '';
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

export function calculateWarrantyRemaining(expiryDate: string | Date): string {
  if (!expiryDate) return '';
  
  const expiry = new Date(expiryDate);
  const now = new Date();
  
  if (expiry < now) {
    return "Abgelaufen";
  }
  
  const diffTime = Math.abs(expiry.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  
  if (diffMonths > 0) {
    return `Noch ${diffMonths} Monat${diffMonths !== 1 ? 'e' : ''}`;
  } else {
    return `Noch ${diffDays} Tag${diffDays !== 1 ? 'e' : ''}`;
  }
}

export function localizeStatus(status: string): string {
  const statusMap: Record<string, string> = {
    ordered: "Bestellt",
    delivered: "Geliefert",
    in_use: "Aktiv",
    defective: "Defekt",
    repair: "In Reparatur",
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
