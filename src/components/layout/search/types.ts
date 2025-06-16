
export interface SearchResult {
  id: string;
  name: string;
  type: 'asset' | 'employee' | 'document';
  description?: string;
  metadata?: any;
}

export interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}
