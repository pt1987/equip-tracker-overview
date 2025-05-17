
import { memo } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onRefresh?: () => void;
}

const EmptyState = memo(({ onRefresh }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <h3 className="text-lg font-medium mb-1">Keine Einkäufe verfügbar</h3>
    <p className="text-sm text-muted-foreground mb-4">
      Es wurden keine Einkäufe gefunden, die den aktuellen Filterkriterien entsprechen.
    </p>
    {onRefresh && (
      <Button onClick={onRefresh} variant="outline" size="sm" className="gap-2">
        <RefreshCw className="h-3.5 w-3.5" />
        Filter zurücksetzen
      </Button>
    )}
  </div>
));

EmptyState.displayName = "EmptyState";

export default EmptyState;
