
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface VatRateFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function VatRateFilter({ value, onChange }: VatRateFilterProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="vat-rate">MwSt-Satz</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">
                Filtert nach angewendetem Mehrwertsteuersatz des Belegs.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger id="vat-rate">
          <SelectValue placeholder="MwSt-Satz auswählen" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Alle</SelectItem>
          <SelectItem value="0">0%</SelectItem>
          <SelectItem value="7">7%</SelectItem>
          <SelectItem value="19">19%</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
