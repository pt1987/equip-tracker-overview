
import { Search } from "lucide-react";

interface SearchStatesProps {
  loading: boolean;
  searchQuery: string;
  resultsCount: number;
}

export function SearchStates({ loading, searchQuery, resultsCount }: SearchStatesProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (searchQuery.length >= 2 && resultsCount === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Keine Ergebnisse für "{searchQuery}" gefunden
      </div>
    );
  }

  if (searchQuery.length < 2) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Geben Sie mindestens 2 Zeichen ein, um zu suchen</p>
      </div>
    );
  }

  return null;
}
