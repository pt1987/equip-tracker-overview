
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { EmployeeForm } from "@/lib/types";
import { getFormsByEmployeeId } from "@/data/employeeForms";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ClipboardList, 
  Upload, 
  FileOutput 
} from "lucide-react";
import { useEmployeeForms } from "@/hooks/use-employee-forms";

interface EmployeeFormSectionProps {
  employeeId: string;
}

const EmployeeFormSection = ({ employeeId }: EmployeeFormSectionProps) => {
  const [forms, setForms] = useState<EmployeeForm[]>([]);
  const { 
    FormDialog, 
    generateOnboardingForm, 
    generateOffboardingForm 
  } = useEmployeeForms();
  
  useEffect(() => {
    const employeeForms = getFormsByEmployeeId(employeeId);
    setForms(employeeForms);
  }, [employeeId]);
  
  const handleCreateOnboarding = () => {
    generateOnboardingForm(employeeId);
  };
  
  const handleCreateOffboarding = () => {
    generateOffboardingForm(employeeId);
  };
  
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
  
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <ClipboardList size={18} />
          <h2 className="text-lg font-semibold">Formulare</h2>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCreateOnboarding} className="gap-1">
            <Upload size={14} />
            <span className="hidden sm:inline">Onboarding</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleCreateOffboarding} className="gap-1">
            <FileOutput size={14} />
            <span className="hidden sm:inline">Offboarding</span>
          </Button>
        </div>
      </div>
      
      {forms.length > 0 ? (
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
                      {form.formType === "onboarding" ? "Onboarding" : "Offboarding"}
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
      ) : (
        <div className="text-center p-6 bg-secondary/10 rounded-lg border border-dashed border-secondary">
          <FileText className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">
            Keine Formulare vorhanden
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Erstellen Sie ein Onboarding- oder Offboarding-Formular
          </p>
        </div>
      )}
      
      <FormDialog />
    </div>
  );
};

export default EmployeeFormSection;
