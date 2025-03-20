import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  BarChart3,
  MonitorSmartphone,
  Users,
  Clock,
  CircleDot,
  PlusCircle,
  UserPlus,
  Menu,
  X,
  FileBarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./ThemeSwitcher";

export default function Navbar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const menuItems = [
    { to: "/", label: "Dashboard", icon: <BarChart3 size={20} /> },
    { to: "/assets", label: "Assets", icon: <MonitorSmartphone size={20} /> },
    { to: "/employees", label: "Employees", icon: <Users size={20} /> },
    { to: "/history", label: "History", icon: <Clock size={20} /> },
    { to: "/pool-assets", label: "Pool Assets", icon: <CircleDot size={20} /> },
    { to: "/reporting", label: "Reporting", icon: <FileBarChart size={20} /> },
  ];

  const createLinks = [
    { to: "/asset/create", label: "Create Asset", icon: <PlusCircle size={20} /> },
    { to: "/employee/create", label: "Create Employee", icon: <UserPlus size={20} /> },
  ];

  return (
    <>
      {isMobile ? (
        <div className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center p-4 bg-background/95 backdrop-blur-md border-b border-border">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center"
                onClick={toggleSidebar}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 pt-6 w-64">
              <div className="flex flex-col h-full">
                <div className="px-4 pb-4 flex justify-between items-center">
                  <Link to="/" className="flex items-center font-semibold">
                    Asset Tracker
                  </Link>
                </div>
                <div className="px-4 pb-4">
                  <ThemeSwitcher inMobileMenu={true} />
                </div>
                <div className="flex-1">
                  <ul className="space-y-1">
                    {menuItems.map((item) => (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary transition-colors",
                            location.pathname === item.to ? "font-medium bg-secondary" : ""
                          )}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                    <li className="pt-4">
                      <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                        Create New
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
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center">
            <Link to="/" className="font-semibold">
              Asset Tracker
            </Link>
          </div>
        </div>
      ) : (
        <aside className="fixed left-0 top-0 z-40 h-full flex-col bg-background border-r border-r-border flex w-64">
          <Link to="/" className="flex items-center h-16 px-4 font-semibold">
            Asset Tracker
          </Link>
          <div className="flex-1">
            <ul className="pt-6 space-y-1">
              {menuItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary transition-colors",
                      location.pathname === item.to ? "font-medium bg-secondary" : ""
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-4">
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                  Create New
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
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </>
  );
}
