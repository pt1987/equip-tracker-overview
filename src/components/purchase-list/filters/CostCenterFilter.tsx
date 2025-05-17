
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface CostCenterFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CostCenterFilter({ value, onChange }: CostCenterFilterProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="cost-center">Kostenstelle</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">
                Filtert nach Kostenstelle. Nur exakte Übereinstimmungen werden angezeigt.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Input
        id="cost-center"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Kostenstelle eingeben"
      />
    </div>
  );
}
