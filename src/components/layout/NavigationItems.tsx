
import React from "react";
import {
  LayoutDashboard,
  Laptop,
  Users,
  History as HistoryIcon,
  Package,
  FileBarChart2,
  Calculator,
  ClipboardList,
  CalendarRange,
  AlertOctagon,
  ShoppingCart,
  ReceiptText,
  PlusCircle,
  UserPlus,
  Shield,
  Server,
  BarChart3,
  CalendarClock,
  DollarSign,
  Clock,
  FileLineChart,
  ShoppingBag,
  UserCheck,
  BarChartHorizontal
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  subItems?: SubNavItem[];
  isExpanded?: boolean;
}

export interface SubNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Assets",
    href: "/assets",
    icon: Laptop,
  },
  {
    title: "Mitarbeiter",
    href: "/employees",
    icon: Users,
  },
  {
    title: "Historie",
    href: "/history",
    icon: HistoryIcon,
  },
  {
    title: "Pool-Geräte",
    href: "/pool-assets",
    icon: Package,
  },
  {
    title: "Reporting",
    href: "/reporting",
    icon: FileBarChart2,
    subItems: [
      {
        title: "Übersicht",
        href: "/reporting",
        icon: FileBarChart2,
      },
      {
        title: "Bestellverlauf",
        href: "/reporting/order-timeline",
        icon: CalendarClock,
      },
      {
        title: "Jährliches Budget",
        href: "/reporting/yearly-budget",
        icon: DollarSign,
      },
      {
        title: "Jährliche Anschaffungen",
        href: "/reporting/yearly-purchases",
        icon: ShoppingBag,
      },
      {
        title: "Nutzungsdauer",
        href: "/reporting/usage-duration", 
        icon: Clock,
      },
      {
        title: "Garantie & Defekte",
        href: "/reporting/warranty-defects",
        icon: FileLineChart,
      },
      {
        title: "Anlagevermögen & GWG",
        href: "/reporting/fixed-assets",
        icon: BarChart3,
      },
      {
        title: "Mitarbeiterbudget",
        href: "/reporting/employee-budget",
        icon: UserCheck,
      },
      {
        title: "Anbieteranalyse",
        href: "/reporting/vendor-analysis",
        icon: BarChartHorizontal,
      }
    ],
  },
  {
    title: "Abschreibungen",
    href: "/depreciation",
    icon: Calculator,
  },
  {
    title: "Hardware-Bestellung",
    href: "/hardware-order",
    icon: ShoppingCart,
  },
  {
    title: "Gerätebuchungen",
    href: "/bookings",
    icon: CalendarRange,
  },
  {
    title: "Einkaufsliste",
    href: "/purchase-list",
    icon: ReceiptText,
  },
  {
    title: "Schadensmeldungen",
    href: "/damage-management",
    icon: AlertOctagon,
  },
];

// Add helper for icon rendering
export const NavigationItems = {
  Icon: ({ name }: { name: string }) => {
    // Map icon names to imported Lucide components
    const iconMap: Record<string, LucideIcon> = {
      PlusCircle: PlusCircle,
      UserPlus: UserPlus,
      Shield: Shield,
      Users: Users,
      Server: Server,
      BarChart3: BarChart3,
      CalendarClock: CalendarClock,
      DollarSign: DollarSign,
      Clock: Clock,
      FileLineChart: FileLineChart,
      ShoppingBag: ShoppingBag,
      UserCheck: UserCheck,
      BarChartHorizontal: BarChartHorizontal
    };

    // Get the component from the map
    const IconComponent = iconMap[name];
    
    // Return the component if it exists, otherwise return a fallback
    return IconComponent ? 
      React.createElement(IconComponent, { size: 20 }) : 
      <span>Icon not found</span>;
  },
  renderItems: (location: any) => {
    return navItems.map((item) => (
      <li key={item.href}>
        <a
          href={item.href}
          className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary transition-colors ${
            location.pathname === item.href ? "font-medium bg-secondary" : ""
          }`}
        >
          <item.icon size={20} />
          <span>{item.title}</span>
        </a>
      </li>
    ));
  }
};
