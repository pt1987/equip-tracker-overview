
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CircleDollarSign,
  Clock,
  FileBarChart,
  History,
  Inbox,
  LayoutDashboard,
  Lightbulb,
  Laptop,
  MonitorSmartphone,
  PackageSearch,
  ShoppingBag,
  User,
  Users,
  Grid,
  FileLineChart,
  BookOpen
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  hasDividerAbove?: boolean;
}

export const NavLinks = () => {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();

  // If on a mobile device, don't show any nav links
  if (isMobile) {
    return null;
  }

  const NavLink = ({ href, icon, label, hasDividerAbove = false }: NavLinkProps) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`);

    return (
      <>
        {hasDividerAbove && <div className="h-px bg-border my-2" />}
        <Link
          to={href}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
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
      <NavLink href="/bookings" icon={<Calendar size={16} />} label="Buchungen" hasDividerAbove />
      <NavLink
        href="/history"
        icon={<History size={16} />}
        label="Historie"
      />
      <NavLink
        href="/reporting"
        icon={<FileBarChart size={16} />}
        label="Reporting"
      />
      <NavLink
        href="/depreciation"
        icon={<FileLineChart size={16} />}
        label="Abschreibungen"
      />
      <NavLink
        href="/hardware-order"
        icon={<ShoppingBag size={16} />}
        label="Hardware-Bestellung"
        hasDividerAbove
      />
    </div>
  );
};
