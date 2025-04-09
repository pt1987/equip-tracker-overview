
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { getEmployees } from "@/data/employees";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription,
  FormMessage 
} from "@/components/ui/form";
import { hardwareCategoryInfo } from "@/lib/hardware-order-types";

export function HardwareOrderForm() {
  const { control } = useFormContext();
  const [employeeOptions, setEmployeeOptions] = useState<{label: string, value: string}[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeeData = await getEmployees();
        const options = employeeData.map(employee => ({
          label: `${employee.firstName} ${employee.lastName}`,
          value: employee.id
        }));
        setEmployeeOptions(options);
      } catch (error) {
        console.error("Error loading employees:", error);
        setEmployeeOptions([]);
      }
    };
    
    fetchEmployees();
  }, []);

  return (
    <CardContent className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="articleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Artikelname</FormLabel>
              <FormControl>
                <Input placeholder="z.B. MacBook Pro 16&quot;" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="articleConfiguration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konfiguration</FormLabel>
              <FormControl>
                <Input placeholder="z.B. M2 Max, 32GB RAM, 1TB SSD" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="articleCategory"
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
                  {Object.entries(hardwareCategoryInfo).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      {info.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                {field.value && hardwareCategoryInfo[field.value as keyof typeof hardwareCategoryInfo]?.description}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="estimatedPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Geschätzter Preis (€)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="z.B. 2500" 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={control}
          name="articleLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link zum Artikel</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>Link zur Produktseite des Artikels</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mitarbeiter</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Mitarbeiter auswählen" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {employeeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="justification"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Begründung</FormLabel>
            <FormControl>
              <Textarea placeholder="Begründung für die Bestellung..." {...field} />
            </FormControl>
            <FormDescription>
              Bitte geben Sie eine Begründung an, wenn es sich um eine Sonderbestellung handelt.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  );
}
