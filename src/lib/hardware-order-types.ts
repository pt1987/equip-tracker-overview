
export type HardwareCategory = 
  | 'notebook' 
  | 'smartphone' 
  | 'headset' 
  | 'mouse' 
  | 'adapter' 
  | 'accessories'
  | 'special';

export interface HardwareOrderFormData {
  employeeId: string;
  articleName: string;
  articleConfiguration: string;
  articleCategory: HardwareCategory;
  articleLink: string;
  justification?: string;
  estimatedPrice: number;
}

export interface BudgetRules {
  baseInitialBudget: number;
  yearlyIncrease: number;
  maxBudget: number;
  maxSmartphonePrice: number;
}

export const budgetRules: BudgetRules = {
  baseInitialBudget: 3950,
  yearlyIncrease: 950,
  maxBudget: 5000,
  maxSmartphonePrice: 1000
};

export function calculateAvailableBudget(entryDate: string, usedBudget: number): {
  totalBudget: number;
  availableBudget: number;
  budgetExceeded: boolean;
} {
  const startDate = new Date(entryDate);
  const now = new Date();
  
  // Calculate years of employment (complete years)
  const yearDiff = now.getFullYear() - startDate.getFullYear();
  const monthDiff = now.getMonth() - startDate.getMonth();
  const dayDiff = now.getDate() - startDate.getDate();
  
  const yearsCompleted = yearDiff - (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? 1 : 0);
  
  // Calculate budgets
  const additionalBudget = yearsCompleted * budgetRules.yearlyIncrease;
  const totalBudget = Math.min(budgetRules.baseInitialBudget + additionalBudget, budgetRules.maxBudget);
  const availableBudget = totalBudget - usedBudget;
  
  return {
    totalBudget,
    availableBudget,
    budgetExceeded: availableBudget < 0
  };
}

export const hardwareCategoryInfo: Record<HardwareCategory, { name: string; description: string; requiresJustification: boolean }> = {
  notebook: {
    name: "Notebook",
    description: "Freie Herstellerwahl mit Beachtung von ISMS-Richtlinien. Mindestlebenszeit: 4 Jahre.",
    requiresJustification: false
  },
  smartphone: {
    name: "Smartphone",
    description: "Freie Wahl mit maximalen Kaufpreis von 1000€ brutto.",
    requiresJustification: false
  },
  headset: {
    name: "Headset",
    description: "Maximal ein Headset pro Mitarbeiter.",
    requiresJustification: false
  },
  mouse: {
    name: "Maus",
    description: "Bitte auf Nachhaltigkeit achten.",
    requiresJustification: false
  },
  adapter: {
    name: "Adapter",
    description: "Bitte auf Nachhaltigkeit achten.",
    requiresJustification: false
  },
  accessories: {
    name: "Sonstiges Zubehör",
    description: "Bitte auf Nachhaltigkeit achten.",
    requiresJustification: false
  },
  special: {
    name: "Sonderbestellung",
    description: "Smartphones über 1000€, iPads, tragbare Monitore, etc. - Begründung erforderlich.",
    requiresJustification: true
  }
};
