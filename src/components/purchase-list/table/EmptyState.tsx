
import { memo } from "react";

const EmptyState = memo(() => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <h3 className="text-lg font-medium mb-1">Keine Einkäufe gefunden</h3>
    <p className="text-sm text-muted-foreground mb-2">
      Es wurden keine Einkäufe gefunden, die den Filterkriterien entsprechen.
    </p>
  </div>
));

EmptyState.displayName = "EmptyState";

export default EmptyState;
