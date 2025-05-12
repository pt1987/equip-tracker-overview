
import { useState } from "react";
import { Asset, AssetClassification, Employee } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/data/employees";
import { updateAsset } from "@/data/assets";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface ComplianceSectionProps {
  asset: Asset;
  onAssetUpdate: (updatedAsset: Asset) => void;
}

export default function ComplianceSection({ asset, onAssetUpdate }: ComplianceSectionProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    classification: asset.classification || 'internal',
    assetOwnerId: asset.assetOwnerId || 'not_assigned',
    riskLevel: asset.riskLevel || 'low',
    isPersonalData: asset.isPersonalData || false,
    lastReviewDate: asset.lastReviewDate || '',
    nextReviewDate: asset.nextReviewDate || '',
    lifecycleStage: asset.lifecycleStage || 'operation',
    disposalMethod: asset.disposalMethod || '',
    notes: asset.notes || '',
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedAsset = {
        ...asset,
        classification: formData.classification as AssetClassification,
        assetOwnerId: formData.assetOwnerId === 'not_assigned' ? '' : formData.assetOwnerId,
        riskLevel: formData.riskLevel as 'low' | 'medium' | 'high',
        isPersonalData: formData.isPersonalData,
        lastReviewDate: formData.lastReviewDate,
        nextReviewDate: formData.nextReviewDate,
        lifecycleStage: formData.lifecycleStage as 'procurement' | 'operation' | 'maintenance' | 'disposal',
        disposalMethod: formData.disposalMethod,
        notes: formData.notes,
      };

      await updateAsset(updatedAsset);
      onAssetUpdate(updatedAsset);
      setIsEditing(false);
      
      toast({
        title: "Compliance-Daten aktualisiert",
        description: "Die ISO 27001 Compliance-Daten wurden erfolgreich aktualisiert.",
      });
    } catch (error) {
      console.error("Error updating asset compliance data:", error);
      toast({
        variant: "destructive",
        title: "Fehler beim Speichern",
        description: "Die Compliance-Daten konnten nicht gespeichert werden.",
      });
    }
  };

  const getClassificationBadgeColor = (classification: AssetClassification | undefined) => {
    switch (classification) {
      case 'public': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'internal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'confidential': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'restricted': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getRiskLevelBadgeColor = (riskLevel: string | undefined) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getOwnerName = (ownerId: string | undefined) => {
    if (!ownerId) return "Nicht zugewiesen";
    const owner = employees.find(emp => emp.id === ownerId);
    return owner ? `${owner.firstName} ${owner.lastName}` : "Unbekannt";
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-medium">ISO 27001 Compliance</CardTitle>
          <CardDescription>
            Asset-Klassifikation und Compliance-Informationen
          </CardDescription>
        </div>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Bearbeiten
          </Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Abbrechen
            </Button>
            <Button size="sm" onClick={handleSave}>
              Speichern
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Klassifizierung</Label>
                <Select
                  value={formData.classification}
                  onValueChange={(value) => handleChange('classification', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Klassifizierung wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Öffentlich</SelectItem>
                    <SelectItem value="internal">Intern</SelectItem>
                    <SelectItem value="confidential">Vertraulich</SelectItem>
                    <SelectItem value="restricted">Streng vertraulich</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Asset Owner</Label>
                <Select
                  value={formData.assetOwnerId}
                  onValueChange={(value) => handleChange('assetOwnerId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Asset Owner wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_assigned">Nicht zugewiesen</SelectItem>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Risikostufe</Label>
                <Select
                  value={formData.riskLevel}
                  onValueChange={(value) => handleChange('riskLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Risikostufe wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Niedrig</SelectItem>
                    <SelectItem value="medium">Mittel</SelectItem>
                    <SelectItem value="high">Hoch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Lebenszyklus-Phase</Label>
                <Select
                  value={formData.lifecycleStage}
                  onValueChange={(value) => handleChange('lifecycleStage', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Lebenszyklus-Phase wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="procurement">Beschaffung</SelectItem>
                    <SelectItem value="operation">Betrieb</SelectItem>
                    <SelectItem value="maintenance">Wartung</SelectItem>
                    <SelectItem value="disposal">Entsorgung</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Letzte Überprüfung</Label>
                <Input
                  type="date"
                  value={formData.lastReviewDate}
                  onChange={(e) => handleChange('lastReviewDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Nächste Überprüfung</Label>
                <Input
                  type="date"
                  value={formData.nextReviewDate}
                  onChange={(e) => handleChange('nextReviewDate', e.target.value)}
                />
              </div>

              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label>Entsorgungsmethode (falls zutreffend)</Label>
                <Input
                  value={formData.disposalMethod}
                  onChange={(e) => handleChange('disposalMethod', e.target.value)}
                  placeholder="Z.B. Datenlöschung nach BSI-Standard, Hardwarerecycling"
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex items-center space-x-2">
                <Switch
                  checked={formData.isPersonalData}
                  onCheckedChange={(value) => handleChange('isPersonalData', value)}
                />
                <Label>Enthält personenbezogene Daten (DSGVO-relevant)</Label>
              </div>

              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label>Compliance-Notizen</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Weitere Hinweise zur Compliance"
                  rows={3}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Klassifizierung</p>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getClassificationBadgeColor(asset.classification as AssetClassification)}`}>
                  {asset.classification === 'public' && 'Öffentlich'}
                  {asset.classification === 'internal' && 'Intern'}
                  {asset.classification === 'confidential' && 'Vertraulich'}
                  {asset.classification === 'restricted' && 'Streng vertraulich'}
                  {!asset.classification && 'Nicht klassifiziert'}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Asset Owner</p>
                <p className="text-sm font-medium">{getOwnerName(asset.assetOwnerId)}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Risikostufe</p>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelBadgeColor(asset.riskLevel)}`}>
                  {asset.riskLevel === 'low' && 'Niedrig'}
                  {asset.riskLevel === 'medium' && 'Mittel'}
                  {asset.riskLevel === 'high' && 'Hoch'}
                  {!asset.riskLevel && 'Nicht bewertet'}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Lebenszyklus-Phase</p>
                <p className="text-sm font-medium">
                  {asset.lifecycleStage === 'procurement' && 'Beschaffung'}
                  {asset.lifecycleStage === 'operation' && 'Betrieb'}
                  {asset.lifecycleStage === 'maintenance' && 'Wartung'}
                  {asset.lifecycleStage === 'disposal' && 'Entsorgung'}
                  {!asset.lifecycleStage && 'Nicht angegeben'}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Letzte Überprüfung</p>
                <p className="text-sm font-medium flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {asset.lastReviewDate ? formatDate(asset.lastReviewDate) : 'Nie überprüft'}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Nächste Überprüfung</p>
                <p className="text-sm font-medium flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {asset.nextReviewDate ? formatDate(asset.nextReviewDate) : 'Nicht geplant'}
                </p>
              </div>

              {asset.disposalMethod && (
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <p className="text-sm text-muted-foreground">Entsorgungsmethode</p>
                  <p className="text-sm">{asset.disposalMethod}</p>
                </div>
              )}

              <div className="col-span-1 md:col-span-2 space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Personenbezogene Daten (DSGVO-relevant)</p>
                  <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${asset.isPersonalData ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`}>
                    {asset.isPersonalData ? 'Ja' : 'Nein'}
                  </div>
                </div>
              </div>

              {asset.notes && (
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <p className="text-sm text-muted-foreground">Compliance-Notizen</p>
                  <p className="text-sm">{asset.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
