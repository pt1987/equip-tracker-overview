
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function ThemeSwitcher({ className, minimal = false }: { className?: string; minimal?: boolean }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn(
      "flex items-center gap-2",
      minimal ? "justify-center" : "",
      className
    )}>
      <Sun size={minimal ? 14 : 16} className={theme === 'light' ? 'text-n26-accent' : 'text-n26-primary/50'} />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle theme"
        className={cn(minimal ? "scale-90" : "")}
      />
      <Moon size={minimal ? 14 : 16} className={theme === 'dark' ? 'text-n26-accent' : 'text-n26-primary/50'} />
    </div>
  );
}
