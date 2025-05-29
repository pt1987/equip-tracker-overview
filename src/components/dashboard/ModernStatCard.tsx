
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ModernStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  className?: string;
}

export default function ModernStatCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  className 
}: ModernStatCardProps) {
  return (
    <motion.div 
      className={cn("dashboard-widget dashboard-stat-card", className)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-green-100 rounded-xl">
          <Icon className="h-6 w-6 text-green-600" />
        </div>
        {change && (
          <div className={cn(
            "flex items-center text-sm font-medium",
            change.trend === 'up' ? 'text-green-600' :
            change.trend === 'down' ? 'text-red-600' : 'text-gray-600'
          )}>
            {change.trend === 'up' ? '↗' : change.trend === 'down' ? '↘' : '→'} {change.value}
          </div>
        )}
      </div>
      
      <h3 className="dashboard-stat-number">{value}</h3>
      <p className="dashboard-stat-label">{title}</p>
    </motion.div>
  );
}
