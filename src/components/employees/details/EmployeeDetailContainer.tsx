import { useState } from "react";
import { Employee, Asset } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import EmployeeDetailView from "@/components/employees/EmployeeDetailView";
import EmployeeDetailEdit from "@/components/employees/EmployeeDetailEdit";
import AssetSection from "@/components/employees/details/AssetSection";
import LicenseSection from "@/components/employees/details/LicenseSection";
import { updateEmployee } from "@/data/employees";
import { useLicenseData } from "./useLicenseData";

interface EmployeeDetailContainerProps {
  employee: Employee;
  assets: Asset[];
  onEmployeeUpdated: () => void;
}

export default function EmployeeDetailContainer({ 
  employee, 
  assets, 
  onEmployeeUpdated 
}: EmployeeDetailContainerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch license data for this employee
  const { licenses, isLoadingLicenses } = useLicenseData(employee.id);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const handleSave = async (data: any) => {
    try {
      setIsSaving(true);
      
      // Directly save the employee data using the updateEmployee function
      if (employee.id) {
        const success = await updateEmployee(employee.id, {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email || "",
          position: data.position,
          cluster: data.cluster,
          competence_level: data.competenceLevel,
          start_date: new Date(data.entryDate || data.startDate).toISOString().split('T')[0],
          budget: data.budget,
          image_url: data.imageUrl || data.profileImage
        });
        
        if (!success) {
          throw new Error("Failed to update employee");
        }
      }
      
      // Call the callback to refresh data
      onEmployeeUpdated();
      
      toast({
        title: "Mitarbeiter aktualisiert",
        description: "Die Änderungen wurden erfolgreich gespeichert."
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error in handleSave:", error);
      toast({
        variant: "destructive",
        title: "Fehler beim Speichern",
        description: "Die Änderungen konnten nicht gespeichert werden."
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = () => {
    // This will be handled by the parent component
  };

  return (
    <div className="space-y-3" id="employee-detail-container">
      <div>
        <div className="glass-card p-3 sm:p-4 mb-3">
          {isEditing ? (
            <EmployeeDetailEdit 
              employee={employee} 
              onSave={handleSave} 
              onCancel={handleCancel}
              isSaving={isSaving}
            />
          ) : (
            <EmployeeDetailView 
              employee={employee} 
              assets={assets} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          )}
        </div>
        
        {/* Add License Section before Asset Section */}
        <LicenseSection 
          licenses={licenses} 
          isLoading={isLoadingLicenses} 
        />
        
        <AssetSection assets={assets} />
      </div>
    </div>
  );
}
