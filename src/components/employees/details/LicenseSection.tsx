
import React from "react";
import { KeyRound } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { EmployeeLicense } from "./useLicenseData";

interface LicenseSectionProps {
  licenses: EmployeeLicense[];
  isLoading: boolean;
}

export default function LicenseSection({ licenses, isLoading }: LicenseSectionProps) {
  if (isLoading) {
    return (
      <div className="glass-card p-3 sm:p-4">
        <div className="flex items-center gap-1 mb-2">
          <KeyRound size={16} className="text-gray-700" />
          <h2 className="text-base font-medium">Lizenzen</h2>
        </div>
        <div className="animate-pulse space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (licenses.length === 0) {
    return (
      <div className="glass-card p-3 sm:p-4">
        <div className="flex items-center gap-1 mb-2">
          <KeyRound size={16} className="text-gray-700" />
          <h2 className="text-base font-medium">Lizenzen</h2>
        </div>
        <div className="text-center p-3">
          <div className="mx-auto w-8 h-8 mb-2 rounded-full bg-muted flex items-center justify-center">
            <KeyRound size={16} className="text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium mb-1">Keine Lizenzen zugewiesen</h3>
          <p className="text-xs text-muted-foreground">
            Diesem Mitarbeiter sind noch keine Software-Lizenzen zugewiesen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-3 sm:p-4">
      <div className="flex items-center gap-1 mb-2">
        <KeyRound size={16} className="text-gray-700" />
        <h2 className="text-base font-medium">Lizenzen</h2>
        <span className="ml-1 text-xs text-muted-foreground">
          ({licenses.length})
        </span>
      </div>

      <div className="space-y-2">
        {licenses.map((license) => (
          <div 
            key={license.id} 
            className="border border-border rounded-md p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium truncate">{license.name}</h3>
              <p className="text-xs text-muted-foreground">
                {license.licenseType}
              </p>
              {license.notes && (
                <p className="text-xs italic mt-1">{license.notes}</p>
              )}
            </div>

            <div className="flex flex-col items-end">
              <p className="text-xs">
                <span className="text-muted-foreground">Zugewiesen: </span>
                {license.assignmentDate ? 
                  format(new Date(license.assignmentDate), 'dd.MM.yyyy', { locale: de }) : 
                  'Unbekannt'
                }
              </p>
              {license.expiryDate && (
                <p className="text-xs">
                  <span className="text-muted-foreground">Ablaufdatum: </span>
                  {format(new Date(license.expiryDate), 'dd.MM.yyyy', { locale: de })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
