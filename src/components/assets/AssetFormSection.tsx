
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { EmployeeForm } from "@/lib/types";
import { searchForms } from "@/data/employeeForms";
import { 
  FileText, 
  Download, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ClipboardList
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AssetFormSectionProps {
  assetId: string;
}

const AssetFormSection = ({ assetId }: AssetFormSectionProps) => {
  const [forms, setForms] = useState<EmployeeForm[]>([]);
  
  useEffect(() => {
    // Find forms that include this asset
    const allForms = searchForms();
    const relatedForms = allForms.filter(form => 
      form.assets.some(asset => asset.assetId === assetId)
    );
    
    setForms(relatedForms);
  }, [assetId]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-700 flex items-center gap-1">
            <Clock size={12} /> Entwurf
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700 flex items-center gap-1">
            <Clock size={12} /> Ausstehend
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-700 flex items-center gap-1">
            <CheckCircle2 size={12} /> Abgeschlossen
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-700 flex items-center gap-1">
            <XCircle size={12} /> Abgebrochen
          </Badge>
        );
      default:
        return null;
    }
  };
  
  if (forms.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ClipboardList size={18} />
        <h2 className="text-lg font-semibold">Zugehörige Formulare</h2>
      </div>
      
      <div className="space-y-3">
        {forms.map((form) => (
          <Link
            key={form.id}
            to={`/form/${form.id}`}
            className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-background">
                <FileText size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {form.formType === "onboarding" ? "Onboarding" : "Offboarding"}: {form.employeeName}
                  </span>
                  {getStatusBadge(form.status)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(form.createdDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {form.documentUrl && (
              <Button variant="ghost" size="icon" className="text-primary h-8 w-8">
                <Download size={14} />
              </Button>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AssetFormSection;
