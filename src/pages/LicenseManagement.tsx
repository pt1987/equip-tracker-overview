
import React from "react";
import { KeyRound } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import LicenseManagementTable from "@/components/license-management/LicenseManagementTable";
import { useIsMobile } from "@/hooks/use-mobile";

export default function LicenseManagement() {
  const isMobile = useIsMobile();
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-6">
          <div className={`flex flex-col ${isMobile ? 'gap-4' : 'md:flex-row md:items-center justify-between gap-4'}`}>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <KeyRound className="h-8 w-8" />
                <span>Lizenzmanagement</span>
              </h1>
              <p className="text-muted-foreground">
                Verwaltung und Übersicht von Software-Lizenzen und Abonnements
              </p>
            </div>
          </div>
          
          <div className="shadow-sm border rounded-lg">
            <LicenseManagementTable />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
