
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterContainerProps {
  children: ReactNode;
  hasFilters: boolean;
  onClearAll: () => void;
}

export default function FilterContainer({ children, hasFilters, onClearAll }: FilterContainerProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {children}
      </div>

      {hasFilters && (
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            onClick={onClearAll} 
            size="sm"
            className="text-muted-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Filter zurücksetzen
          </Button>
        </div>
      )}
    </div>
  );
}
