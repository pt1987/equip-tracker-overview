
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEmployeesList } from "../hooks/useEmployeesList";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LicenseAssignmentDialogProps {
  licenseId: string;
  licenseName: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onAssignmentComplete: () => void;
  currentAssignedCount: number;
  totalLicenses: number;
}

export const LicenseAssignmentDialog = ({
  licenseId,
  licenseName,
  isOpen,
  setIsOpen,
  onAssignmentComplete,
  currentAssignedCount,
  totalLicenses
}: LicenseAssignmentDialogProps) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { employees, isLoading: loadingEmployees, error } = useEmployeesList();
  const { toast } = useToast();
  const [existingAssignments, setExistingAssignments] = useState<string[]>([]);

  // Fetch current license assignments to disable already assigned employees
  useEffect(() => {
    if (isOpen && licenseId) {
      const fetchAssignments = async () => {
        const { data, error } = await supabase
          .from('license_assignments')
          .select('employee_id')
          .eq('license_id', licenseId);
          
        if (!error && data) {
          setExistingAssignments(data.map(assignment => assignment.employee_id));
        }
      };
      
      fetchAssignments();
    }
  }, [licenseId, isOpen]);

  const handleAssign = async () => {
    if (!selectedEmployeeId) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie einen Mitarbeiter aus.",
        variant: "destructive"
      });
      return;
    }

    if (currentAssignedCount >= totalLicenses) {
      toast({
        title: "Fehler",
        description: "Alle Lizenzen sind bereits zugewiesen. Erhöhen Sie die Gesamtanzahl der Lizenzen oder entfernen Sie bestehende Zuweisungen.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert new assignment
      const { error: insertError } = await supabase
        .from('license_assignments')
        .insert({
          license_id: licenseId,
          employee_id: selectedEmployeeId,
          notes
        });
        
      if (insertError) throw insertError;
      
      // Update assigned_count in software_licenses
      const { error: updateError } = await supabase
        .from('software_licenses')
        .update({ assigned_count: currentAssignedCount + 1 })
        .eq('id', licenseId);
        
      if (updateError) throw updateError;

      toast({
        title: "Lizenz zugewiesen",
        description: `Die Lizenz "${licenseName}" wurde erfolgreich zugewiesen.`
      });
      
      onAssignmentComplete();
      setIsOpen(false);
      setSelectedEmployeeId("");
      setNotes("");
    } catch (error) {
      console.error('Error assigning license:', error);
      toast({
        title: "Fehler",
        description: "Die Lizenz konnte nicht zugewiesen werden.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Lizenz zuweisen</DialogTitle>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              Fehler beim Laden der Mitarbeiterdaten. Bitte versuchen Sie es später erneut.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Lizenz</label>
            <div className="p-2 border rounded-md bg-muted/20">{licenseName}</div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="employee" className="text-sm font-medium">Mitarbeiter</label>
            {loadingEmployees ? (
              <div className="flex items-center justify-center p-2">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Lade Mitarbeiter...</span>
              </div>
            ) : (
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Wählen Sie einen Mitarbeiter" />
                </SelectTrigger>
                <SelectContent>
                  {employees?.map((employee) => (
                    <SelectItem 
                      key={employee.id} 
                      value={employee.id}
                      disabled={existingAssignments.includes(employee.id)}
                    >
                      {employee.last_name}, {employee.first_name} - {employee.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">Notizen (optional)</label>
            <Textarea
              id="notes"
              placeholder="Weitere Informationen zur Lizenzzuweisung"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {currentAssignedCount >= totalLicenses && (
            <Alert variant="warning">
              <AlertDescription>
                Alle verfügbaren Lizenzen sind bereits zugewiesen. Erhöhen Sie die Gesamtanzahl der Lizenzen, um weitere Zuweisungen vorzunehmen.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
            Abbrechen
          </Button>
          <Button onClick={handleAssign} disabled={isSubmitting || !selectedEmployeeId}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Zuweisen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
