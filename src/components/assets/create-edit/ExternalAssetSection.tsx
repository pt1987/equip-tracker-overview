
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEmployees } from "@/data/employees";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import type { AssetFormValues } from "./AssetFormSchema";

export default function ExternalAssetSection() {
  const form = useFormContext<AssetFormValues>();
  const isExternal = form.watch("isExternal");
  const ownerCompany = form.watch("ownerCompany");
  
  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees
  });
  
  // Set default owner company to PHAT if not already set
  useEffect(() => {
    if (!ownerCompany) {
      form.setValue("ownerCompany", "PHAT Consulting GmbH");
    }
  }, [ownerCompany, form]);
  
  // Update isExternal flag automatically based on owner company
  useEffect(() => {
    const isExternalOwner = ownerCompany && ownerCompany !== "PHAT Consulting GmbH";
    if (isExternalOwner !== isExternal) {
      form.setValue("isExternal", isExternalOwner);
    }
  }, [ownerCompany, isExternal, form]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Eigentumsverhältnis</h3>
        {isExternal && (
          <Badge 
            variant="outline" 
            className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
          >
            <AlertTriangle className="mr-1 h-3 w-3" />
            Externes Asset
          </Badge>
        )}
      </div>
      
      <FormField
        control={form.control}
        name="ownerCompany"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Eigentümerfirma</FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || "PHAT Consulting GmbH"}
                value={field.value || "PHAT Consulting GmbH"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Eigentümerfirma wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PHAT Consulting GmbH">PHAT Consulting GmbH</SelectItem>
                  <SelectItem value="Kunde A GmbH">Kunde A GmbH</SelectItem>
                  <SelectItem value="Kunde B AG">Kunde B AG</SelectItem>
                  <SelectItem value="Kunde C SE">Kunde C SE</SelectItem>
                  <SelectItem value="other">Andere...</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Die Eigentümerfirma bestimmt, ob es sich um ein internes oder externes Asset handelt
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {ownerCompany === "other" && (
        <FormField
          control={form.control}
          name="ownerCompany"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Andere Eigentümerfirma</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Name der Eigentümerfirma" 
                  {...field} 
                  value={field.value !== "other" ? field.value : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {isExternal && (
        <>
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Projekt-ID</FormLabel>
                <FormControl>
                  <Input placeholder="z.B. PRJ-12345" {...field} />
                </FormControl>
                <FormDescription>
                  Die zugehörige Kundenprojekt-ID für dieses externe Asset
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="responsibleEmployeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verantwortlicher Mitarbeiter</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Mitarbeiter wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Der PHAT-Mitarbeiter, der für dieses externe Asset verantwortlich ist
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="handoverToEmployeeDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Übergabedatum an Mitarbeiter</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  Datum, an dem das externe Asset an den PHAT-Mitarbeiter übergeben wurde
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="plannedReturnDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Geplantes Rückgabedatum</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  Geplantes Datum für die Rückgabe des externen Assets an den Kunden
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="actualReturnDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tatsächliches Rückgabedatum</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  Tatsächliches Datum der Rückgabe des externen Assets (falls bereits erfolgt)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
}
