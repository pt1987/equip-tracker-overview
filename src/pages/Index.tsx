
import { useState, useEffect } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import PageTransition from "@/components/layout/PageTransition";
import { Card, CardContent } from "@/components/ui/card";
import OverviewChart from "@/components/dashboard/OverviewChart";
import StatCard from "@/components/dashboard/StatCard";
import AssetCard from "@/components/assets/AssetCard";
import EmployeeCard from "@/components/employees/EmployeeCard";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  CreditCard, 
  Package2, 
  Users, 
  Monitor, 
  SmartphoneIcon, 
  TabletIcon, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Asset, Employee } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import StatusBadge from "@/components/assets/StatusBadge";
import { getAssets } from "@/services/assetService";
import { getEmployees } from "@/services/employeeService";

const TopEmployees = ({ employees }: { employees: Employee[] }) => {
  const navigate = useNavigate();
  
  if (!employees || employees.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No employees found</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Top Employees</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/employees')}>
            View all
            <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>
        <div className="space-y-4">
          {employees.slice(0, 4).map((employee, i) => (
            <Link 
              key={employee.id}
              to={`/employee/${employee.id}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
                {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                <p className="text-sm text-muted-foreground">{employee.position}</p>
              </div>
              <div className="ml-auto text-sm">
                <p className="font-medium">{formatCurrency(employee.budget)}</p>
                <p className="text-xs text-muted-foreground">Budget</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const RecentAssets = ({ assets }: { assets: Asset[] }) => {
  const navigate = useNavigate();
  
  if (!assets || assets.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No assets found</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Recent Assets</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/assets')}>
            View all
            <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>
        <div className="space-y-3">
          {assets.slice(0, 5).map((asset, i) => (
            <Link 
              key={asset.id}
              to={`/asset/${asset.id}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                {asset.type === 'laptop' && <Monitor size={20} />}
                {asset.type === 'smartphone' && <SmartphoneIcon size={20} />}
                {asset.type === 'tablet' && <TabletIcon size={20} />}
              </div>
              <div className="flex-1">
                <p className="font-medium">{asset.name}</p>
                <p className="text-sm text-muted-foreground">{asset.manufacturer} {asset.model}</p>
              </div>
              <StatusBadge status={asset.status} />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

function PendingActions() {
  // This is just a placeholder - you can implement this with real data later
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Pending Actions</h3>
        <div className="space-y-3">
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/50 rounded-lg border border-yellow-200 dark:border-yellow-900/50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 dark:text-yellow-400 mt-0.5" size={18} />
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-300">3 warranties expire next month</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">Review and extend if needed</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Review
              </Button>
            </div>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-900/50">
            <div className="flex items-start gap-3">
              <Package2 className="text-blue-600 dark:text-blue-400 mt-0.5" size={18} />
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-300">5 assets in transit</p>
                <p className="text-sm text-blue-700 dark:text-blue-400">Expected delivery this week</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Track
              </Button>
            </div>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-900/50">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-green-600 dark:text-green-400 mt-0.5" size={18} />
              <div>
                <p className="font-medium text-green-800 dark:text-green-300">8 onboarding forms pending</p>
                <p className="text-sm text-green-700 dark:text-green-400">Need your approval</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Review
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  // Fetch data from Supabase using React Query
  const { data: assets, isLoading: assetsLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets
  });
  
  const { data: employees, isLoading: employeesLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees
  });
  
  // Calculate stats once we have data
  const stats = {
    totalAssets: assets?.length || 0,
    totalEmployees: employees?.length || 0,
    totalValue: assets?.reduce((sum, asset) => sum + asset.price, 0) || 0,
    assetTypes: {
      laptop: assets?.filter(a => a.type === 'laptop').length || 0,
      smartphone: assets?.filter(a => a.type === 'smartphone').length || 0,
      tablet: assets?.filter(a => a.type === 'tablet').length || 0,
      other: assets?.filter(a => !['laptop', 'smartphone', 'tablet'].includes(a.type)).length || 0
    }
  };
  
  // Sort recent assets by purchase date
  const recentAssets = assets ? 
    [...assets].sort((a, b) => {
      const dateA = new Date(a.purchaseDate).getTime();
      const dateB = new Date(b.purchaseDate).getTime();
      return dateB - dateA;  // Sort descending (newest first)
    }) : [];
  
  // Sort employees by budget utilization
  const topEmployees = employees ?
    [...employees].sort((a, b) => {
      const percentA = a.budget > 0 ? (a.usedBudget / a.budget) : 0;
      const percentB = b.budget > 0 ? (b.usedBudget / b.budget) : 0;
      return percentB - percentA;  // Sort descending (highest utilization first)
    }) : [];

  return (
    <PageTransition>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your assets and employees
          </p>
        </div>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Assets"
            value={stats.totalAssets.toString()}
            description="All assets in inventory"
            icon={<Package2 />}
            loading={assetsLoading}
          />
          <StatCard 
            title="Total Value"
            value={formatCurrency(stats.totalValue)}
            description="Value of all assets"
            icon={<CreditCard />}
            loading={assetsLoading}
          />
          <StatCard 
            title="Employees"
            value={stats.totalEmployees.toString()}
            description="Active employees"
            icon={<Users />}
            loading={employeesLoading}
          />
          <StatCard 
            title="Avg. per Employee"
            value={stats.totalEmployees > 0 
              ? formatCurrency(stats.totalValue / stats.totalEmployees) 
              : formatCurrency(0)}
            description="Average asset value"
            icon={<Calendar />}
            loading={assetsLoading || employeesLoading}
          />
        </div>
        
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Asset Distribution</h3>
              {assetsLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <OverviewChart 
                  data={[
                    { name: "Laptops", value: stats.assetTypes.laptop },
                    { name: "Smartphones", value: stats.assetTypes.smartphone },
                    { name: "Tablets", value: stats.assetTypes.tablet },
                    { name: "Other", value: stats.assetTypes.other },
                  ]} 
                />
              )}
            </CardContent>
          </Card>
          <PendingActions />
        </div>
        
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <RecentAssets assets={recentAssets} />
          <TopEmployees employees={topEmployees} />
        </div>
      </div>
    </PageTransition>
  );
}
