
import { useState } from "react";
import { Asset, Employee } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ComplianceFormProps {
  formData: {
    classification: string;
    assetOwnerId: string;
    riskLevel: string;
    isPersonalData: boolean;
    lastReviewDate: string;
    nextReviewDate: string;
    lifecycleStage: string;
    disposalMethod: string;
    notes: string;
  };
  employees: Employee[];
  handleChange: (field: string, value: any) => void;
}

export default function ComplianceForm({ formData, employees, handleChange }: ComplianceFormProps) {
  return (
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
  );
}
