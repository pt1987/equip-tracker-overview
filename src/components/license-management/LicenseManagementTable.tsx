
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { LicenseTable } from "./components/LicenseTable";
import { NewLicenseDialog } from "./components/NewLicenseDialog";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { useLicenseManagement } from "./hooks/useLicenseManagement";
import { useIsMobile } from "@/hooks/use-mobile";

export default function LicenseManagementTable() {
  const isMobile = useIsMobile();
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
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between sm:items-center">
        <h2 className="text-xl sm:text-2xl font-bold">Softwarelizenzen</h2>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className={`${isMobile ? 'w-full' : 'flex-shrink-0'} flex items-center gap-2`}
          size={isMobile ? "default" : "default"}
        >
          <PlusCircle className="h-4 w-4" /> 
          <span>Neue Lizenz</span>
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
