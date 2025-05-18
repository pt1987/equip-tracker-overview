
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface LicenseData {
  id: string;
  name: string;
  license_type: string;
  expiry_date: string | null;
  total_licenses: number;
  assigned_count: number;
  cost_per_license: number;
  status: string;
}

interface NewLicenseDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  newLicense: Partial<LicenseData>;
  handleNewLicenseChange: (e: React.ChangeEvent<HTMLInputElement>, field: keyof LicenseData) => void;
  createLicense: () => Promise<void>;
}

export const NewLicenseDialog = ({
  isOpen,
  setIsOpen,
  newLicense,
  handleNewLicenseChange,
  createLicense,
}: NewLicenseDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neue Lizenz erstellen</DialogTitle>
          <DialogDescription>
            Fügen Sie eine neue Softwarelizenz zum Bestand hinzu.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right">Name</label>
            <Input
              id="name"
              value={newLicense.name || ''}
              onChange={(e) => handleNewLicenseChange(e, 'name')}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="license_type" className="text-right">Lizenztyp</label>
            <Input
              id="license_type"
              value={newLicense.license_type || ''}
              onChange={(e) => handleNewLicenseChange(e, 'license_type')}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="expiry_date" className="text-right">Ablaufdatum</label>
            <Input
              id="expiry_date"
              type="date"
              onChange={(e) => handleNewLicenseChange(e, 'expiry_date')}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="total_licenses" className="text-right">Anzahl</label>
            <Input
              id="total_licenses"
              type="number"
              value={newLicense.total_licenses || 0}
              onChange={(e) => handleNewLicenseChange(e, 'total_licenses')}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="assigned_count" className="text-right">Zugewiesen</label>
            <Input
              id="assigned_count"
              type="number"
              value={newLicense.assigned_count || 0}
              onChange={(e) => handleNewLicenseChange(e, 'assigned_count')}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="cost_per_license" className="text-right">Kosten/Lizenz</label>
            <Input
              id="cost_per_license"
              type="number"
              value={newLicense.cost_per_license || 0}
              onChange={(e) => handleNewLicenseChange(e, 'cost_per_license')}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Abbrechen</Button>
          <Button onClick={createLicense}>Erstellen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
