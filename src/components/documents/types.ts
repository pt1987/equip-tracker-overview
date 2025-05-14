
export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadDate: string;
  category: "invoice" | "warranty" | "repair" | "manual" | "other";
  thumbnail?: string;
  version?: number;
  createdBy?: string;
  description?: string;
  tags?: string[];
  previewAvailable?: boolean;
}
