import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployeeById } from "@/data/employees/fetch";
import { updateEmployee } from "@/data/employees/update";
import { getAssetsByEmployeeId } from "@/data/assets/fetch";
import { Employee, Asset } from "@/lib/types";
import { competenceLevels } from "@/components/employees/EmployeeFormTypes";
import { toast } from "@/hooks/use-toast";

export function useEmployeeDetail(id: string | undefined) {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchEmployeeData = async () => {
    if (!id) return;
    
    setLoading(true);
    const employeeData = await getEmployeeById(id);
    
    if (employeeData) {
      console.log("Fetched employee data:", employeeData);
      setEmployee(employeeData);
      const employeeAssets = await getAssetsByEmployeeId(employeeData.id);
      setAssets(employeeAssets);
    } else {
      setEmployee(null);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      fetchEmployeeData();
    }
  }, [id]);
  
  const handleSave = async (data: any) => {
    console.log("Saving employee with data:", data);
    
    if (employee && id) {
      try {
        console.log("Saving employee with email:", data.email);
        
        // Validate competence level
        const validCompetenceLevel = data.competenceLevel && 
          competenceLevels.includes(data.competenceLevel as any) 
            ? data.competenceLevel 
            : "Junior";
        
        // Save to database - ensure email is included
        const success = await updateEmployee(id, {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email, // Explicitly include email
          position: data.position,
          cluster: data.cluster,
          competence_level: validCompetenceLevel,
          start_date: data.entryDate || data.startDate,
          budget: data.budget,
          image_url: data.imageUrl || data.profileImage,
          profile_image: data.imageUrl || data.profileImage
        });
        
        if (!success) {
          throw new Error("Failed to update employee");
        }
        
        // Reload employee data to ensure we have the latest
        fetchEmployeeData();
      } catch (error) {
        console.error("Error updating employee:", error);
        throw error;
      }
    }
  };
  
  const handleDelete = () => {
    console.log("Delete employee:", id);
    
    toast({
      title: "Mitarbeiter gelöscht",
      description: "Der Mitarbeiter wurde erfolgreich gelöscht."
    });
    
    navigate("/employees");
  };

  return {
    employee,
    assets,
    loading,
    fetchEmployeeData,
    handleSave,
    handleDelete
  };
}
