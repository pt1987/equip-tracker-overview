
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "flex items-center gap-2",
      isMobile ? "absolute top-4 right-16" : "", // Position for mobile
      className
    )}>
      <Sun size={16} className={theme === 'light' ? 'text-amber-500' : 'text-muted-foreground'} />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle theme"
      />
      <Moon size={16} className={theme === 'dark' ? 'text-blue-400' : 'text-muted-foreground'} />
    </div>
  );
}
