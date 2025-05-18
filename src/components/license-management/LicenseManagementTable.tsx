
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { LicenseTable } from "./components/LicenseTable";
import { NewLicenseDialog } from "./components/NewLicenseDialog";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { useLicenseManagement } from "./hooks/useLicenseManagement";

export default function LicenseManagementTable() {
  const {
    isLoading,
    isError,
    editingLicenses,
    newLicense,
    isDialogOpen,
    setIsDialogOpen,
    handleInputChange,
    handleNewLicenseChange,
    toggleEdit,
    saveLicense,
    deleteLicense,
    createLicense,
    refetchLicenses
  } = useLicenseManagement();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">Fehler beim Laden der Lizenzdaten.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Softwarelizenzen</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Neue Lizenz
        </Button>
      </div>
      
      <div className="border rounded-lg">
        <div className="overflow-x-auto">
          <LicenseTable
            editingLicenses={editingLicenses}
            handleInputChange={handleInputChange}
            toggleEdit={toggleEdit}
            saveLicense={saveLicense}
            deleteLicense={deleteLicense}
            onAssignmentChange={refetchLicenses}
          />
        </div>
      </div>
      
      <NewLicenseDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        newLicense={newLicense}
        handleNewLicenseChange={handleNewLicenseChange}
        createLicense={createLicense}
      />
    </div>
  );
};
