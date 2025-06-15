
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, LogIn, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileSidebar } from "./MobileSidebar";
import { useAuth } from "@/hooks/use-auth";
import { GlobalSearch } from "./GlobalSearch";

export function MobileNavbar() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center p-4 bg-background/95 backdrop-blur-md border-b border-border">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center bg-gradient-to-r from-n26-primary to-n26-accent hover:from-n26-primary/90 hover:to-n26-accent/90 text-white"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 pt-6 w-64 overflow-y-auto">
          <MobileSidebar />
        </SheetContent>
      </Sheet>
      
      <div className="flex items-center">
        <Link to="/" className="font-semibold text-n26-primary">
          Asset Tracker
        </Link>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-n26-primary hover:bg-n26-secondary/20"
          onClick={() => setIsSearchOpen(true)}
        >
          <Search className="h-4 w-4" />
        </Button>
        
        {!isAuthenticated && (
          <Link to="/login">
            <Button 
              variant="outline" 
              size="sm"
              className="border-n26-primary text-n26-primary hover:bg-n26-primary hover:text-white"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Anmelden
            </Button>
          </Link>
        )}
        
        {isAuthenticated && (
          <Button 
            variant="ghost" 
            size="icon"
            className="text-n26-primary hover:bg-n26-secondary/20"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
