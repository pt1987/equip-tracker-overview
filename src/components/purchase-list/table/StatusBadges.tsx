
import { memo } from "react";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = memo(({ status }: StatusBadgeProps) => {
  switch (status) {
    case 'draft':
      return <Badge variant="outline" className="bg-gray-100">Entwurf</Badge>;
    case 'pending':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Prüfung ausstehend</Badge>;
    case 'approved':
      return <Badge variant="outline" className="bg-green-100 text-green-800">Genehmigt</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Abgelehnt</Badge>;
    case 'exported':
      return <Badge variant="outline" className="bg-purple-100 text-purple-800">Exportiert</Badge>;
    case 'archived':
      return <Badge variant="outline" className="bg-gray-300 text-gray-800">Archiviert</Badge>;
    default:
      return <Badge variant="outline">Unbekannt</Badge>;
  }
});

StatusBadge.displayName = "StatusBadge";

interface GoBDStatusBadgeProps {
  status: string;
}

export const GoBDStatusBadge = memo(({ status }: GoBDStatusBadgeProps) => {
  switch (status) {
    case 'red':
      return <Badge variant="destructive" className="bg-red-500">Nicht konform</Badge>;
    case 'yellow':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Prüfen</Badge>;
    case 'green':
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">GoBD-konform</Badge>;
    default:
      return <Badge variant="outline">Unbekannt</Badge>;
  }
});

GoBDStatusBadge.displayName = "GoBDStatusBadge";
