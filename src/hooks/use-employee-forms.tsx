
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  createEmployeeForm, 
  getFormsByEmployeeId, 
  getFormById 
} from "@/data/employeeForms";
import { toast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LaptopIcon, FileText, AlertCircle } from "lucide-react";

// Hook for handling automatic form generation
export const useEmployeeForms = () => {
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [newFormData, setNewFormData] = useState<any>(null);
  const navigate = useNavigate();
  
  // Generate a new onboarding form
  const generateOnboardingForm = (employeeId: string, assetIds?: string[]) => {
    const existingForms = getFormsByEmployeeId(employeeId);
    const onboardingForms = existingForms.filter(f => 
      f.formType === "onboarding" && 
      (f.status === "draft" || f.status === "pending")
    );
    
    // If there's already a draft or pending onboarding form, show it instead
    if (onboardingForms.length > 0) {
      setNewFormData({
        id: onboardingForms[0].id,
        isExisting: true,
        formType: "onboarding"
      });
      setIsFormDialogOpen(true);
      return null;
    }
    
    // Create a new form
    const newForm = createEmployeeForm(employeeId, "onboarding", assetIds);
    if (newForm) {
      setNewFormData({
        id: newForm.id,
        isExisting: false,
        formType: "onboarding"
      });
      setIsFormDialogOpen(true);
      return newForm;
    }
    
    toast({
      title: "Formular konnte nicht erstellt werden",
      description: "Es gibt keine Assets, die diesem Mitarbeiter zugeordnet sind.",
      variant: "destructive"
    });
    
    return null;
  };
  
  // Generate a new offboarding form
  const generateOffboardingForm = (employeeId: string) => {
    const existingForms = getFormsByEmployeeId(employeeId);
    const offboardingForms = existingForms.filter(f => 
      f.formType === "offboarding" && 
      (f.status === "draft" || f.status === "pending")
    );
    
    // If there's already a draft or pending offboarding form, show it instead
    if (offboardingForms.length > 0) {
      setNewFormData({
        id: offboardingForms[0].id,
        isExisting: true,
        formType: "offboarding"
      });
      setIsFormDialogOpen(true);
      return null;
    }
    
    // Create a new form
    const newForm = createEmployeeForm(employeeId, "offboarding");
    if (newForm) {
      setNewFormData({
        id: newForm.id,
        isExisting: false,
        formType: "offboarding"
      });
      setIsFormDialogOpen(true);
      return newForm;
    }
    
    toast({
      title: "Formular konnte nicht erstellt werden",
      description: "Es gibt keine Assets, die diesem Mitarbeiter zugeordnet sind.",
      variant: "destructive"
    });
    
    return null;
  };
  
  // Handle navigation to the form
  const handleOpenForm = () => {
    if (newFormData) {
      navigate(`/form/${newFormData.id}`);
      setIsFormDialogOpen(false);
    }
  };
  
  // Form dialog component
  const FormDialog = () => (
    <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {newFormData?.formType === "onboarding" ? "Onboarding-Formular" : "Offboarding-Formular"}
          </DialogTitle>
          <DialogDescription>
            {newFormData?.isExisting 
              ? "Es existiert bereits ein Formular für diesen Mitarbeiter."
              : `Ein neues ${newFormData?.formType === "onboarding" ? "Onboarding" : "Offboarding"}-Formular wurde erstellt.`
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            {newFormData?.formType === "onboarding" 
              ? <LaptopIcon size={24} /> 
              : <FileText size={24} />
            }
          </div>
          <div>
            <h3 className="font-medium">
              {newFormData?.isExisting 
                ? "Bestehendes Formular öffnen" 
                : "Neues Formular erstellt"
              }
            </h3>
            <p className="text-sm text-muted-foreground">
              {newFormData?.isExisting 
                ? "Klicken Sie auf 'Öffnen', um das bestehende Formular anzuzeigen."
                : "Klicken Sie auf 'Öffnen', um das neue Formular zu bearbeiten und abzuschließen."
              }
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsFormDialogOpen(false)}>
            Später
          </Button>
          <Button onClick={handleOpenForm}>
            Öffnen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
  return {
    FormDialog,
    generateOnboardingForm,
    generateOffboardingForm,
    isFormDialogOpen
  };
};
