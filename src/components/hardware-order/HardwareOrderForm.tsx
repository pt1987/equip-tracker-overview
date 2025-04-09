
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
import { useFormContext, useWatch } from "react-hook-form";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleDollarSign, HelpCircle, InfoIcon } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

export function HardwareOrderForm() {
  const { control } = useFormContext();
  const [employeeOptions, setEmployeeOptions] = useState<{label: string, value: string}[]>([]);
  const selectedCategory = useWatch({ control, name: "articleCategory" });
  const estimatedPrice = useWatch({ control, name: "estimatedPrice" });

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
      <Alert className="bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Device Budget - Wichtige Information</AlertTitle>
        <AlertDescription className="text-sm">
          Nach Beendigung der Probezeit stehen 3950€ (brutto) zur Verfügung. Jährlich kommen dann 950€ (brutto) hinzu. 
          Ab dem 01.01.2025 ist ein Überziehen des Device Budgets nicht mehr möglich. 
          Das maximale Budget beträgt 5000€ (brutto).
        </AlertDescription>
      </Alert>

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
              <FormLabel className="flex items-center gap-1">
                Kategorie
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>Beachten Sie die Budget-Richtlinien für jede Kategorie.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
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
              <FormLabel className="flex items-center gap-1">
                Geschätzter Preis (€)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Der Betrag wird von Ihrem verfügbaren Budget abgezogen.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
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

      {selectedCategory === 'smartphone' && estimatedPrice > 1000 && (
        <Alert className="bg-amber-50 border-amber-200">
          <InfoIcon className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Smartphone Budgethinweis</AlertTitle>
          <AlertDescription className="text-amber-700 text-sm">
            Smartphones über 1000€ brutto erfordern eine Begründung und Genehmigung.
          </AlertDescription>
        </Alert>
      )}

      {selectedCategory === 'special' && (
        <Alert className="bg-amber-50 border-amber-200">
          <InfoIcon className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Sonderbestellung</AlertTitle>
          <AlertDescription className="text-amber-700 text-sm">
            Sonderbestellungen wie teure Smartphones, iPads oder tragbare Monitore erfordern eine Begründung und Genehmigung.
          </AlertDescription>
        </Alert>
      )}

      <FormField
        control={control}
        name="justification"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Begründung</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Begründung für die Bestellung..." 
                {...field} 
                className={`${(selectedCategory === 'special' || (selectedCategory === 'smartphone' && estimatedPrice > 1000)) 
                  ? 'border-amber-300 focus:border-amber-500' 
                  : ''}`}
              />
            </FormControl>
            <FormDescription>
              {(selectedCategory === 'special' || (selectedCategory === 'smartphone' && estimatedPrice > 1000))
                ? 'Bei Sonderbestellungen ist eine Begründung erforderlich.'
                : 'Bitte geben Sie eine Begründung an, wenn es sich um eine Sonderbestellung handelt.'}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  );
}
