
import { ReactNode } from "react";

interface AssetErrorStateProps {
  error: Error | unknown;
}

const AssetErrorState = ({ error }: AssetErrorStateProps) => {
  return (
    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive">
      <h3 className="font-semibold mb-2">Fehler beim Laden der Assets</h3>
      <p>{error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten"}</p>
      <p className="mt-2 text-sm">Bitte stellen Sie sicher, dass Sie angemeldet sind und über die entsprechenden Berechtigungen verfügen.</p>
    </div>
  );
};

export default AssetErrorState;
