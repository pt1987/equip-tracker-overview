
import { useState, useMemo } from "react";
import { Document } from "./types";
import { DocumentItem } from "./DocumentItem";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DocumentListProps {
  documents: Document[];
  onDeleteDocument: (documentId: string, docName: string) => Promise<void>;
  onPreviewDocument?: (document: Document) => void;
}

export function DocumentList({
  documents,
  onDeleteDocument,
  onPreviewDocument
}: DocumentListProps) {
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter documents based on active category and search query
  const filteredDocuments = useMemo(() => {
    // Remove duplicates
    const uniqueDocs = documents.reduce((acc: Document[], current) => {
      const existingDocIndex = acc.findIndex(doc => doc.id === current.id);
      if (existingDocIndex === -1) {
        acc.push(current);
      }
      return acc;
    }, []);
    
    return uniqueDocs.filter(doc => {
      // Apply category filter
      const matchesCategory = activeCategory === "all" || doc.category === activeCategory;
      
      // Apply search filter
      const matchesSearch = searchQuery.trim() === "" || 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }, [documents, activeCategory, searchQuery]);

  // Count documents per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: documents.length };
    
    documents.forEach(doc => {
      if (counts[doc.category]) {
        counts[doc.category]++;
      } else {
        counts[doc.category] = 1;
      }
    });
    
    return counts;
  }, [documents]);
  
  if (documents.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        Keine Dokumente vorhanden
      </div>
    );
  }
  
  // Get category name
  const getCategoryName = (category: string): string => {
    switch (category) {
      case "invoice": return "Rechnungen";
      case "warranty": return "Garantien";
      case "repair": return "Reparaturen";
      case "manual": return "Handbücher";
      case "other": return "Sonstiges";
      default: return "Alle";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Dokumente suchen..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="mb-4 w-full sm:w-auto overflow-auto">
          <TabsTrigger value="all">
            Alle ({categoryCounts.all || 0})
          </TabsTrigger>
          {["invoice", "warranty", "repair", "manual", "other"].filter(cat => categoryCounts[cat]).map(category => (
            <TabsTrigger key={category} value={category}>
              {getCategoryName(category)} ({categoryCounts[category] || 0})
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeCategory} className="mt-0">
          <div className={`space-y-${isMobile ? '1.5' : '2'} max-h-[350px] overflow-y-auto pr-1`}>
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map(doc => (
                <DocumentItem 
                  key={doc.id} 
                  document={doc} 
                  onDelete={onDeleteDocument}
                />
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">
                {searchQuery ? "Keine Dokumente gefunden" : "Keine Dokumente in dieser Kategorie"}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
