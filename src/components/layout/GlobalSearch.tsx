
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { SearchService } from "./search/searchService";
import { SearchInput } from "./search/SearchInput";
import { SearchResultItem } from "./search/SearchResultItem";
import { SearchStates } from "./search/SearchStates";
import { NavigationUtils } from "./search/navigationUtils";
import { SearchResult, GlobalSearchProps } from "./search/types";

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const timeoutId = setTimeout(() => {
        performSearch(searchQuery);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setLoading(true);
    try {
      const searchResults = await SearchService.performSearch(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        variant: "destructive",
        title: "Suchfehler",
        description: "Es gab einen Fehler bei der Suche."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    NavigationUtils.handleResultClick(result, navigate, onClose);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Globale Suche
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <SearchInput 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClear={handleClearSearch}
          />

          <SearchStates 
            loading={loading}
            searchQuery={searchQuery}
            resultsCount={results.length}
          />

          {!loading && results.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result) => (
                <SearchResultItem
                  key={`${result.type}-${result.id}`}
                  result={result}
                  onClick={handleResultClick}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
