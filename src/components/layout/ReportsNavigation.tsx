
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BarChart3,
  BarChartHorizontal,
  CalendarClock,
  Clock,
  DollarSign,
  FileBarChart,
  FileLineChart,
  ShoppingBag,
  UserCheck
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const reportRoutes = [
  {
    title: "Übersicht",
    path: "/reporting",
    icon: FileBarChart,
    exact: true
  },
  {
    title: "Bestellverlauf",
    path: "/reporting/order-timeline",
    icon: CalendarClock
  },
  {
    title: "Jährliches Budget",
    path: "/reporting/yearly-budget",
    icon: DollarSign
  },
  {
    title: "Jährliche Anschaffungen",
    path: "/reporting/yearly-purchases",
    icon: ShoppingBag
  },
  {
    title: "Nutzungsdauer",
    path: "/reporting/usage-duration",
    icon: Clock
  },
  {
    title: "Garantie & Defekte",
    path: "/reporting/warranty-defects",
    icon: FileLineChart
  },
  {
    title: "Anlagevermögen & GWG",
    path: "/reporting/fixed-assets",
    icon: BarChart3
  },
  {
    title: "Mitarbeiterbudget",
    path: "/reporting/employee-budget",
    icon: UserCheck
  },
  {
    title: "Anbieteranalyse",
    path: "/reporting/vendor-analysis",
    icon: BarChartHorizontal
  }
];

const ReportsNavigation = () => {
  const location = useLocation();
  
  return (
    <div className="mb-6 bg-card rounded-md shadow-sm border p-1">
      <nav className="flex flex-wrap gap-1">
        {reportRoutes.map((route) => (
          <Link
            key={route.path}
            to={route.path}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              (route.exact 
                ? location.pathname === route.path 
                : location.pathname === route.path)
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            <route.icon className="h-4 w-4" />
            <span>{route.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default ReportsNavigation;
