
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
  ReceiptText
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
    // Map icon names to actual icon components
    const iconMap: Record<string, LucideIcon> = {
      PlusCircle: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      ),
      UserPlus: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M19 8v6" />
          <path d="M22 11h-6" />
        </svg>
      ),
      Shield: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
      ),
      Users: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      Server: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
      )
    };

    return iconMap[name] ? React.createElement(iconMap[name]) : <span>Icon not found</span>;
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
