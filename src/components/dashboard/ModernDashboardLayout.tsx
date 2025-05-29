
import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ModernDashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function ModernDashboardLayout({ children, className }: ModernDashboardLayoutProps) {
  return (
    <motion.div 
      className={cn("dashboard-layout", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="dashboard-main">
        {children}
      </div>
    </motion.div>
  );
}
