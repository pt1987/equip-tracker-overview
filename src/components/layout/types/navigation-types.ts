
import { ReactNode } from "react";

export interface NavLinkItem {
  href: string;
  icon: ReactNode;
  label: string;
  hasDividerAbove?: boolean;
}

export interface NavSubmenuItem {
  href: string;
  icon: ReactNode;
  label: string;
}

export interface NavSubmenuProps {
  href: string;
  icon: ReactNode;
  label: string;
  items: NavSubmenuItem[];
  hasDividerAbove?: boolean;
}

export interface NavigationItems {
  mainNavItems: NavLinkItem[];
  reportingItems: NavSubmenuProps;
  adminNavItems: NavLinkItem[];
}
