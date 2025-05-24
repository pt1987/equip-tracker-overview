
import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MicaCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'accent';
}

export default function MicaCard({ children, className, variant = 'default' }: MicaCardProps) {
  const variants = {
    default: "mica-card",
    elevated: "mica-card-elevated", 
    accent: "mica-card-accent"
  };

  return (
    <motion.div
      className={cn(variants[variant], className)}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
    >
      <div className="mica-content">
        {children}
      </div>
    </motion.div>
  );
}
