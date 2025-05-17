
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorDisplayProps {
  error: Error;
  onRefresh: () => void;
}

const ErrorDisplay = memo(({ error, onRefresh }: ErrorDisplayProps) => (
  <div className="flex flex-col items-center justify-center py-8">
    <AlertCircle className="h-12 w-12 text-destructive mb-2" />
    <h3 className="text-lg font-medium mb-1">Fehler beim Laden der Daten</h3>
    <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
    <Button onClick={onRefresh} variant="outline" className="gap-2">
      <RefreshCw className="h-4 w-4" />
      Erneut versuchen
    </Button>
  </div>
));

ErrorDisplay.displayName = "ErrorDisplay";

export default ErrorDisplay;
