import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import { getEmployeeById } from "@/data/employees";
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
      const fetchData = async () => {
        const employeeData = await getEmployeeById(id);
        setEmployee(employeeData);
        
        if (employeeData) {
          const employeeAssets = await getAssetsByEmployeeId(employeeData.id);
          setAssets(employeeAssets);
        }
        
        setLoading(false);
      };
      
      fetchData();
    }
  }, [id]);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const handleSave = (data: any) => {
    console.log("Updated employee data:", data);
    
    if (employee) {
      const updatedEmployee = {
        ...employee,
        ...data,
        startDate: data.startDate.toISOString(),
      };
      setEmployee(updatedEmployee);
    }
    
    setIsEditing(false);
    
    toast({
      title: "Mitarbeiter aktualisiert",
      description: "Die Änderungen wurden erfolgreich gespeichert."
    });
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
