
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
  Server
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NavItem {
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
      Server: Server
    };

    // Use JSX Element Factory pattern to dynamically render the icon component
    const IconComponent = iconMap[name];
    return IconComponent ? React.createElement(IconComponent, { size: 20 }) : <span>Icon not found</span>;
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
