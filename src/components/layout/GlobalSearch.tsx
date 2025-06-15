
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Users, FileText, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SearchResult {
  id: string;
  name: string;
  type: 'asset' | 'employee' | 'document';
  description?: string;
  metadata?: any;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

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
      const searchResults: SearchResult[] = [];

      // Search Assets
      const { data: assets, error: assetsError } = await supabase
        .from('assets')
        .select('id, name, type, serial_number, model')
        .or(`name.ilike.%${query}%, serial_number.ilike.%${query}%, model.ilike.%${query}%`)
        .limit(10);

      if (!assetsError && assets) {
        searchResults.push(...assets.map(asset => ({
          id: asset.id,
          name: asset.name,
          type: 'asset' as const,
          description: `${asset.type} - ${asset.model || 'Unbekanntes Modell'}`,
          metadata: asset
        })));
      }

      // Search Employees
      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select('id, first_name, last_name, email, department')
        .or(`first_name.ilike.%${query}%, last_name.ilike.%${query}%, email.ilike.%${query}%`)
        .limit(10);

      if (!employeesError && employees) {
        searchResults.push(...employees.map(employee => ({
          id: employee.id,
          name: `${employee.first_name} ${employee.last_name}`,
          type: 'employee' as const,
          description: `${employee.email} - ${employee.department || 'Keine Abteilung'}`,
          metadata: employee
        })));
      }

      // Search Documents (from storage metadata)
      try {
        const { data: documents, error: documentsError } = await supabase.storage
          .from('asset-documents')
          .list('', { limit: 100 });

        if (!documentsError && documents) {
          const matchingDocs = [];
          for (const folder of documents) {
            if (folder.name && !folder.name.includes('.')) {
              const { data: files } = await supabase.storage
                .from('asset-documents')
                .list(folder.name, { limit: 50 });
              
              if (files) {
                files.forEach(file => {
                  if (file.name && file.name.toLowerCase().includes(query.toLowerCase())) {
                    const originalName = file.name.split('_').slice(-1)[0] || file.name;
                    matchingDocs.push({
                      id: file.id || `${folder.name}/${file.name}`,
                      name: originalName,
                      type: 'document' as const,
                      description: `Asset: ${folder.name}`,
                      metadata: { assetId: folder.name, fileName: file.name }
                    });
                  }
                });
              }
            }
          }
          searchResults.push(...matchingDocs.slice(0, 10));
        }
      } catch (error) {
        console.log('Error searching documents:', error);
      }

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
    switch (result.type) {
      case 'asset':
        navigate(`/assets/${result.id}`);
        break;
      case 'employee':
        navigate(`/employees/${result.id}`);
        break;
      case 'document':
        if (result.metadata?.assetId) {
          navigate(`/assets/${result.metadata.assetId}`);
        }
        break;
    }
    onClose();
  };

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Globale Suche
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Nach Assets, Mitarbeitern oder Dokumenten suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          )}

          {!loading && searchQuery.length >= 2 && results.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Keine Ergebnisse für "{searchQuery}" gefunden
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result) => (
                <div
                  key={`${result.type}-${result.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleResultClick(result)}
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
              ))}
            </div>
          )}

          {searchQuery.length < 2 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Geben Sie mindestens 2 Zeichen ein, um zu suchen</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
