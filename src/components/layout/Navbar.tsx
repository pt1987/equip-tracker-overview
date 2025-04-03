
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
  FileBarChart,
  Package,
  Shield,
  LogIn,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useAuth } from "@/hooks/use-auth";

export default function Navbar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin";

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
    { to: "/hardware-order", label: "Hardware-Bestellung", icon: <Package size={20} /> },
  ];

  const createLinks = [
    { to: "/asset/create", label: "Create Asset", icon: <PlusCircle size={20} /> },
    { to: "/employee/create", label: "Create Employee", icon: <UserPlus size={20} /> },
  ];
  
  const adminLinks = isAdmin ? [
    { to: "/admin/dashboard", label: "Admin Dashboard", icon: <Shield size={20} /> },
    { to: "/admin/users", label: "User Management", icon: <Users size={20} /> },
    { to: "/admin/roles", label: "Roles & Permissions", icon: <Shield size={20} /> },
    { to: "/admin/logs", label: "Audit Logs", icon: <FileBarChart size={20} /> },
  ] : [];

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
            <SheetContent side="left" className="p-0 pt-6 w-64 overflow-y-auto">
              <div className="flex flex-col h-full">
                <div className="px-4 pb-4 flex justify-between items-center">
                  <Link to="/" className="flex items-center font-semibold">
                    Asset Tracker
                  </Link>
                </div>
                <div className="px-4 py-4 border-b border-border">
                  <ThemeSwitcher />
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                  <ul className="space-y-1 px-2">
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
                    
                    {isAdmin && (
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
                                location.pathname === item.to ? "font-medium bg-secondary" : ""
                              )}
                            >
                              {item.icon}
                              <span>{item.label}</span>
                            </Link>
                          </li>
                        ))}
                      </>
                    )}
                    
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
                    
                    {/* Authentication section */}
                    <li className="pt-4">
                      <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                        Account
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
                          <span>Logout</span>
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
                          <span>Login</span>
                        </Link>
                      </li>
                    )}
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
          
          {/* Add login button for mobile */}
          {!isAuthenticated && (
            <Link to="/login">
              <Button variant="outline" size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
          
          {isAuthenticated && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          )}
        </div>
      ) : (
        <aside className="fixed left-0 top-0 z-40 h-full flex-col bg-background border-r border-r-border flex w-64 overflow-hidden">
          <Link to="/" className="flex items-center h-16 px-4 font-semibold">
            Asset Tracker
          </Link>
          <div className="px-4 py-2 border-t border-b">
            <ThemeSwitcher />
          </div>
          <div className="flex-1 overflow-y-auto">
            <ul className="pt-4 space-y-1 px-2">
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
              
              {isAdmin && (
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
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </>
              )}
              
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
              
              {/* Authentication section */}
              <li className="pt-4">
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                  Account
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
                    <span>Logout</span>
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
                    <span>Login</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </aside>
      )}
    </>
  );
}
