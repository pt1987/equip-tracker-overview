
import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from 'lucide-react';

interface ModernWidgetProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
  headerAction?: React.ReactNode;
}

export default function ModernWidget({ 
  children, 
  title, 
  subtitle, 
  icon: Icon, 
  className,
  headerAction 
}: ModernWidgetProps) {
  return (
    <motion.div 
      className={cn("dashboard-widget", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
    >
      {(title || subtitle || Icon || headerAction) && (
        <div className="dashboard-widget-header">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="p-2 bg-green-100 rounded-lg">
                <Icon className="h-5 w-5 text-green-600" />
              </div>
            )}
            <div>
              {title && <h3 className="dashboard-widget-title">{title}</h3>}
              {subtitle && <p className="dashboard-widget-subtitle">{subtitle}</p>}
            </div>
          </div>
          {headerAction && (
            <div className="flex items-center space-x-2">
              {headerAction}
            </div>
          )}
        </div>
      )}
      <div className="dashboard-widget-content">
        {children}
      </div>
    </motion.div>
  );
}
