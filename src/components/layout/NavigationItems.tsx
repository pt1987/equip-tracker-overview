
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  MonitorSmartphone,
  Users,
  Clock,
  CircleDot,
  PlusCircle,
  UserPlus,
  Menu,
  X,
  FileBarChart,
  Package,
  Shield,
  LogIn,
  LogOut,
  Calendar,
  Server,
  AlertTriangle,
  Home
} from "lucide-react";

interface NavigationItemsProps {
  location: {
    pathname: string;
  };
}

export const NavigationItems = ({ location }: NavigationItemsProps) => {
  const menuItems = [
    { to: "/", label: "Home", icon: "Home" },
    { to: "/dashboard", label: "Dashboard", icon: "BarChart3" },
    { to: "/assets", label: "Assets", icon: "MonitorSmartphone" },
    { to: "/employees", label: "Mitarbeiter", icon: "Users" },
    { to: "/history", label: "Historie", icon: "Clock" },
    { to: "/pool-assets", label: "Pool-Assets", icon: "CircleDot" },
    { to: "/bookings", label: "Buchungen", icon: "Calendar" },
    { to: "/reporting", label: "Reporting", icon: "FileBarChart" },
    { to: "/hardware-order", label: "Hardware-Bestellung", icon: "Package" },
    { to: "/damage-management", label: "Schadensmanagement", icon: "AlertTriangle" },
  ];

  return (
    <>
      {menuItems.map((item) => (
        <li key={item.to}>
          <Link
            to={item.to}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary transition-colors",
              location.pathname === item.to ? "font-medium bg-secondary" : ""
            )}
          >
            <NavigationItems.Icon name={item.icon} />
            <span>{item.label}</span>
          </Link>
        </li>
      ))}
    </>
  );
};

// Helper component for rendering icons
NavigationItems.Icon = function NavigationIcon({ name }: { name: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    Home: <Home size={20} />,
    BarChart3: <BarChart3 size={20} />,
    MonitorSmartphone: <MonitorSmartphone size={20} />,
    Users: <Users size={20} />,
    Clock: <Clock size={20} />,
    CircleDot: <CircleDot size={20} />,
    Calendar: <Calendar size={20} />,
    FileBarChart: <FileBarChart size={20} />,
    Package: <Package size={20} />,
    PlusCircle: <PlusCircle size={20} />,
    UserPlus: <UserPlus size={20} />,
    Shield: <Shield size={20} />,
    Server: <Server size={20} />,
    LogIn: <LogIn size={20} />,
    LogOut: <LogOut size={20} />,
    AlertTriangle: <AlertTriangle size={20} />,
  };

  return iconMap[name] || null;
};
