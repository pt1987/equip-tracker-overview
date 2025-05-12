
import React from "react";

export default function CalendarLegend() {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Legende</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-green-100 dark:bg-green-900/20"></div>
          <span>Alle Geräte verfügbar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-yellow-100 dark:bg-yellow-900/20"></div>
          <span>Einige Geräte verfügbar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-red-100 dark:bg-red-900/20"></div>
          <span>Keine Geräte verfügbar</span>
        </div>
      </div>
    </div>
  );
}
