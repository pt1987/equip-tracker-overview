
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface GoBDStatusFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function GoBDStatusFilter({ value, onChange }: GoBDStatusFilterProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="gobd-status">GoBD-Status</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">
                Filtert nach GoBD-Konformitätsstatus. Rot = nicht konform, Gelb = prüfen, Grün = konform.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger id="gobd-status">
          <SelectValue placeholder="GoBD-Status auswählen" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Alle</SelectItem>
          <SelectItem value="red">Nicht konform</SelectItem>
          <SelectItem value="yellow">Prüfen</SelectItem>
          <SelectItem value="green">GoBD-konform</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
