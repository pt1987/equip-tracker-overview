
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface LicenseData {
  id: string;
  name: string;
  license_type: string;
  expiry_date: string | null;
  total_licenses: number;
  assigned_count: number;
  cost_per_license: number;
  status: string;
}

interface EditableLicenseData extends LicenseData {
  isEditing?: boolean;
}

export const useLicenseManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLicenses, setEditingLicenses] = useState<EditableLicenseData[]>([]);
  const [newLicense, setNewLicense] = useState<Partial<LicenseData>>({
    name: "",
    license_type: "Subscription",
    total_licenses: 1,
    assigned_count: 0,
    cost_per_license: 0,
    status: "compliant"
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: licenses, isLoading, isError, refetch } = useQuery({
    queryKey: ['softwareLicenses'],
    queryFn: async () => {
      console.log("Management: Fetching license management data");
      const { data, error } = await supabase
        .from('software_licenses')
        .select('*')
        .order('name');
        
      if (error) {
        console.error("Error fetching license data:", error);
        throw error;
      }
      
      console.log("Management: License data fetched:", data);
      return data as LicenseData[];
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    if (licenses) {
      setEditingLicenses(licenses.map(license => ({
        ...license,
        isEditing: false
      })));
    }
  }, [licenses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: keyof LicenseData) => {
    const newEditingLicenses = [...editingLicenses];
    
    if (field === 'total_licenses' || field === 'assigned_count' || field === 'cost_per_license') {
      newEditingLicenses[index][field] = Number(e.target.value);
    } else {
      newEditingLicenses[index][field] = e.target.value as any;
    }
    
    setEditingLicenses(newEditingLicenses);
  };

  const handleNewLicenseChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof LicenseData) => {
    const value = field === 'total_licenses' || field === 'assigned_count' || field === 'cost_per_license'
      ? Number(e.target.value)
      : e.target.value;
      
    setNewLicense({
      ...newLicense,
      [field]: value
    });
  };
  
  const calculateStatus = (totalLicenses: number, assignedCount: number): string => {
    if (assignedCount > totalLicenses) {
      return 'overused';
    } else if (assignedCount < totalLicenses * 0.8) {
      return 'underused';
    } else {
      return 'compliant';
    }
  };

  const toggleEdit = (index: number) => {
    const newEditingLicenses = [...editingLicenses];
    newEditingLicenses[index].isEditing = !newEditingLicenses[index].isEditing;
    setEditingLicenses(newEditingLicenses);
  };

  const saveLicense = async (index: number) => {
    try {
      const licenseToUpdate = {...editingLicenses[index]};
      delete licenseToUpdate.isEditing;
      
      licenseToUpdate.status = calculateStatus(licenseToUpdate.total_licenses, licenseToUpdate.assigned_count);
      
      console.log("Updating license:", licenseToUpdate);
      
      const { error } = await supabase
        .from('software_licenses')
        .update(licenseToUpdate)
        .eq('id', licenseToUpdate.id);
        
      if (error) throw error;
      
      toast({
        title: "Lizenz aktualisiert",
        description: `Die Lizenz "${licenseToUpdate.name}" wurde erfolgreich aktualisiert.`,
      });
      
      toggleEdit(index);
      
      queryClient.invalidateQueries({ queryKey: ['softwareLicenses'] });
      
      await refetch();
    } catch (error) {
      console.error('Error updating license:', error);
      toast({
        title: "Fehler",
        description: "Die Lizenz konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    }
  };

  const deleteLicense = async (id: string, name: string) => {
    try {
      console.log("Deleting license:", id);
      
      const { error } = await supabase
        .from('software_licenses')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Lizenz gelöscht",
        description: `Die Lizenz "${name}" wurde erfolgreich gelöscht.`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['softwareLicenses'] });
      
      await refetch();
    } catch (error) {
      console.error('Error deleting license:', error);
      toast({
        title: "Fehler",
        description: "Die Lizenz konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
  };

  const createLicense = async () => {
    try {
      if (!newLicense.name || !newLicense.license_type) {
        toast({
          title: "Fehler",
          description: "Name und Lizenztyp sind erforderlich.",
          variant: "destructive",
        });
        return;
      }
      
      const status = calculateStatus(
        newLicense.total_licenses || 0,
        newLicense.assigned_count || 0
      );
      
      const licenseToCreate = {
        name: newLicense.name,                   
        license_type: newLicense.license_type,    
        total_licenses: newLicense.total_licenses || 0,
        assigned_count: newLicense.assigned_count || 0,
        cost_per_license: newLicense.cost_per_license || 0,
        status: status,
        expiry_date: newLicense.expiry_date || null
      };
      
      console.log("Creating new license:", licenseToCreate);
      
      const { error } = await supabase
        .from('software_licenses')
        .insert(licenseToCreate);
        
      if (error) throw error;
      
      toast({
        title: "Lizenz erstellt",
        description: `Die Lizenz "${newLicense.name}" wurde erfolgreich erstellt.`,
      });
      
      setNewLicense({
        name: "",
        license_type: "Subscription",
        total_licenses: 1,
        assigned_count: 0,
        cost_per_license: 0,
        status: "compliant"
      });
      
      setIsDialogOpen(false);
      
      queryClient.invalidateQueries({ queryKey: ['softwareLicenses'] });
      
      await refetch();
    } catch (error) {
      console.error('Error creating license:', error);
      toast({
        title: "Fehler",
        description: "Die Lizenz konnte nicht erstellt werden.",
        variant: "destructive",
      });
    }
  };

  return {
    licenses,
    isLoading,
    isError,
    editingLicenses,
    newLicense,
    isDialogOpen,
    setIsDialogOpen,
    handleInputChange,
    handleNewLicenseChange,
    toggleEdit,
    saveLicense,
    deleteLicense,
    createLicense
  };
};
