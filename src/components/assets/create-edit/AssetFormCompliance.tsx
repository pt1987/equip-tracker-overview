import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/data/employees";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { AssetFormValues } from "./AssetFormSchema";

export default function AssetFormCompliance() {
  const form = useFormContext<AssetFormValues>();
  
  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">ISO 27001 Compliance</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Asset-Klassifikation und Compliance-Informationen gemäß ISO 27001
        </p>
      </div>

      <Separator className="my-4" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="classification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Informationsklassifizierung</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Klassifizierung wählen" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="public">Öffentlich</SelectItem>
                  <SelectItem value="internal">Intern</SelectItem>
                  <SelectItem value="confidential">Vertraulich</SelectItem>
                  <SelectItem value="restricted">Streng vertraulich</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Klassifizieren Sie die Informationen auf diesem Asset entsprechend ihrer Schutzbedürftigkeit
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="riskLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Risikostufe</FormLabel>
              <Select 
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Risiko wählen" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Niedrig</SelectItem>
                  <SelectItem value="medium">Mittel</SelectItem>
                  <SelectItem value="high">Hoch</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Bewerten Sie das Sicherheitsrisiko, das mit diesem Asset verbunden ist
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assetOwnerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset Owner</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Asset Owner wählen" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="not_assigned">Nicht zugewiesen</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Person, die für dieses Asset und dessen Sicherheit verantwortlich ist
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lifecycleStage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lebenszyklus-Phase</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Phase wählen" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="procurement">Beschaffung</SelectItem>
                  <SelectItem value="operation">Betrieb</SelectItem>
                  <SelectItem value="maintenance">Wartung</SelectItem>
                  <SelectItem value="disposal">Entsorgung</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Aktuelle Phase im Lebenszyklus dieses Assets
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastReviewDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Letzte Überprüfung</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                Datum der letzten Sicherheitsüberprüfung
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nextReviewDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nächste Überprüfung</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                Fälligkeitsdatum für die nächste Sicherheitsüberprüfung
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPersonalData"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Personenbezogene Daten</FormLabel>
                <FormDescription>
                  Enthält dieses Asset personenbezogene Daten gemäß DSGVO?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value as boolean}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="disposalMethod"
          render={({ field }) => (
            <FormItem className="col-span-1 md:col-span-2">
              <FormLabel>Entsorgungsmethode</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Z.B. Datenlöschung nach BSI-Standard, Hardwarerecycling"
                />
              </FormControl>
              <FormDescription>
                Methode zur sicheren Entsorgung am Ende des Lebenszyklus
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem className="col-span-1 md:col-span-2">
              <FormLabel>Compliance-Notizen</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Weitere Hinweise zur Compliance und Sicherheitsvorkehrungen"
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                Zusätzliche compliance-relevante Informationen
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
