
import React from 'react';
import { Search, Bell, Settings, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ModernDashboardHeader() {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {isMobile && (
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Search Bar - Hidden on mobile */}
          {!isMobile && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Suchen..."
                className="pl-10 w-64 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          )}
          
          {/* Mobile Search Icon */}
          {isMobile && (
            <Button variant="ghost" size="sm">
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>
          
          {/* Settings - Hidden on mobile */}
          {!isMobile && (
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>
          )}
          
          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
            {!isMobile && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            )}
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={user?.name || 'User'} />
              <AvatarFallback className="bg-green-600 text-white text-sm">
                {user?.name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
}
