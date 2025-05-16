
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/use-toast";

// Definieren der Layout-Item-Typen
export interface DashboardLayoutItem {
  i: string;        // ID des Elements
  x: number;        // Grid-Position X
  y: number;        // Grid-Position Y
  w: number;        // Breite (in Grid-Einheiten)
  h: number;        // Höhe (in Grid-Einheiten)
  minW?: number;    // Minimale Breite
  minH?: number;    // Minimale Höhe
  static?: boolean; // Ist das Element verschiebbar?
}

interface DashboardLayoutContextType {
  layouts: DashboardLayoutItem[];
  saveLayouts: (newLayouts: DashboardLayoutItem[]) => void;
  resetToDefaultLayout: () => void;
}

// Standard-Layout für die Dashboard-Kacheln
export const defaultLayouts: DashboardLayoutItem[] = [
  { i: "assetDistribution", x: 0, y: 0, w: 12, h: 8, minW: 6, minH: 4 },
  { i: "warrantyExpiry", x: 0, y: 8, w: 6, h: 8, minW: 3, minH: 4 },
  { i: "externalReturns", x: 6, y: 8, w: 6, h: 8, minW: 3, minH: 4 },
  { i: "statusChanges", x: 0, y: 16, w: 6, h: 8, minW: 3, minH: 4 },
  { i: "employeeChanges", x: 6, y: 16, w: 6, h: 8, minW: 3, minH: 4 },
  { i: "assetStatus", x: 0, y: 24, w: 4, h: 8, minW: 3, minH: 4 },
  { i: "recentAssets", x: 4, y: 24, w: 4, h: 8, minW: 3, minH: 4 },
  { i: "recentEmployees", x: 8, y: 24, w: 4, h: 8, minW: 3, minH: 4 },
  { i: "externalAssets", x: 0, y: 32, w: 12, h: 8, minW: 6, minH: 4 },
];

const localStorageKey = "dashboard-layouts";

const DashboardLayoutContext = createContext<DashboardLayoutContextType | undefined>(undefined);

export const DashboardLayoutProvider = ({ children }: { children: ReactNode }) => {
  const [layouts, setLayouts] = useState<DashboardLayoutItem[]>(defaultLayouts);

  // Lade gespeicherte Layouts beim Initialisieren
  useEffect(() => {
    try {
      const savedLayouts = localStorage.getItem(localStorageKey);
      if (savedLayouts) {
        setLayouts(JSON.parse(savedLayouts));
      }
    } catch (error) {
      console.error("Fehler beim Laden der Dashboard-Layouts:", error);
    }
  }, []);

  const saveLayouts = (newLayouts: DashboardLayoutItem[]) => {
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(newLayouts));
      setLayouts(newLayouts);
      toast({
        title: "Layout gespeichert",
        description: "Das Dashboard-Layout wurde automatisch gespeichert.",
        duration: 2000,
      });
    } catch (error) {
      console.error("Fehler beim Speichern der Dashboard-Layouts:", error);
      toast({
        title: "Fehler",
        description: "Dashboard-Layout konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    }
  };

  const resetToDefaultLayout = () => {
    localStorage.removeItem(localStorageKey);
    setLayouts(defaultLayouts);
    toast({
      title: "Erfolgreich",
      description: "Dashboard-Layout wurde auf Standard zurückgesetzt.",
    });
  };

  return (
    <DashboardLayoutContext.Provider value={{
      layouts,
      saveLayouts,
      resetToDefaultLayout
    }}>
      {children}
    </DashboardLayoutContext.Provider>
  );
};

export const useDashboardLayout = (): DashboardLayoutContextType => {
  const context = useContext(DashboardLayoutContext);
  if (context === undefined) {
    throw new Error("useDashboardLayout muss innerhalb eines DashboardLayoutProvider verwendet werden");
  }
  return context;
};
