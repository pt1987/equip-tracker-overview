
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import { getEmployeeById, updateEmployee } from "@/data/employees";
import { getAssetsByEmployeeId } from "@/data/assets";
import { Asset, Employee } from "@/lib/types";
import { ChevronLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import EmployeeDetailView from "@/components/employees/EmployeeDetailView";
import EmployeeDetailEdit from "@/components/employees/EmployeeDetailEdit";
import AssetSection from "@/components/employees/details/AssetSection";
import BudgetSection from "@/components/employees/details/BudgetSection";
import QuickStatsSection from "@/components/employees/details/QuickStatsSection";
import { EmployeeDetailLoading, EmployeeNotFound } from "@/components/employees/details/EmployeeLoadingState";

const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchEmployeeData();
    }
  }, [id]);
  
  const fetchEmployeeData = async () => {
    if (!id) return;
    
    setLoading(true);
    const employeeData = await getEmployeeById(id);
    
    if (employeeData) {
      setEmployee(employeeData);
      const employeeAssets = await getAssetsByEmployeeId(employeeData.id);
      setAssets(employeeAssets);
    } else {
      setEmployee(null);
    }
    
    setLoading(false);
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const handleSave = async (data: any) => {
    console.log("Updated employee data:", data);
    
    if (employee && id) {
      try {
        // Save to database - make sure to include the email
        const success = await updateEmployee(id, {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email, // Ensure email is passed to updateEmployee
          position: data.position,
          cluster: data.cluster,
          start_date: data.entryDate || data.startDate,
          budget: data.budget,
          image_url: data.imageUrl || data.profileImage,
          profile_image: data.imageUrl || data.profileImage
        });
        
        if (!success) {
          throw new Error("Failed to update employee");
        }
        
        // Update the employee state with the new data, including email
        const updatedEmployee = {
          ...employee,
          ...data,
          email: data.email, // Explicitly include email in the updated employee state
          startDate: typeof data.startDate === 'object' ? data.startDate.toISOString() : data.startDate,
          imageUrl: data.imageUrl || data.profileImage,
        };
        
        setEmployee(updatedEmployee);
        
        toast({
          title: "Mitarbeiter aktualisiert",
          description: "Die Änderungen wurden erfolgreich gespeichert."
        });
        
        // Reload employee data to ensure we have the latest
        fetchEmployeeData();
      } catch (error) {
        console.error("Error updating employee:", error);
        toast({
          variant: "destructive",
          title: "Fehler beim Speichern",
          description: "Die Änderungen konnten nicht gespeichert werden."
        });
      }
    }
    
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    console.log("Delete employee:", id);
    
    toast({
      title: "Mitarbeiter gelöscht",
      description: "Der Mitarbeiter wurde erfolgreich gelöscht."
    });
    
    navigate("/employees");
  };
  
  if (loading) {
    return <EmployeeDetailLoading />;
  }
  
  if (!employee) {
    return <EmployeeNotFound />;
  }
  
  const assetsByType: Record<string, Asset[]> = {};
  assets.forEach(asset => {
    if (!assetsByType[asset.type]) {
      assetsByType[asset.type] = [];
    }
    assetsByType[asset.type].push(asset);
  });

  return (
    <PageTransition>
      <div className="p-3 md:p-4 xl:p-6 space-y-6 max-w-full pb-24 mt-12 md:mt-0">
        <div className="mb-6">
          <Link 
            to="/employees"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Back to employees</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="glass-card p-6 mb-6">
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
            
            <BudgetSection 
              budget={employee.budget} 
              usedBudget={employee.usedBudget} 
            />
            
            <AssetSection assets={assets} />
          </div>
          
          <div>
            <QuickStatsSection 
              assetsByType={assetsByType}
              currentUrl={window.location.href}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default EmployeeDetail;
