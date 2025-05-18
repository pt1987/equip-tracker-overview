
import React from "react";
import { KeyRound } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import LicenseManagementTable from "@/components/license-management/LicenseManagementTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
          
          <Card className="shadow-sm border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Software-Lizenzverwaltung</CardTitle>
                  <CardDescription>Erstellen und Verwalten Sie Software-Lizenzen für Ihr Unternehmen</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <LicenseManagementTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
