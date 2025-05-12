
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function CalendarLegend() {
  const isMobile = useIsMobile();
  
  return (
    <div className={`${isMobile ? 'mt-4' : 'mt-6'}`}>
      <h3 className="text-lg font-medium mb-2">Legende</h3>
      <div className={`${isMobile ? 'grid grid-cols-1 gap-2' : 'space-y-2'}`}>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-green-100 dark:bg-green-900/20"></div>
          <span className="text-sm">Alle Geräte verfügbar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-yellow-100 dark:bg-yellow-900/20"></div>
          <span className="text-sm">Einige Geräte verfügbar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-red-100 dark:bg-red-900/20"></div>
          <span className="text-sm">Keine Geräte verfügbar</span>
        </div>
      </div>
    </div>
  );
}
