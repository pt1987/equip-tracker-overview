
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function MobileNavbar() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center p-4 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="flex items-center">
        <Link to="/" className="font-semibold text-n26-primary">
          Asset Tracker
        </Link>
      </div>
      
      <div className="flex items-center gap-2">
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
    </div>
  );
}
