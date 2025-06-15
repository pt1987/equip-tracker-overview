
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, LogIn, LogOut, PlusCircle, UserPlus } from "lucide-react";
import { getMainNavigationItems, getReportingSubmenuItems, getAdminNavigationItems } from "./navigation/navigationItems";

export function MobileSidebar() {
  const location = useLocation();
  const { isAuthenticated, logout, hasPermission } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  
  const toggleMenu = (menuTitle: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuTitle]: !prev[menuTitle]
    }));
  };
  
  // Get navigation items
  const mainNavItems = getMainNavigationItems();
  const reportingItems = getReportingSubmenuItems();
  const adminNavItems = hasPermission('canAccessAdmin') ? getAdminNavigationItems() : [];
  
  const createLinks = [];
  if (hasPermission('canEditAssets')) {
    createLinks.push({ to: "/asset/create", label: "Asset erstellen", icon: PlusCircle });
  }
  if (hasPermission('canCreateEmployees')) {
    createLinks.push({ to: "/employee/create", label: "Mitarbeiter erstellen", icon: UserPlus });
  }

  const isInSubPath = (items: any[]) => {
    return items.some((item: any) => location.pathname === item.href);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pb-4 flex justify-between items-center">
        <Link to="/" className="flex items-center font-semibold text-n26-primary">
          Asset Tracker
        </Link>
      </div>
      <div className="px-4 py-4 border-b border-border">
        <ThemeSwitcher />
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {/* Main navigation items */}
          {mainNavItems.map((item, index) => (
            <li key={item.href} className="space-y-1">
              {item.hasDividerAbove && <div className="h-px bg-border my-2" />}
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-n26-secondary/20 transition-colors text-n26-primary",
                  location.pathname === item.href ? "font-medium bg-n26-secondary/30" : ""
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
          
          {/* Reporting submenu */}
          <li className="space-y-1">
            <button
              onClick={() => toggleMenu(reportingItems.label)}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-4 py-2 rounded-md hover:bg-n26-secondary/20 transition-colors text-n26-primary",
                (location.pathname === reportingItems.href || isInSubPath(reportingItems.items) || expandedMenus[reportingItems.label])
                  ? "font-medium bg-n26-secondary/30"
                  : ""
              )}
            >
              <div className="flex items-center gap-3">
                {reportingItems.icon}
                <span>{reportingItems.label}</span>
              </div>
              {expandedMenus[reportingItems.label] ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
            
            {expandedMenus[reportingItems.label] && (
              <ul className="pl-10 space-y-1 mt-1">
                {reportingItems.items.map((subItem) => (
                  <li key={subItem.href}>
                    <Link
                      to={subItem.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-n26-secondary/20 transition-colors text-n26-primary",
                        location.pathname === subItem.href
                          ? "font-medium bg-n26-secondary/30"
                          : ""
                      )}
                    >
                      {subItem.icon}
                      <span>{subItem.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          
          {/* Admin navigation items */}
          {adminNavItems.length > 0 && adminNavItems.map((item, index) => (
            <li key={item.href} className="space-y-1">
              {item.hasDividerAbove && <div className="h-px bg-border my-2" />}
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-n26-secondary/20 transition-colors text-n26-primary",
                  location.pathname === item.href ? "font-medium bg-n26-secondary/30" : ""
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
          
          {/* Create links */}
          {createLinks.length > 0 && (
            <>
              <li className="pt-4">
                <div className="px-4 py-2 text-xs font-semibold text-n26-primary/70 uppercase">
                  Erstellen
                </div>
              </li>
              {createLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-n26-secondary/20 transition-colors text-n26-primary",
                      location.pathname === item.to ? "font-medium bg-n26-secondary/30" : ""
                    )}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </>
          )}
          
          <li className="pt-4">
            <div className="px-4 py-2 text-xs font-semibold text-n26-primary/70 uppercase">
              Konto
            </div>
          </li>
          {isAuthenticated ? (
            <li>
              <Button
                variant="ghost" 
                size="icon"
                className="w-full justify-center px-4 py-2 rounded-md hover:bg-n26-secondary/20 text-n26-primary"
                onClick={() => logout()}
              >
                <LogOut size={20} />
              </Button>
            </li>
          ) : (
            <li>
              <Link
                to="/login"
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-n26-secondary/20 transition-colors text-n26-primary",
                  location.pathname === "/login" ? "font-medium bg-n26-secondary/30" : ""
                )}
              >
                <LogIn size={20} />
                <span>Anmelden</span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
