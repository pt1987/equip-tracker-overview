
import React from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Employee } from "@/lib/types";
import type { AssetFormValues } from "./AssetFormSchema";

interface AssetFormBasicInfoProps {
  employees: Employee[];
}

export default function AssetFormBasicInfo({ employees }: AssetFormBasicInfoProps) {
  const form = useFormContext<AssetFormValues>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kategorie</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Kategorie auswählen" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="notebook">Notebook</SelectItem>
                <SelectItem value="smartphone">Smartphone</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="mouse">Maus</SelectItem>
                <SelectItem value="keyboard">Tastatur</SelectItem>
                <SelectItem value="accessory">Zubehör</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Status auswählen" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="ordered">Bestellt</SelectItem>
                <SelectItem value="delivered">Geliefert</SelectItem>
                <SelectItem value="in_use">Aktiv</SelectItem>
                <SelectItem value="defective">Defekt</SelectItem>
                <SelectItem value="repair">In Reparatur</SelectItem>
                <SelectItem value="pool">Pool</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="manufacturer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hersteller</FormLabel>
            <FormControl>
              <Input placeholder="z.B. Apple, Dell, Logitech" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="model"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Modell</FormLabel>
            <FormControl>
              <Input placeholder="z.B. MacBook Pro, XPS 13" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="purchaseDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kaufdatum</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kaufpreis (€)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="0.00" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="vendor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Verkäufer</FormLabel>
            <FormControl>
              <Input placeholder="z.B. Amazon, MediaMarkt" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="assignedTo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Zugewiesen an</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Mitarbeiter auswählen" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="pool">Nicht zugewiesen (Pool)</SelectItem>
                {employees.map(employee => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
