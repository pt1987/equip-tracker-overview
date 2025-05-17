
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, LogIn, LogOut } from "lucide-react";
import { NavigationItems, navItems } from "./NavigationItems";

export function DesktopSidebar() {
  const location = useLocation();
  const { isAuthenticated, logout, hasPermission } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  
  const toggleMenu = (menuTitle: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuTitle]: !prev[menuTitle]
    }));
  };
  
  const createLinks = [];
  if (hasPermission('canEditAssets')) {
    createLinks.push({ to: "/asset/create", label: "Asset erstellen", icon: "PlusCircle" });
  }
  if (hasPermission('canCreateEmployees')) {
    createLinks.push({ to: "/employee/create", label: "Mitarbeiter erstellen", icon: "UserPlus" });
  }
  
  const adminLinks = hasPermission('canAccessAdmin') ? [
    { to: "/admin/dashboard", label: "Admin Dashboard", icon: "Shield" },
    { to: "/admin/users", label: "Benutzerverwaltung", icon: "Users" },
    { to: "/admin/roles", label: "Rollen & Berechtigungen", icon: "Shield" },
    { to: "/admin/intune", label: "Intune Integration", icon: "Server" },
  ] : [];

  const isInSubPath = (item: any) => {
    if (!item.subItems) return false;
    return item.subItems.some((subItem: any) => location.pathname === subItem.href);
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-full flex-col bg-background border-r border-r-border flex w-64 overflow-hidden">
      <Link to="/" className="flex items-center h-16 px-4 font-semibold">
        Asset Tracker
      </Link>
      <div className="px-4 py-2 border-t border-b">
        <ThemeSwitcher />
      </div>
      <div className="flex-1 overflow-y-auto">
        <ul className="pt-4 space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.href} className="space-y-1">
              {item.subItems ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-4 py-2 rounded-md hover:bg-secondary transition-colors",
                      (location.pathname === item.href || isInSubPath(item) || expandedMenus[item.title])
                        ? "font-medium bg-secondary"
                        : ""
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} />
                      <span>{item.title}</span>
                    </div>
                    {expandedMenus[item.title] ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                  
                  {expandedMenus[item.title] && (
                    <ul className="pl-10 space-y-1 mt-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.href}>
                          <Link
                            to={subItem.href}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary transition-colors text-sm",
                              location.pathname === subItem.href
                                ? "font-medium bg-secondary"
                                : ""
                            )}
                          >
                            <subItem.icon size={16} />
                            <span>{subItem.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary transition-colors",
                    location.pathname === item.href ? "font-medium bg-secondary" : ""
                  )}
                >
                  <item.icon size={20} />
                  <span>{item.title}</span>
                </Link>
              )}
            </li>
          ))}
          
          {adminLinks.length > 0 && (
            <>
              <li className="pt-4">
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                  Admin
                </div>
              </li>
              {adminLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary transition-colors",
                      location.pathname.includes(item.to) ? "font-medium bg-secondary" : ""
                    )}
                  >
                    <NavigationItems.Icon name={item.icon} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </>
          )}
          
          {createLinks.length > 0 && (
            <>
              <li className="pt-4">
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                  Erstellen
                </div>
              </li>
              {createLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary transition-colors",
                      location.pathname === item.to ? "font-medium bg-secondary" : ""
                    )}
                  >
                    <NavigationItems.Icon name={item.icon} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </>
          )}
          
          <li className="pt-4">
            <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
              Konto
            </div>
          </li>
          {isAuthenticated ? (
            <li>
              <Button
                variant="ghost" 
                className="w-full justify-start text-left px-4 py-2 rounded-md hover:bg-secondary"
                onClick={() => logout()}
              >
                <LogOut size={20} className="mr-3" />
                <span>Abmelden</span>
              </Button>
            </li>
          ) : (
            <li>
              <Link
                to="/login"
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary transition-colors",
                  location.pathname === "/login" ? "font-medium bg-secondary" : ""
                )}
              >
                <LogIn size={20} />
                <span>Anmelden</span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
}
