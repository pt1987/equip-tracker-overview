
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Assignment {
  id: string;
  license_id: string;
  employee_id: string;
  assigned_at: string;
  notes: string | null;
  employees: {
    first_name: string;
    last_name: string;
    position: string;
  };
}

interface LicenseAssignmentListProps {
  licenseId: string;
  onAssignmentRemoved: () => void;
}

export const LicenseAssignmentList = ({ 
  licenseId,
  onAssignmentRemoved 
}: LicenseAssignmentListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: assignments, isLoading, error } = useQuery({
    queryKey: ['licenseAssignments', licenseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('license_assignments')
        .select(`
          id,
          license_id,
          employee_id,
          assigned_at,
          notes,
          employees:employee_id(first_name, last_name, position)
        `)
        .eq('license_id', licenseId);
      
      if (error) throw error;
      return data as Assignment[] || [];
    },
    enabled: !!licenseId
  });

  const removeAssignment = async (assignmentId: string) => {
    try {
      // Get the license data to update the count
      const { data: licenseData } = await supabase
        .from('software_licenses')
        .select('assigned_count')
        .eq('id', licenseId)
        .single();
      
      if (!licenseData) throw new Error("Lizenz nicht gefunden");
      
      // Delete the assignment
      const { error: deleteError } = await supabase
        .from('license_assignments')
        .delete()
        .eq('id', assignmentId);
        
      if (deleteError) throw deleteError;
      
      // Update the assigned_count in software_licenses
      const newAssignedCount = Math.max(0, licenseData.assigned_count - 1);
      const { error: updateError } = await supabase
        .from('software_licenses')
        .update({ assigned_count: newAssignedCount })
        .eq('id', licenseId);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Lizenzzuweisung entfernt",
        description: "Die Lizenzzuweisung wurde erfolgreich entfernt."
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['licenseAssignments', licenseId] });
      onAssignmentRemoved();
    } catch (error) {
      console.error('Error removing license assignment:', error);
      toast({
        title: "Fehler",
        description: "Die Lizenzzuweisung konnte nicht entfernt werden.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Lade Zuweisungen...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4 text-center text-red-500">
        Fehler beim Laden der Lizenzzuweisungen.
      </div>
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        Keine Lizenzzuweisungen vorhanden.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mitarbeiter</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Zugewiesen am</TableHead>
            <TableHead>Notizen</TableHead>
            <TableHead className="text-right">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell>
                {assignment.employees?.last_name}, {assignment.employees?.first_name}
              </TableCell>
              <TableCell>
                {assignment.employees?.position}
              </TableCell>
              <TableCell>
                {new Date(assignment.assigned_at).toLocaleDateString('de-DE')}
              </TableCell>
              <TableCell>
                {assignment.notes || '-'}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => removeAssignment(assignment.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
