
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import Navbar from "@/components/layout/Navbar";
import { getAssetById, getEmployeeById, getAssetHistoryByAssetId } from "@/data/mockData";
import { Asset, AssetHistoryEntry } from "@/lib/types";
import QRCode from "@/components/shared/QRCode";
import StatusBadge from "@/components/assets/StatusBadge";
import { motion } from "framer-motion";
import { formatCurrency, formatDate, calculateAgeInMonths } from "@/lib/utils";
import { ChevronLeft, CalendarClock, Euro, Tag, User, History, ArrowRight } from "lucide-react";

const AssetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [employee, setEmployee] = useState<any>(null);
  const [history, setHistory] = useState<AssetHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      const assetData = getAssetById(id);
      setAsset(assetData || null);
      
      if (assetData?.employeeId) {
        const employeeData = getEmployeeById(assetData.employeeId);
        setEmployee(employeeData || null);
      }
      
      const historyData = getAssetHistoryByAssetId(id);
      setHistory(historyData);
      
      setLoading(false);
    }
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Navbar />
        <div className="flex-1 md:ml-64 p-8 flex items-center justify-center">
          <div className="animate-pulse-soft">Loading asset details...</div>
        </div>
      </div>
    );
  }
  
  if (!asset) {
    return (
      <div className="flex min-h-screen">
        <Navbar />
        <div className="flex-1 md:ml-64 p-8">
          <div className="glass-card p-12 text-center">
            <h2 className="text-xl font-medium mb-4">Asset not found</h2>
            <p className="text-muted-foreground mb-6">
              The asset you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              to="/assets"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Back to assets
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const getAssetTypeLabel = (type: Asset["type"]) => {
    switch (type) {
      case "laptop": return "Laptop";
      case "smartphone": return "Smartphone";
      case "tablet": return "Tablet";
      case "mouse": return "Mouse";
      case "keyboard": return "Keyboard";
      case "accessory": return "Accessory";
      default: return "Other";
    }
  };
  
  const renderAdditionalFields = () => {
    switch (asset.type) {
      case "laptop":
        return (
          <>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Serial Number</p>
              <p className="font-medium">{asset.serialNumber || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Inventory Number</p>
              <p className="font-medium">{asset.inventoryNumber || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Additional Warranty</p>
              <p className="font-medium">{asset.additionalWarranty ? "Yes" : "No"}</p>
            </div>
          </>
        );
      case "smartphone":
        return (
          <>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Serial Number</p>
              <p className="font-medium">{asset.serialNumber || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Inventory Number</p>
              <p className="font-medium">{asset.inventoryNumber || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">IMEI</p>
              <p className="font-medium">{asset.imei || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium">{asset.phoneNumber || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Provider</p>
              <p className="font-medium">{asset.provider || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Contract</p>
              <p className="font-medium">{asset.contractName || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Contract End Date</p>
              <p className="font-medium">
                {asset.contractEndDate ? formatDate(asset.contractEndDate) : "—"}
              </p>
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Inventory Number</p>
              <p className="font-medium">{asset.inventoryNumber || "—"}</p>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen">
      <Navbar />
      
      <div className="flex-1 md:ml-64">
        <PageTransition>
          <div className="p-4 md:p-8 pb-24 max-w-7xl mx-auto mt-12 md:mt-0">
            <div className="mb-6">
              <Link 
                to="/assets"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft size={16} />
                <span>Back to assets</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="glass-card p-6 mb-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3 flex-shrink-0">
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                        {asset.imageUrl ? (
                          <motion.img 
                            src={asset.imageUrl} 
                            alt={asset.name}
                            className="w-full h-full object-cover object-center"
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-muted-foreground">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex justify-center">
                        <StatusBadge status={asset.status} size="lg" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="inline-flex items-center px-2 py-1 mb-2 rounded-full bg-secondary text-xs font-medium">
                        {getAssetTypeLabel(asset.type)}
                      </div>
                      <h1 className="text-2xl font-bold mb-2">{asset.name}</h1>
                      <p className="text-muted-foreground mb-4">
                        {asset.manufacturer} {asset.model}
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-full bg-blue-100">
                            <CalendarClock size={16} className="text-blue-700" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Purchase Date</p>
                            <p className="font-medium">{formatDate(asset.purchaseDate)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-full bg-green-100">
                            <Euro size={16} className="text-green-700" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Purchase Price</p>
                            <p className="font-medium">{formatCurrency(asset.price)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-full bg-purple-100">
                            <Tag size={16} className="text-purple-700" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Vendor</p>
                            <p className="font-medium">{asset.vendor}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-full bg-amber-100">
                            <CalendarClock size={16} className="text-amber-700" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Age</p>
                            <p className="font-medium">{calculateAgeInMonths(asset.purchaseDate)} months</p>
                          </div>
                        </div>
                      </div>
                      
                      {employee && (
                        <div className="frosted-glass rounded-lg p-4">
                          <h3 className="text-sm font-medium mb-3">Assigned to</h3>
                          <Link 
                            to={`/employee/${employee.id}`}
                            className="flex items-center gap-3 group"
                          >
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                              <img 
                                src={employee.imageUrl} 
                                alt={`${employee.firstName} ${employee.lastName}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium group-hover:text-primary transition-colors">
                                {employee.firstName} {employee.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {employee.position} • {employee.cluster}
                              </p>
                            </div>
                            <ArrowRight size={16} className="ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-6 mb-6">
                  <h2 className="text-lg font-semibold mb-4">Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {renderAdditionalFields()}
                  </div>
                </div>
                
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <History size={18} />
                    <h2 className="text-lg font-semibold">History</h2>
                  </div>
                  
                  {history.length > 0 ? (
                    <div className="space-y-4">
                      {history.map((entry, index) => (
                        <motion.div 
                          key={entry.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex gap-4"
                        >
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                              {entry.action === "purchase" && <Euro size={16} />}
                              {entry.action === "assign" && <User size={16} />}
                              {entry.action === "status_change" && <Tag size={16} />}
                              {entry.action === "return" && <ArrowRight size={16} />}
                            </div>
                            {index < history.length - 1 && (
                              <div className="w-0.5 h-full bg-border mt-2"></div>
                            )}
                          </div>
                          
                          <div className="pb-6">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {entry.action === "purchase" && "Purchased"}
                                {entry.action === "assign" && "Assigned"}
                                {entry.action === "status_change" && "Status changed"}
                                {entry.action === "return" && "Returned"}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(entry.date)}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{entry.notes}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      No history available for this asset.
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <div className="glass-card p-6 mb-6">
                  <h2 className="text-lg font-semibold mb-4">Asset QR Code</h2>
                  <div className="flex justify-center">
                    <QRCode 
                      value={window.location.href}
                      size={180}
                      title="Scan to view asset details"
                    />
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Scan this QR code to access asset details quickly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PageTransition>
      </div>
    </div>
  );
};

export default AssetDetail;
