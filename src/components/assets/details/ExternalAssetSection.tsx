
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, AlertTriangle, Edit, Save, X } from "lucide-react";
import { Asset, Employee } from "@/lib/types";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getEmployeeById } from "@/data/employees";
import { updateAsset } from "@/data/assets";
import { useToast } from "@/hooks/use-toast";

interface ExternalAssetSectionProps {
  asset: Asset;
  onAssetUpdate: (updatedAsset: Asset) => void;
}

export default function ExternalAssetSection({ asset, onAssetUpdate }: ExternalAssetSectionProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    plannedReturnDate: asset.plannedReturnDate || "",
    actualReturnDate: asset.actualReturnDate || "",
    notes: asset.notes || "",
  });
  
  const { data: responsibleEmployee } = useQuery({
    queryKey: ["employee", asset.responsibleEmployeeId],
    queryFn: () => asset.responsibleEmployeeId ? getEmployeeById(asset.responsibleEmployeeId) : null,
    enabled: !!asset.responsibleEmployeeId
  });
  
  if (!asset.isExternal) {
    return null;
  }
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = async () => {
    try {
      const updatedAsset = {
        ...asset,
        plannedReturnDate: formData.plannedReturnDate,
        actualReturnDate: formData.actualReturnDate,
        notes: formData.notes,
      };
      
      await updateAsset(updatedAsset);
      onAssetUpdate(updatedAsset);
      setIsEditing(false);
      
      toast({
        title: "Externes Asset aktualisiert",
        description: "Die Daten des externen Assets wurden erfolgreich aktualisiert.",
      });
    } catch (error) {
      console.error("Error updating external asset:", error);
      toast({
        variant: "destructive",
        title: "Fehler beim Speichern",
        description: "Die Daten des externen Assets konnten nicht gespeichert werden.",
      });
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Nicht gesetzt";
    try {
      return format(new Date(dateString), "dd.MM.yyyy");
    } catch (e) {
      return "Ungültiges Datum";
    }
  };
  
  return (
    <Card className="border-amber-300 shadow-sm">
      <CardHeader className="pb-3 flex flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Externes Kundeneigentum</CardTitle>
          <Badge 
            variant="outline" 
            className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
          >
            <AlertTriangle className="mr-1 h-3 w-3" />
            Extern
          </Badge>
        </div>
        
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-1" />
            Bearbeiten
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              <X className="h-4 w-4 mr-1" />
              Abbrechen
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Speichern
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-muted-foreground text-sm">Eigentümerfirma</Label>
            <p className="font-medium">{asset.ownerCompany || "Nicht gesetzt"}</p>
          </div>
          
          <div className="space-y-1">
            <Label className="text-muted-foreground text-sm">Projekt-ID</Label>
            <p className="font-medium">{asset.projectId || "Nicht gesetzt"}</p>
          </div>
          
          <div className="space-y-1">
            <Label className="text-muted-foreground text-sm">Verantwortlicher Mitarbeiter</Label>
            <p className="font-medium">
              {responsibleEmployee 
                ? `${responsibleEmployee.firstName} ${responsibleEmployee.lastName}` 
                : "Nicht zugewiesen"}
            </p>
          </div>
          
          <div className="space-y-1">
            <Label className="text-muted-foreground text-sm">Übergabedatum</Label>
            <p className="font-medium flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(asset.handoverToEmployeeDate)}
            </p>
          </div>
          
          {isEditing ? (
            <>
              <div className="space-y-1">
                <Label htmlFor="plannedReturnDate">Geplantes Rückgabedatum</Label>
                <Input 
                  id="plannedReturnDate"
                  type="date" 
                  value={formData.plannedReturnDate} 
                  onChange={(e) => handleChange("plannedReturnDate", e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="actualReturnDate">Tatsächliches Rückgabedatum</Label>
                <Input 
                  id="actualReturnDate"
                  type="date" 
                  value={formData.actualReturnDate} 
                  onChange={(e) => handleChange("actualReturnDate", e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-sm">Geplantes Rückgabedatum</Label>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(asset.plannedReturnDate)}
                </p>
              </div>
              
              <div className="space-y-1">
                <Label className="text-muted-foreground text-sm">Tatsächliches Rückgabedatum</Label>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {asset.actualReturnDate ? formatDate(asset.actualReturnDate) : "Noch nicht zurückgegeben"}
                </p>
              </div>
            </>
          )}
        </div>
        
        {isEditing && (
          <div className="space-y-1 pt-2">
            <Label htmlFor="notes">Notizen</Label>
            <Input 
              id="notes"
              value={formData.notes} 
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Zusätzliche Informationen zum externen Asset"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
