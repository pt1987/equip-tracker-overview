
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

// Neue Funktion zur Lokalisierung von Status-Texten
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

// Neue Funktion zur Lokalisierung von Kategorien
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

// Neue Funktion zur Lokalisierung von Cluster-Namen
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
