import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Sun,
  Moon,
  Menu,
  LayoutDashboard,
  PackageIcon,
  Users,
  FileText,
  ActivityIcon,
  DatabaseIcon,
  LogOut,
} from "lucide-react";

interface Props {
  className?: string;
}

const navLinkClass =
  "flex items-center text-sm font-medium text-muted-foreground hover:text-foreground";
const activeClass = "text-foreground";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { pathname } = useLocation();

  return (
    <div className={cn("h-screen flex flex-col border-r bg-card z-30 transition-transform", 
      isMobile ? "fixed inset-0 w-[280px] transform duration-300 ease-in-out" + (isOpen ? " translate-x-0" : " -translate-x-full") : "w-64 sticky top-0"
    )}>
      <div className="px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center font-semibold">
            <LayoutDashboard className="mr-2 h-6 w-6" />
            <span>PHAsset</span>
          </Link>
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              <Menu className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className={cn("flex-1", isMobile ? "mt-12" : "")}>
        <nav className="flex flex-col gap-1 px-2 py-2">
          <div className="px-3 py-2">
            <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
              Übersicht
            </h3>
            <div className="space-y-1">
              <Link
                to="/"
                className={cn(navLinkClass, "gap-3", pathname === "/" && activeClass)}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            </div>
          </div>

          <div className="px-3 py-2">
            <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
              Verwaltung
            </h3>
            <div className="space-y-1">
              <Link
                to="/assets"
                className={cn(navLinkClass, "gap-3", pathname.startsWith('/assets') && activeClass)}
              >
                <PackageIcon size={18} />
                <span>Assets</span>
              </Link>
              <Link
                to="/employees"
                className={cn(navLinkClass, "gap-3", pathname.startsWith('/employees') && activeClass)}
              >
                <Users size={18} />
                <span>Mitarbeiter</span>
              </Link>
              <Link
                to="/history"
                className={cn(navLinkClass, "gap-3", pathname === '/history' && activeClass)}
              >
                <FileText size={18} />
                <span>Historie</span>
              </Link>
            </div>
          </div>
          
          <div className="px-3 py-2">
            <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
              Administration
            </h3>
            <div className="space-y-1">
              <Link
                to="/admin/dashboard"
                className={cn(navLinkClass, "gap-3", pathname.startsWith('/admin/dashboard') && activeClass)}
              >
                <ActivityIcon size={18} />
                <span>Admin Dashboard</span>
              </Link>
              <Link
                to="/data-migration"
                className={cn(navLinkClass, "gap-3", pathname === '/data-migration' && activeClass)}
              >
                <DatabaseIcon size={18} />
                <span>Data Migration</span>
              </Link>
            </div>
          </div>
        </nav>
      </ScrollArea>
      
      <div className="p-4">
        <div className="border-t pt-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span className="text-sm font-medium">
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">
              Logout
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
