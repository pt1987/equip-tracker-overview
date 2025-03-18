
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sun size={16} />
          <Label htmlFor="light-switch">Light Mode</Label>
        </div>
        <Switch
          id="light-switch"
          checked={theme === "light"}
          onCheckedChange={() => setTheme("light")}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Moon size={16} />
          <Label htmlFor="dark-switch">Dark Mode</Label>
        </div>
        <Switch
          id="dark-switch"
          checked={theme === "dark"}
          onCheckedChange={() => setTheme("dark")}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye size={16} />
          <Label htmlFor="colorblind-switch">Colorblind Mode</Label>
        </div>
        <Switch
          id="colorblind-switch"
          checked={theme === "colorblind"}
          onCheckedChange={() => setTheme("colorblind")}
        />
      </div>
    </div>
  );
}
