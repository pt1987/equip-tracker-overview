
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  pathname: string;
  hasDividerAbove?: boolean;
  isSubmenu?: boolean;
}

export const NavLinkComponent = React.memo(({ 
  href, 
  icon, 
  label, 
  pathname, 
  hasDividerAbove = false, 
  isSubmenu = false 
}: NavLinkProps) => {
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {hasDividerAbove && <div className="h-px bg-border my-2" />}
      <Link
        to={href}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
          isSubmenu && "pl-8",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        {icon}
        {label}
      </Link>
    </>
  );
});

NavLinkComponent.displayName = "NavLinkComponent";
