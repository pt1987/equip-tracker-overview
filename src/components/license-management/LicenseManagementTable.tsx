
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Edit, Trash2, Save, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

const ComplianceBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "compliant":
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Konform</Badge>;
    case "overused":
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Übernutzung</Badge>;
    case "underused":
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Unternutzung</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default function LicenseManagementTable() {
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

  // Fetch licenses data
  const { data: licenses, isLoading, isError, refetch } = useQuery({
    queryKey: ['licenseManagement'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('software_licenses')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data as LicenseData[];
    }
  });

  // Initialize editing licenses when licenses data changes
  React.useEffect(() => {
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
      
      // Calculate the status
      licenseToUpdate.status = calculateStatus(licenseToUpdate.total_licenses, licenseToUpdate.assigned_count);
      
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
      refetch();
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
      const { error } = await supabase
        .from('software_licenses')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Lizenz gelöscht",
        description: `Die Lizenz "${name}" wurde erfolgreich gelöscht.`,
      });
      
      refetch();
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
      
      // Calculate the status
      const status = calculateStatus(
        newLicense.total_licenses || 0,
        newLicense.assigned_count || 0
      );
      
      const { error } = await supabase
        .from('software_licenses')
        .insert({
          ...newLicense,
          status
        });
        
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
      refetch();
    } catch (error) {
      console.error('Error creating license:', error);
      toast({
        title: "Fehler",
        description: "Die Lizenz konnte nicht erstellt werden.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Softwarelizenzen</h2>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="border rounded-lg">
          <div className="p-4">
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">Fehler beim Laden der Lizenzdaten.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Softwarelizenzen</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Neue Lizenz
        </Button>
      </div>
      
      <div className="border rounded-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Lizenztyp</TableHead>
                <TableHead>Ablaufdatum</TableHead>
                <TableHead className="text-right">Anzahl</TableHead>
                <TableHead className="text-right">Zugewiesen</TableHead>
                <TableHead className="text-right">Kosten/Lizenz</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editingLicenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    Keine Lizenzdaten verfügbar.
                  </TableCell>
                </TableRow>
              ) : (
                editingLicenses.map((license, index) => (
                  <TableRow key={license.id}>
                    <TableCell>
                      {license.isEditing ? (
                        <Input 
                          value={license.name} 
                          onChange={(e) => handleInputChange(e, index, 'name')} 
                        />
                      ) : (
                        license.name
                      )}
                    </TableCell>
                    <TableCell>
                      {license.isEditing ? (
                        <Input 
                          value={license.license_type} 
                          onChange={(e) => handleInputChange(e, index, 'license_type')} 
                        />
                      ) : (
                        license.license_type
                      )}
                    </TableCell>
                    <TableCell>
                      {license.isEditing ? (
                        <Input 
                          type="date" 
                          value={license.expiry_date ? license.expiry_date.substring(0, 10) : ''} 
                          onChange={(e) => handleInputChange(e, index, 'expiry_date')} 
                        />
                      ) : (
                        license.expiry_date ? formatDate(license.expiry_date) : '-'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {license.isEditing ? (
                        <Input 
                          type="number" 
                          value={license.total_licenses} 
                          onChange={(e) => handleInputChange(e, index, 'total_licenses')} 
                        />
                      ) : (
                        license.total_licenses
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {license.isEditing ? (
                        <Input 
                          type="number" 
                          value={license.assigned_count} 
                          onChange={(e) => handleInputChange(e, index, 'assigned_count')} 
                        />
                      ) : (
                        license.assigned_count
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {license.isEditing ? (
                        <Input 
                          type="number" 
                          value={license.cost_per_license} 
                          onChange={(e) => handleInputChange(e, index, 'cost_per_license')} 
                        />
                      ) : (
                        formatCurrency(license.cost_per_license)
                      )}
                    </TableCell>
                    <TableCell>
                      <ComplianceBadge status={license.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {license.isEditing ? (
                        <div className="flex justify-end space-x-2">
                          <Button size="sm" variant="outline" onClick={() => saveLicense(index)}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => toggleEdit(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-2">
                          <Button size="sm" variant="outline" onClick={() => toggleEdit(index)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-500 hover:text-red-700" 
                            onClick={() => deleteLicense(license.id, license.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* New License Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neue Lizenz erstellen</DialogTitle>
            <DialogDescription>
              Fügen Sie eine neue Softwarelizenz zum Bestand hinzu.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">Name</label>
              <Input 
                id="name" 
                value={newLicense.name} 
                onChange={(e) => handleNewLicenseChange(e, 'name')} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="license_type" className="text-right">Lizenztyp</label>
              <Input 
                id="license_type" 
                value={newLicense.license_type} 
                onChange={(e) => handleNewLicenseChange(e, 'license_type')} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="expiry_date" className="text-right">Ablaufdatum</label>
              <Input 
                id="expiry_date" 
                type="date" 
                onChange={(e) => handleNewLicenseChange(e, 'expiry_date')} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="total_licenses" className="text-right">Anzahl</label>
              <Input 
                id="total_licenses" 
                type="number" 
                value={newLicense.total_licenses} 
                onChange={(e) => handleNewLicenseChange(e, 'total_licenses')} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="assigned_count" className="text-right">Zugewiesen</label>
              <Input 
                id="assigned_count" 
                type="number" 
                value={newLicense.assigned_count} 
                onChange={(e) => handleNewLicenseChange(e, 'assigned_count')} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="cost_per_license" className="text-right">Kosten/Lizenz</label>
              <Input 
                id="cost_per_license" 
                type="number" 
                value={newLicense.cost_per_license} 
                onChange={(e) => handleNewLicenseChange(e, 'cost_per_license')} 
                className="col-span-3" 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Abbrechen</Button>
            <Button onClick={createLicense}>Erstellen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
