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
  CalendarClock,
  DollarSign,
  Clock,
  BarChart3,
  UserCheck,
  BarChartHorizontal,
  ReceiptText,
  KeyRound,
  FileText,
  Image
} from "lucide-react";
import { NavLinkItem, NavSubmenuItem, NavSubmenuProps } from "../types/navigation-types";

export const getMainNavigationItems = (): NavLinkItem[] => {
  return [
    {
      href: "/",
      icon: <LayoutDashboard size={16} />,
      label: "Dashboard"
    },
    {
      href: "/assets",
      icon: <MonitorSmartphone size={16} />,
      label: "Assets"
    },
    {
      href: "/employees",
      icon: <Users size={16} />,
      label: "Mitarbeiter"
    },
    {
      href: "/pool-assets",
      icon: <PackageSearch size={16} />,
      label: "Pool-Assets"
    },
    {
      href: "/bookings",
      icon: <Calendar size={16} />,
      label: "Buchungen"
    },
    {
      href: "/history",
      icon: <History size={16} />,
      label: "Historie"
    },
    {
      href: "/depreciation",
      icon: <FileLineChart size={16} />,
      label: "Abschreibungen"
    },
    {
      href: "/damage-management",
      icon: <AlertTriangle size={16} />,
      label: "Schadensmanagement"
    },
    {
      href: "/license-management",
      icon: <KeyRound size={16} />,
      label: "Lizenzmanagement"
    },
    {
      href: "/hardware-order",
      icon: <ShoppingBag size={16} />,
      label: "Hardware-Bestellung",
      hasDividerAbove: true
    },
    {
      href: "/purchase-list",
      icon: <ReceiptText size={16} />,
      label: "Einkaufsliste"
    }
  ];
};

export const getReportingSubmenuItems = (): NavSubmenuProps => {
  return {
    href: "/reporting",
    icon: <FileBarChart size={16} />,
    label: "Reporting",
    items: [
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
      },
      {
        href: "/reporting/software-license",
        icon: <KeyRound size={16} />,
        label: "Software-Lizenzen"
      },
      {
        href: "/reporting/roii",
        icon: <FileLineChart size={16} />,
        label: "IT-Investitionsrendite"
      },
      {
        href: "/reporting/carbon-footprint",
        icon: <FileLineChart size={16} />,
        label: "CO2-Fußabdruck"
      }
    ]
  };
};

export function getAdminNavigationItems(): NavLinkItem[] {
  return [
    {
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      hasDividerAbove: true
    },
    {
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      label: "Benutzer"
    },
    {
      href: "/admin/roles",
      icon: <Shield className="h-5 w-5" />,
      label: "Rollen & Berechtigungen"
    },
    {
      href: "/admin/logs",
      icon: <FileText className="h-5 w-5" />,
      label: "Audit-Logs"
    },
    {
      href: "/admin/intune",
      icon: <Server className="h-5 w-5" />,
      label: "Intune"
    },
    {
      href: "/admin/landing-page-images",
      icon: <Image className="h-5 w-5" />,
      label: "Landing Page Bilder"
    }
  ];
}
