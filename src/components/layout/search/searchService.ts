
import { supabase } from "@/integrations/supabase/client";
import { SearchResult } from "./types";

export class SearchService {
  static async searchAssets(query: string): Promise<SearchResult[]> {
    const { data: assets, error } = await supabase
      .from('assets')
      .select('id, name, type, serial_number, model')
      .or(`name.ilike.%${query}%, serial_number.ilike.%${query}%, model.ilike.%${query}%`)
      .limit(10);

    if (error || !assets) return [];

    return assets.map(asset => ({
      id: asset.id,
      name: asset.name,
      type: 'asset' as const,
      description: `${asset.type} - ${asset.model || 'Unbekanntes Modell'}`,
      metadata: asset
    }));
  }

  static async searchEmployees(query: string): Promise<SearchResult[]> {
    const { data: employees, error } = await supabase
      .from('employees')
      .select('id, first_name, last_name, email, cluster')
      .or(`first_name.ilike.%${query}%, last_name.ilike.%${query}%, email.ilike.%${query}%`)
      .limit(10);

    if (error || !employees) return [];

    return employees.map(employee => ({
      id: employee.id,
      name: `${employee.first_name} ${employee.last_name}`,
      type: 'employee' as const,
      description: `${employee.email} - ${employee.cluster || 'Kein Cluster'}`,
      metadata: employee
    }));
  }

  static async searchDocuments(query: string): Promise<SearchResult[]> {
    try {
      const { data: documents, error } = await supabase.storage
        .from('asset-documents')
        .list('', { limit: 100 });

      if (error || !documents) return [];

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
      return matchingDocs.slice(0, 10);
    } catch (error) {
      console.log('Error searching documents:', error);
      return [];
    }
  }

  static async performSearch(query: string): Promise<SearchResult[]> {
    const [assets, employees, documents] = await Promise.all([
      this.searchAssets(query),
      this.searchEmployees(query),
      this.searchDocuments(query)
    ]);

    return [...assets, ...employees, ...documents];
  }
}
