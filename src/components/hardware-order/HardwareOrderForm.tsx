
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext, useWatch } from "react-hook-form";
import { getEmployeeById, getEmployees } from "@/data/employees";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { hardwareCategoryInfo, calculateAvailableBudget } from "@/lib/hardware-order-types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleDollarSign, HelpCircle, InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Employee } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function HardwareOrderForm() {
  const {
    control
  } = useFormContext();
  const [employeeOptions, setEmployeeOptions] = useState<{
    label: string;
    value: string;
  }[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [budgetInfo, setBudgetInfo] = useState<{
    totalBudget: number;
    availableBudget: number;
    budgetExceeded: boolean;
  } | null>(null);
  
  const selectedCategory = useWatch({
    control,
    name: "articleCategory"
  });
  const estimatedPrice = useWatch({
    control,
    name: "estimatedPrice"
  });
  const employeeId = useWatch({
    control,
    name: "employeeId"
  });
  
  // Fetch employee options for dropdown
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
  
  // Fetch selected employee data and calculate budget
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (employeeId) {
        try {
          const employee = await getEmployeeById(employeeId);
          if (employee) {
            setSelectedEmployee(employee);
            if (employee.entryDate || employee.startDate) {
              const budgetCalc = calculateAvailableBudget(employee.entryDate || employee.startDate, employee.usedBudget);
              setBudgetInfo(budgetCalc);
            } else {
              setBudgetInfo(null);
            }
          }
        } catch (error) {
          console.error("Error fetching employee data:", error);
          setSelectedEmployee(null);
          setBudgetInfo(null);
        }
      } else {
        setSelectedEmployee(null);
        setBudgetInfo(null);
      }
    };
    fetchEmployeeData();
  }, [employeeId]);

  return <CardContent className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="articleName" render={({
        field
      }) => <FormItem>
              <FormLabel>Artikelname</FormLabel>
              <FormControl>
                <Input placeholder="z.B. MacBook Pro 16&quot;" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>} />

        <FormField control={control} name="articleConfiguration" render={({
        field
      }) => <FormItem>
              <FormLabel>Konfiguration</FormLabel>
              <FormControl>
                <Input placeholder="z.B. M2 Max, 32GB RAM, 1TB SSD" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="articleCategory" render={({
        field
      }) => <FormItem>
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
                  {Object.entries(hardwareCategoryInfo).map(([key, info]) => <SelectItem key={key} value={key}>
                      {info.name}
                    </SelectItem>)}
                </SelectContent>
              </Select>
              <FormDescription>
                {field.value && hardwareCategoryInfo[field.value as keyof typeof hardwareCategoryInfo]?.description}
              </FormDescription>
              <FormMessage />
            </FormItem>} />

        <FormField control={control} name="estimatedPrice" render={({
        field
      }) => <FormItem>
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
                <Input placeholder="z.B. 2500" type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <FormField control={control} name="articleLink" render={({
        field
      }) => <FormItem>
              <FormLabel>Link zum Artikel</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>Link zur Produktseite des Artikels</FormDescription>
              <FormMessage />
            </FormItem>} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <FormField control={control} name="employeeId" render={({
        field
      }) => <FormItem>
              <FormLabel>Mitarbeiter</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Mitarbeiter auswählen" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {employeeOptions.map(option => <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>} />
      </div>

      {/* Budget information for selected employee */}
      {selectedEmployee && budgetInfo && (
        <div className="mt-2">
          <Alert className="bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Budget-Information für {selectedEmployee.firstName} {selectedEmployee.lastName}</AlertTitle>
            <AlertDescription className="text-blue-700">
              <div className="grid grid-cols-2 gap-1 mt-2">
                <span>Gesamtbudget:</span>
                <span className="font-medium">{formatCurrency(budgetInfo.totalBudget)}</span>
                <span>Bereits verwendet:</span>
                <span className="font-medium">{formatCurrency(selectedEmployee.usedBudget)}</span>
                <span>Verfügbar:</span>
                <span className={`font-medium ${budgetInfo.budgetExceeded ? "text-red-600" : "text-green-600"}`}>
                  {formatCurrency(budgetInfo.availableBudget)}
                </span>
                <span>Nach Bestellung:</span>
                <span className={`font-medium ${budgetInfo.availableBudget - (estimatedPrice || 0) < 0 ? "text-red-600" : "text-green-600"}`}>
                  {formatCurrency(budgetInfo.availableBudget - (estimatedPrice || 0))}
                </span>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {selectedCategory === 'smartphone' && estimatedPrice > 1000 && <Alert className="bg-amber-50 border-amber-200">
          <InfoIcon className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Smartphone Budgethinweis</AlertTitle>
          <AlertDescription className="text-amber-700 text-sm">
            Smartphones über 1000€ brutto erfordern eine Begründung und Genehmigung.
          </AlertDescription>
        </Alert>}

      {selectedCategory === 'special' && <Alert className="bg-amber-50 border-amber-200">
          <InfoIcon className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Sonderbestellung</AlertTitle>
          <AlertDescription className="text-amber-700 text-sm">
            Sonderbestellungen wie teure Smartphones, iPads oder tragbare Monitore erfordern eine Begründung und Genehmigung.
          </AlertDescription>
        </Alert>}

      <FormField control={control} name="justification" render={({
      field
    }) => <FormItem>
            <FormLabel>Begründung</FormLabel>
            <FormControl>
              <Textarea placeholder="Begründung für die Bestellung..." {...field} className={`${selectedCategory === 'special' || selectedCategory === 'smartphone' && estimatedPrice > 1000 ? 'border-amber-300 focus:border-amber-500' : ''}`} />
            </FormControl>
            <FormDescription>
              {selectedCategory === 'special' || selectedCategory === 'smartphone' && estimatedPrice > 1000 ? 'Bei Sonderbestellungen ist eine Begründung erforderlich.' : 'Bitte geben Sie eine Begründung an, wenn es sich um eine Sonderbestellung handelt.'}
            </FormDescription>
            <FormMessage />
          </FormItem>} />
    </CardContent>;
}
