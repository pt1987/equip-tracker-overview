
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
      className={cn("bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {(title || subtitle || Icon || headerAction) && (
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            {Icon && (
              <div className="p-3 bg-emerald-100 rounded-lg flex-shrink-0">
                <Icon className="h-6 w-6 text-emerald-600" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              {title && <h3 className="text-lg font-semibold text-gray-900 truncate">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500 truncate mt-1">{subtitle}</p>}
            </div>
          </div>
          {headerAction && (
            <div className="flex-shrink-0 ml-4">
              {headerAction}
            </div>
          )}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );
}
