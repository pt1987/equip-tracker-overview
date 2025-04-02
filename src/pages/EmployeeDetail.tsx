
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import Navbar from "@/components/layout/Navbar";
import { getEmployeeById } from "@/data/employees";
import { getAssetsByEmployeeId } from "@/data/assets";
import { Asset, Employee } from "@/lib/types";
import QRCode from "@/components/shared/QRCode";
import { motion } from "framer-motion";
import { formatCurrency, formatDate, calculateEmploymentDuration } from "@/lib/utils";
import AssetCard from "@/components/assets/AssetCard";
import ViewToggle from "@/components/shared/ViewToggle";
import { 
  ChevronLeft, 
  CalendarClock, 
  Euro, 
  LaptopIcon,
  SmartphoneIcon,
  TabletIcon,
  MouseIcon,
  KeyboardIcon,
  PackageIcon,
  Briefcase,
  User,
  Users,
  ArrowRight
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import EmployeeDetailView from "@/components/employees/EmployeeDetailView";
import EmployeeDetailEdit from "@/components/employees/EmployeeDetailEdit";

const AssetTypeIcon = ({ type }: { type: Asset["type"] }) => {
  switch (type) {
    case "laptop":
      return <LaptopIcon size={18} className="text-blue-600" />;
    case "smartphone":
      return <SmartphoneIcon size={18} className="text-purple-600" />;
    case "tablet":
      return <TabletIcon size={18} className="text-green-600" />;
    case "mouse":
      return <MouseIcon size={18} className="text-amber-600" />;
    case "keyboard":
      return <KeyboardIcon size={18} className="text-gray-600" />;
    case "accessory":
      return <PackageIcon size={18} className="text-pink-600" />;
    default:
      return <PackageIcon size={18} />;
  }
};

const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [assetView, setAssetView] = useState<"grid" | "list">("grid");
  
  useEffect(() => {
    if (id) {
      const employeeData = getEmployeeById(id);
      setEmployee(employeeData || null);
      
      if (employeeData) {
        const employeeAssets = getAssetsByEmployeeId(employeeData.id);
        setAssets(employeeAssets);
      }
      
      setLoading(false);
    }
  }, [id]);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const handleSave = (data: any) => {
    // In a real app, this would update the data in the API
    console.log("Updated employee data:", data);
    
    // Update local state
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
    // In a real app, this would delete the data from the API
    console.log("Delete employee:", id);
    
    toast({
      title: "Mitarbeiter gelöscht",
      description: "Der Mitarbeiter wurde erfolgreich gelöscht."
    });
    
    // Navigate back to employees list
    navigate("/employees");
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Navbar />
        <div className="flex-1 md:ml-64 p-8 flex items-center justify-center">
          <div className="animate-pulse-soft">Loading employee details...</div>
        </div>
      </div>
    );
  }
  
  if (!employee) {
    return (
      <div className="flex min-h-screen">
        <Navbar />
        <div className="flex-1 md:ml-64 p-4 md:p-8">
          <div className="glass-card p-12 text-center">
            <h2 className="text-xl font-medium mb-4">Employee not found</h2>
            <p className="text-muted-foreground mb-6">
              The employee you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              to="/employees"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Back to employees
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Group assets by type
  const assetsByType: Record<string, Asset[]> = {};
  assets.forEach(asset => {
    if (!assetsByType[asset.type]) {
      assetsByType[asset.type] = [];
    }
    assetsByType[asset.type].push(asset);
  });
  
  // Calculate budget usage
  const budgetPercentage = Math.min(100, Math.round((employee.usedBudget / employee.budget) * 100));

  return (
    <div className="flex min-h-screen">
      <Navbar />
      
      <div className="flex-1 md:ml-32">
        <PageTransition>
          <div className="p-4 md:p-8 pb-24 max-w-7xl mx-auto mt-12 md:mt-0">
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
                
                <div className="glass-card p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Euro size={18} />
                    <h2 className="text-lg font-semibold">Budget</h2>
                  </div>
                  
                  <div className="text-sm font-medium mb-2 flex justify-between">
                    <span>Budget usage</span>
                    <span>{budgetPercentage}%</span>
                  </div>
                  
                  <div className="budget-progress-track">
                    <motion.div 
                      className="budget-progress-bar"
                      initial={{ width: 0 }}
                      animate={{ width: `${budgetPercentage}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>{formatCurrency(employee.usedBudget)} used</span>
                    <span>{formatCurrency(employee.budget)} total</span>
                  </div>
                  
                  <div className="mt-6 p-4 rounded-lg bg-secondary/50">
                    <p className="text-sm">
                      Remaining budget: <span className="font-medium">{formatCurrency(employee.budget - employee.usedBudget)}</span>
                    </p>
                  </div>
                </div>
                
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <div className="flex items-center gap-2">
                      <PackageIcon size={18} />
                      <h2 className="text-lg font-semibold">Assets</h2>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium hidden md:block">
                        Total value: <span className="text-primary">{formatCurrency(assets.reduce((sum, asset) => sum + asset.price, 0))}</span>
                      </div>
                      <ViewToggle view={assetView} onViewChange={setAssetView} />
                    </div>
                  </div>
                  
                  {assets.length > 0 ? (
                    <div className="space-y-6">
                      {Object.entries(assetsByType).map(([type, typeAssets]) => (
                        <div key={type}>
                          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                            <AssetTypeIcon type={type as Asset["type"]} />
                            <h3 className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}s</h3>
                            <span className="ml-2 text-sm text-muted-foreground">
                              ({typeAssets.length})
                            </span>
                          </div>
                          
                          {assetView === "grid" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {typeAssets.map((asset, index) => (
                                <AssetCard 
                                  key={asset.id} 
                                  asset={asset} 
                                  index={index} 
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {typeAssets.map((asset) => (
                                <Link
                                  key={asset.id}
                                  to={`/asset/${asset.id}`}
                                  className="block w-full p-3 rounded-lg border border-border hover:bg-secondary/10 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                      {asset.imageUrl ? (
                                        <img
                                          src={asset.imageUrl}
                                          alt={asset.name}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <AssetTypeIcon type={asset.type} />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium truncate">{asset.name}</h4>
                                      <p className="text-sm text-muted-foreground truncate">
                                        {asset.manufacturer} {asset.model}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">{formatCurrency(asset.price)}</p>
                                      <p className="text-xs text-muted-foreground">{new Date(asset.purchaseDate).toLocaleDateString()}</p>
                                    </div>
                                    <ArrowRight size={16} className="text-muted-foreground ml-2" />
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                        <PackageIcon size={24} className="text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No assets assigned</h3>
                      <p className="text-muted-foreground">
                        This employee doesn't have any assets assigned yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <div className="glass-card p-6 mb-6">
                  <h2 className="text-lg font-semibold mb-4">Employee QR Code</h2>
                  <div className="flex justify-center">
                    <QRCode 
                      value={window.location.href}
                      size={180}
                      title="Scan to view employee details"
                    />
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Scan this QR code to access employee details quickly
                  </p>
                </div>
                
                <div className="glass-card p-6">
                  <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-blue-100">
                          <LaptopIcon size={16} className="text-blue-700" />
                        </div>
                        <span className="text-sm">Laptops</span>
                      </div>
                      <span className="font-medium text-sm">
                        {assetsByType["laptop"]?.length || 0}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-purple-100">
                          <SmartphoneIcon size={16} className="text-purple-700" />
                        </div>
                        <span className="text-sm">Smartphones</span>
                      </div>
                      <span className="font-medium text-sm">
                        {assetsByType["smartphone"]?.length || 0}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-green-100">
                          <TabletIcon size={16} className="text-green-700" />
                        </div>
                        <span className="text-sm">Tablets</span>
                      </div>
                      <span className="font-medium text-sm">
                        {assetsByType["tablet"]?.length || 0}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-amber-100">
                          <MouseIcon size={16} className="text-amber-700" />
                        </div>
                        <span className="text-sm">Mice</span>
                      </div>
                      <span className="font-medium text-sm">
                        {assetsByType["mouse"]?.length || 0}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-gray-100">
                          <KeyboardIcon size={16} className="text-gray-700" />
                        </div>
                        <span className="text-sm">Keyboards</span>
                      </div>
                      <span className="font-medium text-sm">
                        {assetsByType["keyboard"]?.length || 0}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-pink-100">
                          <PackageIcon size={16} className="text-pink-700" />
                        </div>
                        <span className="text-sm">Accessories</span>
                      </div>
                      <span className="font-medium text-sm">
                        {assetsByType["accessory"]?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageTransition>
      </div>
    </div>
  );
};

export default EmployeeDetail;
