
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
  ReceiptText
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

export const getAdminNavigationItems = (): NavLinkItem[] => {
  return [
    {
      href: "/admin/dashboard",
      icon: <Shield size={16} />,
      label: "Admin Bereich",
      hasDividerAbove: true
    },
    {
      href: "/admin/users",
      icon: <Users size={16} />,
      label: "Benutzerverwaltung"
    },
    {
      href: "/admin/roles",
      icon: <Shield size={16} />,
      label: "Rollen & Berechtigungen"
    },
    {
      href: "/admin/intune",
      icon: <Server size={16} />,
      label: "Intune"
    }
  ];
};
