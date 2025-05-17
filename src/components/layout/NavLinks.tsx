
import { useState, memo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { NavLinkItem, NavSubmenuProps, NavSubmenuItem } from "./types/navigation-types";
import { NavLinkComponent } from "./navigation/NavLinkComponent";
import { NavSubmenuComponent } from "./navigation/NavSubmenuComponent";
import { getMainNavigationItems, getReportingSubmenuItems, getAdminNavigationItems } from "./navigation/navigationItems";

export const NavLinks = memo(() => {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const { hasPermission } = useAuth();
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

  // Get main navigation items
  const mainNavItems = getMainNavigationItems();
  
  // Get reporting submenu items
  const reportingSubmenuItems = getReportingSubmenuItems();
  
  // Get admin navigation items if user has permission
  const adminNavItems = hasPermission('canAccessAdmin') ? getAdminNavigationItems() : [];

  return (
    <div className="flex w-full flex-col gap-1 p-2">
      {/* Render main navigation items */}
      {mainNavItems.map((item, index) => (
        <NavLinkComponent
          key={index}
          href={item.href}
          icon={item.icon}
          label={item.label}
          hasDividerAbove={item.hasDividerAbove}
          pathname={pathname}
        />
      ))}
      
      {/* Render Reporting submenu */}
      <NavSubmenuComponent
        href="/reporting"
        icon={reportingSubmenuItems.icon}
        label={reportingSubmenuItems.label}
        items={reportingSubmenuItems.items}
        pathname={pathname}
        isExpanded={expandedMenus[reportingSubmenuItems.label] || false}
        toggleMenu={() => toggleMenu(reportingSubmenuItems.label)}
      />
      
      {/* Render admin navigation items if user has permission */}
      {adminNavItems.length > 0 && adminNavItems.map((item, index) => (
        <NavLinkComponent
          key={`admin-${index}`}
          href={item.href}
          icon={item.icon}
          label={item.label}
          hasDividerAbove={index === 0} // Add divider above the first admin item
          pathname={pathname}
        />
      ))}
    </div>
  );
});

NavLinks.displayName = "NavLinks";
