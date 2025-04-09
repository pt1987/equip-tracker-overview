
import { useEffect, useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import { DashboardStats, AssetTypeDistribution, AssetStatusDistribution, Asset, AssetType, AssetStatus } from "@/lib/types";
import { getDashboardStats } from "@/data/helpers";
import { getAssets } from "@/data/assets";
import { getEmployees } from "@/data/employees";
import StatCard from "@/components/dashboard/StatCard";
import { 
  BarChart, 
  Package, 
  Users, 
  AlertTriangle, 
  Coins,
  Calendar,
  UserPlus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "@/components/assets/StatusBadge";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

const getAssetTypeDistribution = async () => {
  const assets = await getAssets();
  const typeCount: Record<string, number> = {};
  
  assets.forEach(asset => {
    if (!typeCount[asset.type]) {
      typeCount[asset.type] = 0;
    }
    typeCount[asset.type]++;
  });
  
  return Object.entries(typeCount).map(([type, count]) => ({
    type: type as AssetType,
    count
  }));
};

const getAssetStatusDistribution = async () => {
  const assets = await getAssets();
  const statusCount: Record<string, number> = {};
  
  assets.forEach(asset => {
    if (!statusCount[asset.status]) {
      statusCount[asset.status] = 0;
    }
    statusCount[asset.status]++;
  });
  
  return Object.entries(statusCount).map(([status, count]) => ({
    status: status as AssetStatus,
    count
  }));
};

const getRecentAssets = async (limit = 5) => {
  const assets = await getAssets();
  return assets
    .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
    .slice(0, limit);
};

const getRecentEmployees = async (limit = 5) => {
  const employees = await getEmployees();
  return employees
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, limit);
};

const IndexPage = () => {
  const [loading, setLoading] = useState(true);

  const { data: dashboardStats = {
    totalAssets: 0,
    assignedAssets: 0,
    poolAssets: 0,
    defectiveAssets: 0,
    totalBudget: 0,
    totalBudgetUsed: 0
  }} = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats
  });

  const { data: assetTypeDistribution = [] } = useQuery({
    queryKey: ["assetTypeDistribution"],
    queryFn: getAssetTypeDistribution
  });

  const { data: assetStatusDistribution = [] } = useQuery({
    queryKey: ["assetStatusDistribution"],
    queryFn: getAssetStatusDistribution
  });

  const { data: recentAssets = [] } = useQuery({
    queryKey: ["recentAssets"],
    queryFn: () => getRecentAssets(5)
  });

  const { data: recentEmployees = [] } = useQuery({
    queryKey: ["recentEmployees"],
    queryFn: () => getRecentEmployees(5)
  });

  useEffect(() => {
    if (dashboardStats && assetTypeDistribution && assetStatusDistribution) {
      setLoading(false);
    }
  }, [dashboardStats, assetTypeDistribution, assetStatusDistribution]);

  const budgetUsagePercentage = dashboardStats.totalBudget > 0 
    ? Math.round((dashboardStats.totalBudgetUsed / dashboardStats.totalBudget) * 100) 
    : 0;

  if (loading) {
    return (
      <PageTransition>
        <div className="flex flex-col gap-4 p-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="text-muted-foreground">Loading dashboard data...</div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Willkommen zurück! Hier ist ein Überblick über Ihr Asset Management System.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Gesamt Assets"
            value={dashboardStats.totalAssets}
            icon={Package}
            colorClass="text-blue-500"
          />
          <StatCard
            title="Zugewiesene Assets"
            value={dashboardStats.assignedAssets}
            icon={Users}
            colorClass="text-green-500"
            description={dashboardStats.totalAssets > 0 
              ? `${Math.round((dashboardStats.assignedAssets / dashboardStats.totalAssets) * 100)}% aller Assets`
              : "Keine Assets vorhanden"}
          />
          <StatCard
            title="Pool Assets"
            value={dashboardStats.poolAssets}
            icon={Coins}
            colorClass="text-amber-500"
          />
          <StatCard
            title="Defekte Assets"
            value={dashboardStats.defectiveAssets}
            icon={AlertTriangle}
            colorClass="text-red-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-1"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Budget Nutzung</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Gesamt Budget</p>
                      <p className="text-2xl font-bold">{dashboardStats.totalBudget.toLocaleString()} €</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Genutzt</p>
                      <p className="text-2xl font-bold">{dashboardStats.totalBudgetUsed.toLocaleString()} €</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Fortschritt</span>
                      <span className={cn(
                        budgetUsagePercentage > 90 ? "text-red-500" : 
                        budgetUsagePercentage > 75 ? "text-amber-500" : 
                        "text-green-500"
                      )}>
                        {budgetUsagePercentage}%
                      </span>
                    </div>
                    <Progress value={budgetUsagePercentage} 
                      className={cn(
                        "h-2",
                        budgetUsagePercentage > 90 ? "text-red-500" : 
                        budgetUsagePercentage > 75 ? "text-amber-500" : 
                        "text-green-500"
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-1"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Asset Typen Verteilung</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assetTypeDistribution.map((item, index) => (
                    <div key={item.type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.type}</span>
                        <span className="text-sm text-muted-foreground">{item.count} Assets</span>
                      </div>
                      <Progress 
                        value={(item.count / assetTypeDistribution.reduce((acc, curr) => acc + curr.count, 0)) * 100} 
                        className={cn(
                          "h-2",
                          index % 5 === 0 ? "bg-blue-100" :
                          index % 5 === 1 ? "bg-green-100" :
                          index % 5 === 2 ? "bg-amber-100" :
                          index % 5 === 3 ? "bg-purple-100" :
                          "bg-red-100"
                        )}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-1"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Asset Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assetStatusDistribution.map((item) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <StatusBadge status={item.status} size="md" />
                      <span className="font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-1"
          >
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Neueste Assets</CardTitle>
                <CardDescription>Kürzlich hinzugefügte Assets</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[280px] pr-4">
                  <div className="space-y-4">
                    {recentAssets.map((asset: Asset) => (
                      <div key={asset.id} className="flex items-start space-x-3 pb-3 border-b last:border-0 last:pb-0">
                        <div className="mt-1">
                          <div className={cn(
                            "p-2 rounded-md",
                            asset.type === "laptop" ? "bg-blue-100 text-blue-700" :
                            asset.type === "smartphone" ? "bg-green-100 text-green-700" :
                            asset.type === "tablet" ? "bg-purple-100 text-purple-700" :
                            "bg-gray-100 text-gray-700"
                          )}>
                            <Package size={16} />
                          </div>
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{asset.name}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar size={12} className="mr-1" />
                            {new Date(asset.purchaseDate).toLocaleDateString()}
                          </div>
                        </div>
                        <StatusBadge status={asset.status} size="sm" />
                      </div>
                    ))}
                    
                    {recentAssets.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">Keine Assets gefunden</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-1"
          >
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Neue Mitarbeiter</CardTitle>
                <CardDescription>Kürzlich hinzugefügte Mitarbeiter</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[280px] pr-4">
                  <div className="space-y-4">
                    {recentEmployees.map((employee) => (
                      <div key={employee.id} className="flex items-center space-x-3 pb-3 border-b last:border-0 last:pb-0">
                        <div className="flex-shrink-0">
                          {employee.imageUrl ? (
                            <div className="h-10 w-10 rounded-full overflow-hidden">
                              <img 
                                src={employee.imageUrl} 
                                alt={`${employee.firstName} ${employee.lastName}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-medium">
                                {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">
                            {employee.firstName} {employee.lastName}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <UserPlus size={12} className="mr-1" />
                            {new Date(employee.startDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {recentEmployees.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">Keine neuen Mitarbeiter</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default IndexPage;
