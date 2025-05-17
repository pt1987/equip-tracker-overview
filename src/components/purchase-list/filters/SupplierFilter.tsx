
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface SupplierFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SupplierFilter({ value, onChange }: SupplierFilterProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="supplier">Lieferant</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">
                Filtert nach Lieferantennamen. Die Suche findet alle Lieferanten, die den angegebenen Text enthalten.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Input
        id="supplier"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Lieferant eingeben"
      />
    </div>
  );
}
