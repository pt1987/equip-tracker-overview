
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ComplianceBadge } from "./ComplianceBadge";
import { Plus, Users } from "lucide-react";
import { LicenseAssignmentDialog } from "./LicenseAssignmentDialog";
import { LicenseAssignmentList } from "./LicenseAssignmentList";

interface License {
  id: string;
  name: string;
  license_type: string;
  expiry_date: string | null;
  total_licenses: number;
  assigned_count: number;
  cost_per_license: number;
  status: string;
}

interface LicenseDetailsDialogProps {
  license: License;
  onAssignmentChange: () => void;
}

export const LicenseDetailsDialog = ({ license, onAssignmentChange }: LicenseDetailsDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);

  return (
    <>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
          <Users className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Lizenzdetails: {license.name}</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="assignments">Zuweisungen</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lizenzinformationen</CardTitle>
                  <CardDescription>Details zur Software-Lizenz</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Name</p>
                      <p>{license.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Lizenztyp</p>
                      <p>{license.license_type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Ablaufdatum</p>
                      <p>{license.expiry_date ? formatDate(license.expiry_date) : '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <ComplianceBadge status={license.status} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Lizenznutzung</CardTitle>
                  <CardDescription>Übersicht zur aktuellen Nutzung</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gesamtlizenzen</p>
                      <p>{license.total_licenses}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Zugewiesene Lizenzen</p>
                      <p>{license.assigned_count}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Kosten pro Lizenz</p>
                      <p>{formatCurrency(license.cost_per_license)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gesamtkosten</p>
                      <p>{formatCurrency(license.cost_per_license * license.total_licenses)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="assignments">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Lizenzzuweisungen</CardTitle>
                    <CardDescription>Übersicht über zugewiesene Lizenzen an Mitarbeiter</CardDescription>
                  </div>
                  <Button 
                    onClick={() => setIsAssignmentDialogOpen(true)}
                    disabled={license.assigned_count >= license.total_licenses}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Zuweisen
                  </Button>
                </CardHeader>
                <CardContent>
                  <LicenseAssignmentList 
                    licenseId={license.id} 
                    onAssignmentRemoved={onAssignmentChange} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      <LicenseAssignmentDialog
        licenseId={license.id}
        licenseName={license.name}
        isOpen={isAssignmentDialogOpen}
        setIsOpen={setIsAssignmentDialogOpen}
        onAssignmentComplete={onAssignmentChange}
        currentAssignedCount={license.assigned_count}
        totalLicenses={license.total_licenses}
      />
    </>
  );
};
