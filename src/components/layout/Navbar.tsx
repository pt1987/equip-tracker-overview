
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Layers, 
  MonitorSmartphone, 
  Users, 
  BarChart3,
  Clock,
  CircleDot,
  Menu,
  X,
  UserPlus,
  PackagePlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const NavItem = ({ to, label, icon, isActive }: NavItemProps) => {
  return (
    <Link to={to} className="w-full">
      <div
        className={cn(
          "relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
          isActive 
            ? "bg-primary/10 text-primary font-medium" 
            : "hover:bg-secondary text-muted-foreground hover:text-foreground"
        )}
      >
        <span className="flex h-5 w-5 items-center justify-center">
          {icon}
        </span>
        <span>{label}</span>
        {isActive && (
          <motion.div
            layoutId="nav-indicator"
            className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full my-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
    </Link>
  );
};

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { to: "/", label: "Dashboard", icon: <BarChart3 size={20} /> },
    { to: "/assets", label: "Assets", icon: <MonitorSmartphone size={20} /> },
    { to: "/employees", label: "Employees", icon: <Users size={20} /> },
    { to: "/asset-groups", label: "Asset Groups", icon: <Layers size={20} /> },
    { to: "/history", label: "History", icon: <Clock size={20} /> },
    { to: "/pool-assets", label: "Pool Assets", icon: <CircleDot size={20} /> },
  ];

  const createButtons = [
    { to: "/employee/create", label: "Neuen Mitarbeiter erstellen", icon: <UserPlus size={20} /> },
    { to: "/asset/create", label: "Neues Asset erstellen", icon: <PackagePlus size={20} /> },
  ];

  return (
    <>
      {/* Desktop Nav */}
      <div className="hidden md:flex min-h-screen w-64 border-r border-border bg-background flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">P</span>
            </div>
            <h1 className="text-xl font-semibold">Asset Portal</h1>
          </div>
        </div>
        
        <div className="flex flex-col gap-1 px-3 mt-6">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              isActive={location.pathname === item.to}
            />
          ))}
          
          <div className="h-8 mt-4 mb-2 border-t border-border"></div>
          
          {createButtons.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              isActive={location.pathname === item.to}
            />
          ))}
        </div>
        
        <div className="mt-auto p-4">
          <div className="glass-card p-4 mb-4">
            <div className="flex justify-center mb-2">
              <ThemeSwitcher />
            </div>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground mb-2">Need help?</p>
            <p className="text-sm">
              Contact IT Support
              <br />
              <a href="mailto:it@phat-consulting.de" className="text-primary hover:underline">
                it@phat-consulting.de
              </a>
            </p>
          </div>
        </div>
      </div>
      
      {/* Mobile Nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">P</span>
            </div>
            <h1 className="text-xl font-semibold">Asset Portal</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-secondary"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <motion.div
            className="bg-background border-b border-border"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-1 p-3">
              {navItems.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  icon={item.icon}
                  isActive={location.pathname === item.to}
                />
              ))}
              
              <div className="h-8 mt-4 mb-2 border-t border-border"></div>
              
              {createButtons.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  icon={item.icon}
                  isActive={location.pathname === item.to}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
