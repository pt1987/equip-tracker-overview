
import React from "react";
import PageTransition from "@/components/layout/PageTransition";
import IntuneIntegration from "@/components/admin/IntuneIntegration";

export default function IntuneAdminPage() {
  return (
    <PageTransition>
      <div className="flex flex-col gap-8 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Microsoft Intune Integration</h1>
          <p className="text-muted-foreground">
            Verbinden Sie Asset Tracker mit Ihrer Microsoft Intune-Umgebung
          </p>
        </div>
        
        <div className="grid gap-6">
          <IntuneIntegration />
          
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">Sicherheitshinweise</h3>
            <ul className="list-disc pl-5 space-y-2 text-blue-700 dark:text-blue-300">
              <li>
                Das Client Secret sollte im produktiven Einsatz nicht im Frontend gespeichert werden.
              </li>
              <li>
                Erstellen Sie einen dedizierten Service Principal mit minimalen Berechtigungen für die Integration.
              </li>
              <li>
                Aktivieren Sie die Conditional Access Policies, um den Zugriff auf die API zu beschränken.
              </li>
              <li>
                Überwachen Sie die API-Nutzung regelmäßig in Azure AD.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
