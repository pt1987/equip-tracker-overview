
import { useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import Navbar from "@/components/layout/Navbar";
import StatCard from "@/components/dashboard/StatCard";
import { 
  getDashboardStats, 
} from "@/data/helpers";
import { 
  getAssetTypeDistribution, 
  getAssetStatusDistribution,
  assets
} from "@/data/assets";
import { employees } from "@/data/employees";
import OverviewChart from "@/components/dashboard/OverviewChart";
import { 
  Monitor, 
  Users, 
  CircleDot, 
  AlertTriangle, 
  Euro,
  Package,
  Search,
  SmartphoneIcon,
  TabletIcon,
  MouseIcon,
  KeyboardIcon,
  PackageIcon
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import AssetCard from "@/components/assets/AssetCard";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const stats = getDashboardStats();
  const assetTypeData = getAssetTypeDistribution();
  const assetStatusData = getAssetStatusDistribution();
  
  // Get the 4 most recent assets
  const recentAssets = [...assets]
    .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
    .slice(0, 4);
  
  // Status chart data
  const statusChartData = [
    { name: "In Use", value: assetStatusData.find(item => item.status === "in_use")?.count || 0, color: "#22c55e" },
    { name: "Pool", value: assetStatusData.find(item => item.status === "pool")?.count || 0, color: "#64748b" },
    { name: "Ordered", value: assetStatusData.find(item => item.status === "ordered")?.count || 0, color: "#3b82f6" },
    { name: "Delivered", value: assetStatusData.find(item => item.status === "delivered")?.count || 0, color: "#8b5cf6" },
    { name: "Defective", value: assetStatusData.find(item => item.status === "defective")?.count || 0, color: "#ef4444" },
    { name: "Repair", value: assetStatusData.find(item => item.status === "repair")?.count || 0, color: "#f59e0b" },
  ];
  
  // Type chart data
  const typeChartData = [
    { name: "Laptops", value: assetTypeData.find(item => item.type === "laptop")?.count || 0, color: "#3b82f6" },
    { name: "Smartphones", value: assetTypeData.find(item => item.type === "smartphone")?.count || 0, color: "#8b5cf6" },
    { name: "Tablets", value: assetTypeData.find(item => item.type === "tablet")?.count || 0, color: "#22c55e" },
    { name: "Mice", value: assetTypeData.find(item => item.type === "mouse")?.count || 0, color: "#f59e0b" },
    { name: "Keyboards", value: assetTypeData.find(item => item.type === "keyboard")?.count || 0, color: "#64748b" },
    { name: "Accessories", value: assetTypeData.find(item => item.type === "accessory")?.count || 0, color: "#ec4899" },
  ];
  
  const getIconForType = (type: string) => {
    switch (type) {
      case "Laptops": return <Monitor size={20} />;
      case "Smartphones": return <SmartphoneIcon size={20} />;
      case "Tablets": return <TabletIcon size={20} />;
      case "Mice": return <MouseIcon size={20} />;
      case "Keyboards": return <KeyboardIcon size={20} />;
      default: return <PackageIcon size={20} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Navbar />
      
      <div className="flex-1 md:ml-64">
        <PageTransition>
          <div className="p-4 pt-6 md:p-8 pb-24 max-w-7xl mx-auto space-y-8 mt-12 md:mt-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Overview of all assets and employees
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Link 
                  to="/assets" 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-secondary transition-colors"
                >
                  <Package size={18} />
                  <span>All Assets</span>
                </Link>
                <Link 
                  to="/employees" 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Users size={18} />
                  <span>All Employees</span>
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <StatCard
                title="Total Assets"
                value={stats.totalAssets}
                icon={Package}
                colorClass="text-blue-500"
              />
              <StatCard
                title="Assets in Use"
                value={stats.assignedAssets}
                icon={Monitor}
                colorClass="text-green-500"
              />
              <StatCard
                title="Pool Assets"
                value={stats.poolAssets}
                icon={CircleDot}
                colorClass="text-gray-500"
              />
              <StatCard
                title="Defective/Repair"
                value={stats.defectiveAssets}
                icon={AlertTriangle}
                colorClass="text-amber-500"
              />
              <StatCard
                title="Total Employees"
                value={employees.length}
                icon={Users}
                colorClass="text-purple-500"
              />
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg">Budget Overview</h2>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {formatCurrency(stats.totalBudgetUsed)}
                  </span>
                  {" "}/{" "}
                  {formatCurrency(stats.totalBudget)}
                </div>
              </div>
              
              <div className="budget-progress-track mb-1">
                <motion.div 
                  className="budget-progress-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (stats.totalBudgetUsed / stats.totalBudget) * 100)}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
              
              <div className="text-xs text-muted-foreground">
                {Math.round((stats.totalBudgetUsed / stats.totalBudget) * 100)}% of total budget used
              </div>
              
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {employees.slice(0, 4).map((employee, index) => (
                  <div key={employee.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={employee.imageUrl}
                        alt={`${employee.firstName} ${employee.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <p className="text-sm font-medium truncate">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-xs ml-2 whitespace-nowrap">
                          {formatCurrency(employee.usedBudget)} / {formatCurrency(employee.budget)}
                        </p>
                      </div>
                      <div className="budget-progress-track h-1.5 mb-0">
                        <motion.div 
                          className="budget-progress-bar"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (employee.usedBudget / employee.budget) * 100)}%` }}
                          transition={{ duration: 1, delay: 0.3 + (index * 0.1) }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {employees.length > 4 && (
                <div className="mt-4 text-center">
                  <Link 
                    to="/employees"
                    className="text-sm text-primary hover:underline"
                  >
                    View all employees
                  </Link>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <OverviewChart 
                data={statusChartData} 
                title="Assets by Status" 
              />
              <OverviewChart 
                data={typeChartData} 
                title="Assets by Type" 
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg">Recent Purchases</h2>
                <Link 
                  to="/assets" 
                  className="text-sm text-primary hover:underline"
                >
                  View all assets
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentAssets.map((asset, index) => (
                  <AssetCard 
                    key={asset.id} 
                    asset={asset} 
                    index={index} 
                  />
                ))}
              </div>
            </div>
          </div>
        </PageTransition>
      </div>
    </div>
  );
};

export default Dashboard;
