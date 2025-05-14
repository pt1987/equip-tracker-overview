
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
import { NavItem } from "@/components/ui/sidebar";

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
