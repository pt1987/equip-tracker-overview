
import { Dispatch, SetStateAction } from "react";
import StatCard from "@/components/dashboard/StatCard";
import { Package, Users, Coins, AlertTriangle } from "lucide-react";
import { DashboardStats } from "@/lib/types";

interface DashboardHeaderProps {
  dashboardStats: DashboardStats;
}

export default function DashboardHeader({ dashboardStats }: DashboardHeaderProps) {
  // Calculate percentages
  const assignedPercentage = Math.round((dashboardStats.assignedAssets / dashboardStats.totalAssets) * 100) || 0;
  const poolPercentage = Math.round((dashboardStats.poolAssets / dashboardStats.totalAssets) * 100) || 0;
  const defectivePercentage = Math.round((dashboardStats.defectiveAssets / dashboardStats.totalAssets) * 100) || 0;

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-mica -z-10 rounded-2xl" />
        <div className="relative z-10 p-6">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground/80 mt-1">
            Willkommen zurück! Hier ist ein Überblick über Ihr Asset Management System.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          showPercentage={true}
          percentage={assignedPercentage}
        />
        <StatCard 
          title="Pool Assets" 
          value={dashboardStats.poolAssets} 
          icon={Coins} 
          colorClass="text-amber-500" 
          showPercentage={true}
          percentage={poolPercentage}
        />
        <StatCard 
          title="Defekte Assets" 
          value={dashboardStats.defectiveAssets} 
          icon={AlertTriangle} 
          colorClass="text-red-500" 
          showPercentage={true}
          percentage={defectivePercentage}
        />
      </div>
    </>
  );
}
