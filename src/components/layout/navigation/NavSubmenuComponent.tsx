
import { memo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavSubmenuItem } from "../types/navigation-types";
import { NavLinkComponent } from "./NavLinkComponent";

interface NavSubmenuComponentProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  items: NavSubmenuItem[];
  pathname: string;
  isExpanded: boolean;
  toggleMenu: () => void;
  hasDividerAbove?: boolean;
}

export const NavSubmenuComponent = memo(({
  href,
  icon,
  label,
  items,
  pathname,
  isExpanded,
  toggleMenu,
  hasDividerAbove = false
}: NavSubmenuComponentProps) => {
  const isActive = pathname === href || 
                  pathname.startsWith(`${href}/`) || 
                  items.some(item => pathname === item.href);

  return (
    <>
      {hasDividerAbove && <div className="h-px bg-border my-2" />}
      <div className="space-y-1">
        <button
          onClick={toggleMenu}
          className={cn(
            "w-full flex items-center justify-between rounded-md px-3 py-2 text-sm transition-all",
            isActive
              ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <div className="flex items-center gap-3">
            {icon}
            {label}
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        
        {isExpanded && (
          <div className="mt-1 space-y-1">
            {items.map((item, index) => (
              <NavLinkComponent
                key={index}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isSubmenu={true}
                pathname={pathname}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
});

NavSubmenuComponent.displayName = "NavSubmenuComponent";
