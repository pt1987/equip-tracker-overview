
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="status">Status</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">
                Filtert nach dem aktuellen Bearbeitungsstatus des Belegs im System.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger id="status">
          <SelectValue placeholder="Status auswählen" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Alle</SelectItem>
          <SelectItem value="draft">Entwurf</SelectItem>
          <SelectItem value="pending">Prüfung ausstehend</SelectItem>
          <SelectItem value="approved">Genehmigt</SelectItem>
          <SelectItem value="rejected">Abgelehnt</SelectItem>
          <SelectItem value="exported">Exportiert</SelectItem>
          <SelectItem value="archived">Archiviert</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
