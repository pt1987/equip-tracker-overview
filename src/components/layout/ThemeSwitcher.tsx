
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn("flex items-center gap-2", className)}>
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
