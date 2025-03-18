
import { LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ViewToggleProps {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <ToggleGroup type="single" value={view} onValueChange={(value) => {
      if (value) onViewChange(value as "grid" | "list");
    }}>
      <ToggleGroupItem value="grid" aria-label="Grid View">
        <LayoutGrid size={18} />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List View">
        <LayoutList size={18} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
