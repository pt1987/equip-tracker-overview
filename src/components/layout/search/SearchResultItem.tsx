
import { Package, Users, FileText, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SearchResult } from "./types";

interface SearchResultItemProps {
  result: SearchResult;
  onClick: (result: SearchResult) => void;
}

export function SearchResultItem({ result, onClick }: SearchResultItemProps) {
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'asset': return <Package className="h-4 w-4" />;
      case 'employee': return <Users className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'asset': return 'Asset';
      case 'employee': return 'Mitarbeiter';
      case 'document': return 'Dokument';
      default: return type;
    }
  };

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onClick(result)}
    >
      <div className="flex-shrink-0">
        {getResultIcon(result.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm truncate">{result.name}</h4>
          <Badge variant="secondary" className="text-xs">
            {getTypeLabel(result.type)}
          </Badge>
        </div>
        {result.description && (
          <p className="text-xs text-muted-foreground truncate">
            {result.description}
          </p>
        )}
      </div>
    </div>
  );
}
