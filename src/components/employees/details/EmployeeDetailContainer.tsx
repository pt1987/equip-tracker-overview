
import { useState } from "react";
import { Employee, Asset } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import EmployeeDetailView from "@/components/employees/EmployeeDetailView";
import EmployeeDetailEdit from "@/components/employees/EmployeeDetailEdit";
import AssetSection from "@/components/employees/details/AssetSection";

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
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const handleSave = async (data: any) => {
    try {
      // The actual save logic is handled in the parent component
      // We just need to call the callback here
      onEmployeeUpdated();
      
      toast({
        title: "Mitarbeiter aktualisiert",
        description: "Die Änderungen wurden erfolgreich gespeichert."
      });
    } catch (error) {
      console.error("Error in handleSave:", error);
      toast({
        variant: "destructive",
        title: "Fehler beim Speichern",
        description: "Die Änderungen konnten nicht gespeichert werden."
      });
    }
    
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    // This will be handled by the parent component
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="glass-card p-4 sm:p-6 mb-6">
          {isEditing ? (
            <EmployeeDetailEdit 
              employee={employee} 
              onSave={handleSave} 
              onCancel={handleCancel} 
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
        
        <AssetSection assets={assets} />
      </div>
    </div>
  );
}
