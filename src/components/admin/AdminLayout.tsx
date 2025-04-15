
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  FileText, 
  LogOut, 
  ChevronRight, 
  Menu,
  X,
  Home,
  Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const NavItem = ({ to, icon, label, active, onClick }: NavItemProps) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-4 py-2 rounded-md ${
      active ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
    }`}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
    {active && <ChevronRight className="ml-auto h-4 w-4" />}
  </Link>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, hasPermission, logout } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);

  useEffect(() => {
    // Check if user has admin access, if not redirect to home
    if (user && !hasPermission('canAccessAdmin')) {
      toast({
        variant: "destructive",
        title: "Zugriff verweigert",
        description: "Sie haben keine Berechtigung, auf diesen Bereich zuzugreifen.",
      });
      navigate("/");
    }
    
    const handleActivity = () => {
      setLastActivity(Date.now());
      setShowInactivityWarning(false);
    };
    
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keypress", handleActivity);
    
    const inactivityInterval = setInterval(() => {
      if (Date.now() - lastActivity > 12 * 60 * 1000 && !showInactivityWarning) {
        setShowInactivityWarning(true);
      }
      
      if (Date.now() - lastActivity > 15 * 60 * 1000) {
        handleLogout("Sie wurden aufgrund von Inaktivität abgemeldet.");
      }
    }, 60 * 1000);
    
    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keypress", handleActivity);
      clearInterval(inactivityInterval);
    };
  }, [lastActivity, navigate, toast, user, hasPermission]);

  const handleLogout = (message?: string) => {
    logout();
    toast({
      title: "Abgemeldet",
      description: message || "Sie wurden erfolgreich abgemeldet.",
    });
    navigate("/login");
  };

  const navItems = [
    { to: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard" },
    { to: "/admin/users", icon: <Users className="h-5 w-5" />, label: "Benutzer" },
    { to: "/admin/roles", icon: <Shield className="h-5 w-5" />, label: "Rollen & Berechtigungen" },
    { to: "/admin/logs", icon: <FileText className="h-5 w-5" />, label: "Audit-Logs" },
    { to: "/admin/intune", icon: <Server className="h-5 w-5" />, label: "Intune" },
  ];

  const isCurrentPath = (path: string) => location.pathname === path;

  // Render empty state if user doesn't have admin role
  if (user && !hasPermission('canAccessAdmin')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-20">
        <div className="flex flex-col flex-grow border-r border-border bg-card h-full">
          {/* Sidebar header */}
          <div className="flex items-center h-16 px-6 border-b border-border">
            <span className="flex items-center gap-2 font-semibold text-lg">
              <Shield className="h-5 w-5 text-primary" />
              Admin Portal
            </span>
          </div>
          
          {/* Sidebar content */}
          <div className="flex-grow overflow-y-auto pt-5 px-3 pb-4 flex flex-col justify-between">
            <nav className="space-y-1">
              {/* Navigation items */}
              {navItems.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={isCurrentPath(item.to)}
                />
              ))}
              
              <div className="pt-6">
                <Separator className="my-4" />
                <Link 
                  to="/" 
                  className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary"
                >
                  <Home className="h-5 w-5" />
                  <span>Zurück zur Hauptseite</span>
                </Link>
              </div>
            </nav>
            
            {/* Sidebar footer with user info */}
            <div className="space-y-4 mt-4">
              <Separator />
              <div className="px-3 text-sm text-muted-foreground">
                <p>Angemeldet als:</p>
                <p className="font-medium text-foreground">{user?.name}</p>
                <p className="text-xs">{user?.email}</p>
              </div>
              <div className="px-3">
                <ThemeSwitcher />
              </div>
              <div className="px-3 pb-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => handleLogout()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Abmelden
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-background border-b">
        <div className="flex justify-between items-center h-16 px-4">
          <span className="flex items-center gap-2 font-semibold text-base">
            <Shield className="h-5 w-5 text-primary" />
            Admin Portal
          </span>
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between h-16 px-6 border-b">
                    <span className="flex items-center gap-2 font-semibold text-lg">
                      <Shield className="h-5 w-5 text-primary" />
                      Admin Portal
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileNavOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <nav className="flex-grow overflow-y-auto pt-5 px-3 pb-4 flex flex-col justify-between">
                    <div className="space-y-1">
                      {navItems.map((item) => (
                        <NavItem
                          key={item.to}
                          to={item.to}
                          icon={item.icon}
                          label={item.label}
                          active={isCurrentPath(item.to)}
                          onClick={() => setIsMobileNavOpen(false)}
                        />
                      ))}
                      
                      <div className="pt-6">
                        <Separator className="my-4" />
                        <Link 
                          to="/" 
                          className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary"
                          onClick={() => setIsMobileNavOpen(false)}
                        >
                          <Home className="h-5 w-5" />
                          <span>Zurück zur Hauptseite</span>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mt-4">
                      <Separator />
                      <div className="px-3 text-sm text-muted-foreground">
                        <p>Angemeldet als:</p>
                        <p className="font-medium text-foreground">{user?.name}</p>
                        <p className="text-xs">{user?.email}</p>
                      </div>
                      <div className="px-3">
                        <ThemeSwitcher />
                      </div>
                      <div className="px-3 pb-4">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start" 
                          onClick={() => handleLogout()}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Abmelden
                        </Button>
                      </div>
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 md:pl-64 pt-16 md:pt-0 w-full max-w-full">
        <div className="p-3 md:p-4 lg:p-6 w-full max-w-full flex-1">
          {showInactivityWarning && (
            <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-md">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Ihre Sitzung wird in Kürze aufgrund von Inaktivität beendet. Bewegen Sie die Maus oder drücken Sie eine Taste, um die Sitzung aktiv zu halten.
              </p>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
