
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  Calendar,
  FileBarChart,
  History,
  LayoutDashboard,
  MonitorSmartphone,
  PackageSearch,
  ShoppingBag,
  Users,
  FileLineChart,
  Shield,
  Server,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  CalendarClock,
  DollarSign,
  Clock,
  BarChart3,
  UserCheck,
  BarChartHorizontal,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  hasDividerAbove?: boolean;
  isSubmenu?: boolean;
}

interface SubmenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface NavSubmenuProps extends NavLinkProps {
  items: SubmenuItem[];
}

export const NavLinks = () => {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const { user, hasPermission } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  // If on a mobile device, don't show any nav links
  if (isMobile) {
    return null;
  }
  
  const toggleMenu = (menuLabel: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuLabel]: !prev[menuLabel]
    }));
  };

  const NavLink = ({ href, icon, label, hasDividerAbove = false, isSubmenu = false }: NavLinkProps) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`);

    return (
      <>
        {hasDividerAbove && <div className="h-px bg-border my-2" />}
        <Link
          to={href}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
            isSubmenu && "pl-8",
            isActive
              ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {icon}
          {label}
        </Link>
      </>
    );
  };
  
  const NavSubmenu = ({ href, icon, label, items, hasDividerAbove = false }: NavSubmenuProps) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`) || items.some(item => pathname === item.href);
    const isExpanded = expandedMenus[label] || items.some(item => pathname === item.href);
    
    return (
      <>
        {hasDividerAbove && <div className="h-px bg-border my-2" />}
        <div className="space-y-1">
          <button
            onClick={() => toggleMenu(label)}
            className={cn(
              "w-full flex items-center justify-between rounded-md px-3 py-2 text-sm transition-all",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              {icon}
              {label}
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {isExpanded && (
            <div className="mt-1 space-y-1">
              {items.map((item, index) => (
                <NavLink
                  key={index}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isSubmenu={true}
                />
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  const reportingSubmenuItems = [
    {
      href: "/reporting",
      icon: <FileBarChart size={16} />,
      label: "Übersicht"
    },
    {
      href: "/reporting/order-timeline",
      icon: <CalendarClock size={16} />,
      label: "Bestellverlauf"
    },
    {
      href: "/reporting/yearly-budget",
      icon: <DollarSign size={16} />,
      label: "Jährliches Budget"
    },
    {
      href: "/reporting/yearly-purchases",
      icon: <ShoppingBag size={16} />,
      label: "Jährliche Anschaffungen"
    },
    {
      href: "/reporting/usage-duration",
      icon: <Clock size={16} />,
      label: "Nutzungsdauer"
    },
    {
      href: "/reporting/warranty-defects",
      icon: <FileLineChart size={16} />,
      label: "Garantie & Defekte"
    },
    {
      href: "/reporting/fixed-assets",
      icon: <BarChart3 size={16} />,
      label: "Anlagevermögen & GWG"
    },
    {
      href: "/reporting/employee-budget",
      icon: <UserCheck size={16} />,
      label: "Mitarbeiterbudget"
    },
    {
      href: "/reporting/vendor-analysis",
      icon: <BarChartHorizontal size={16} />,
      label: "Anbieteranalyse"
    }
  ];

  return (
    <div className="flex w-full flex-col gap-1 p-2">
      <NavLink href="/" icon={<LayoutDashboard size={16} />} label="Dashboard" />
      <NavLink
        href="/assets"
        icon={<MonitorSmartphone size={16} />}
        label="Assets"
      />
      <NavLink href="/employees" icon={<Users size={16} />} label="Mitarbeiter" />
      <NavLink href="/pool-assets" icon={<PackageSearch size={16} />} label="Pool-Assets" />
      <NavLink href="/bookings" icon={<Calendar size={16} />} label="Buchungen" />
      <NavLink
        href="/history"
        icon={<History size={16} />}
        label="Historie"
      />
      
      <NavSubmenu
        href="/reporting"
        icon={<FileBarChart size={16} />}
        label="Reporting"
        items={reportingSubmenuItems}
      />
      
      <NavLink
        href="/depreciation"
        icon={<FileLineChart size={16} />}
        label="Abschreibungen"
      />
      <NavLink
        href="/damage-management"
        icon={<AlertTriangle size={16} />}
        label="Schadensmanagement"
      />
      <NavLink
        href="/hardware-order"
        icon={<ShoppingBag size={16} />}
        label="Hardware-Bestellung"
        hasDividerAbove
      />
      
      {/* Add Admin section for users with admin permission */}
      {hasPermission('canAccessAdmin') && (
        <>
          <NavLink
            href="/admin/dashboard"
            icon={<Shield size={16} />}
            label="Admin Bereich"
            hasDividerAbove
          />
          <NavLink
            href="/admin/users"
            icon={<Users size={16} />}
            label="Benutzerverwaltung"
          />
          <NavLink
            href="/admin/roles"
            icon={<Shield size={16} />}
            label="Rollen & Berechtigungen"
          />
          <NavLink
            href="/admin/intune"
            icon={<Server size={16} />}
            label="Intune"
          />
        </>
      )}
    </div>
  );
};
