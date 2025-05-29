
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
      className={cn("bg-white rounded-lg border shadow-sm overflow-hidden", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
    >
      {(title || subtitle || Icon || headerAction) && (
        <div className="flex items-center justify-between p-4 border-b bg-gray-50/50">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {Icon && (
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <Icon className="h-5 w-5 text-green-600" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              {title && <h3 className="font-semibold text-gray-900 truncate">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500 truncate">{subtitle}</p>}
            </div>
          </div>
          {headerAction && (
            <div className="flex-shrink-0 ml-4">
              {headerAction}
            </div>
          )}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </motion.div>
  );
}
