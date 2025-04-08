
import { useEffect, useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import { DashboardStats, AssetTypeDistribution, AssetStatusDistribution } from "@/lib/types";
import { getDashboardStats } from "@/data/helpers";
import { getAssets } from "@/data/assets";
import { getEmployees } from "@/data/employees";
import StatCard from "@/components/dashboard/StatCard";
import { 
  BarChart, 
  PieChart, 
  Package, 
  Users, 
  AlertTriangle, 
  Coins 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Helper functions to get distribution data
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

const IndexPage = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalAssets: 0,
    assignedAssets: 0,
    poolAssets: 0,
    defectiveAssets: 0,
    totalBudget: 0,
    totalBudgetUsed: 0
  });
  const [assetTypeDistribution, setAssetTypeDistribution] = useState<AssetTypeDistribution[]>([]);
  const [assetStatusDistribution, setAssetStatusDistribution] = useState<AssetStatusDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const stats = await getDashboardStats();
      setDashboardStats(stats);

      const typeDistribution = await getAssetTypeDistribution();
      setAssetTypeDistribution(typeDistribution);

      const statusDistribution = await getAssetStatusDistribution();
      setAssetStatusDistribution(statusDistribution);

      setLoading(false);
    };

    fetchData();
  }, []);

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
      <div className="flex flex-col gap-4 p-3 md:p-4 xl:p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your asset management system
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Assets"
            value={dashboardStats.totalAssets}
            icon={Package}
          />
          <StatCard
            title="Assigned Assets"
            value={dashboardStats.assignedAssets}
            icon={Users}
          />
          <StatCard
            title="Pool Assets"
            value={dashboardStats.poolAssets}
            icon={Coins}
          />
          <StatCard
            title="Defective Assets"
            value={dashboardStats.defectiveAssets}
            icon={AlertTriangle}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Asset Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assetTypeDistribution.length > 0 ? (
                <div className="h-72 w-full">
                  {/* Custom chart display here */}
                  {assetTypeDistribution.map(item => (
                    <div key={item.type} className="mb-2">
                      <div className="flex justify-between mb-1">
                        <span>{item.type}</span>
                        <span>{item.count}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-full rounded-full" 
                          style={{ 
                            width: `${(item.count / assetTypeDistribution.reduce((acc, curr) => acc + curr.count, 0)) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  No asset type data available.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Asset Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-72 w-full">
                <div className="flex flex-col gap-2">
                  {assetStatusDistribution.length > 0 ? (
                    assetStatusDistribution.map((item) => (
                      <Badge
                        key={item.status}
                        className={cn(
                          "w-full rounded-md",
                          item.status === "defective"
                            ? "bg-red-500 text-white"
                            : item.status === "in_use"
                            ? "bg-green-500 text-white"
                            : item.status === "ordered"
                            ? "bg-blue-500 text-white"
                            : item.status === "repair"
                            ? "bg-orange-500 text-white"
                            : item.status === "pool"
                            ? "bg-yellow-500 text-white"
                            : "bg-secondary text-foreground"
                        )}
                      >
                        {item.status} ({item.count})
                      </Badge>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground">
                      No asset status data available.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default IndexPage;
