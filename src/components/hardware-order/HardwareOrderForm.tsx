import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, AlertTriangleIcon } from "lucide-react";

import { getEmployees } from "@/data/employees";
import { 
  HardwareCategory, 
  HardwareOrderFormData, 
  hardwareCategoryInfo,
  calculateAvailableBudget
} from "@/lib/hardware-order-types";
import { sendOrderEmail } from "@/lib/hardware-order-service";
import BudgetDisplay from "./BudgetDisplay";

const formSchema = z.object({
  employeeId: z.string({
    required_error: "Bitte wählen Sie einen Mitarbeiter aus"
  }),
  articleName: z.string().min(3, {
    message: "Der Artikelname muss mindestens 3 Zeichen lang sein"
  }),
  articleConfiguration: z.string().min(5, {
    message: "Die Konfiguration muss mindestens 5 Zeichen lang sein"
  }),
  articleCategory: z.enum([
    "notebook", "smartphone", "headset", "mouse", "adapter", "accessories", "special"
  ] as const, {
    required_error: "Bitte wählen Sie eine Kategorie"
  }),
  articleLink: z.string().url({
    message: "Bitte geben Sie einen gültigen Link ein"
  }),
  justification: z.string().optional(),
  estimatedPrice: z.number({
    required_error: "Bitte geben Sie den geschätzten Preis ein",
    invalid_type_error: "Bitte geben Sie eine gültige Zahl ein"
  }).min(1, {
    message: "Der Preis muss größer als 0€ sein"
  })
});

export default function HardwareOrderForm() {
  const navigate = useNavigate();
  
  const { data: employeesData = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: () => getEmployees(),
    initialData: employees,
  });
  
  const form = useForm<HardwareOrderFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: "",
      articleName: "",
      articleConfiguration: "",
      articleCategory: undefined,
      articleLink: "",
      justification: "",
      estimatedPrice: 0
    }
  });
  
  const watchEmployeeId = form.watch("employeeId");
  const watchCategory = form.watch("articleCategory");
  const watchPrice = form.watch("estimatedPrice");
  
  const selectedEmployee = employeesData.find(e => e.id === watchEmployeeId);
  const selectedCategory = watchCategory ? hardwareCategoryInfo[watchCategory] : null;
  const requiresJustification = selectedCategory?.requiresJustification || false;
  
  const isSmartphoneOverBudget = watchCategory === "smartphone" && watchPrice > 1000;
  
  let budgetInfo = { totalBudget: 0, availableBudget: 0, budgetExceeded: false };
  if (selectedEmployee) {
    const entryDate = selectedEmployee.entryDate || selectedEmployee.startDate;
    budgetInfo = calculateAvailableBudget(entryDate, selectedEmployee.usedBudget);
  }
  
  const onSubmit = async (data: HardwareOrderFormData) => {
    try {
      // In a real application, we would send the data to the API
      console.log("Form submitted:", data);
      
      // Send email with order
      await sendOrderEmail(data, selectedEmployee);
      
      toast({
        title: "Bestellung erfolgreich abgesendet",
        description: "Die Bestellung wurde erfolgreich eingereicht und eine E-Mail wurde versendet.",
      });
      
      // Navigate back to the dashboard
      navigate("/");
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Fehler beim Absenden der Bestellung",
        description: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
    }
  };
  
  // Dynamically update form validation
  React.useEffect(() => {
    if (requiresJustification) {
      form.register("justification", { 
        required: "Bei einer Sonderbestellung ist eine Begründung erforderlich"
      });
    }
  }, [requiresJustification, form]);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Mitarbeiter & Budget</CardTitle>
            <CardDescription>
              Wählen Sie den Mitarbeiter aus, für den die Hardware bestellt werden soll
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mitarbeiter</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Mitarbeiter auswählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employeesData.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.firstName} {employee.lastName} ({employee.position})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {selectedEmployee && (
              <BudgetDisplay 
                employee={selectedEmployee} 
                budgetInfo={budgetInfo} 
                estimatedPrice={watchPrice}
              />
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Hardware-Details</CardTitle>
            <CardDescription>
              Geben Sie die Details der zu bestellenden Hardware an
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="articleCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategorie</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategorie auswählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(hardwareCategoryInfo).map(([value, info]) => (
                        <SelectItem key={value} value={value}>
                          {info.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {selectedCategory?.description}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="articleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artikelname</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. MacBook Pro 14'' M3" {...field} />
                  </FormControl>
                  <FormDescription>
                    Geben Sie einen beschreibenden Namen für den Artikel ein
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="articleConfiguration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konfiguration</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="z.B. 16GB RAM, 512GB SSD, Space Grey" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Beschreiben Sie die genaue Konfiguration des Artikels
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="articleLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link zum Artikel</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://www.example.com/produkt" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Fügen Sie einen Link zum Artikel hinzu
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="estimatedPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Geschätzter Preis (€)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="1000" 
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Geben Sie den Bruttopreis in Euro an
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isSmartphoneOverBudget && (
              <Alert className="bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300">
                <AlertTriangleIcon className="h-4 w-4" />
                <AlertTitle>Preis übersteigt Budget-Grenze</AlertTitle>
                <AlertDescription>
                  Der maximale Preis für ein Smartphone beträgt 1000€ brutto. 
                  Bitte ändern Sie die Kategorie zu "Sonderbestellung" und geben Sie eine Begründung an.
                </AlertDescription>
              </Alert>
            )}
            
            {(requiresJustification || isSmartphoneOverBudget) && (
              <FormField
                control={form.control}
                name="justification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Begründung</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Bitte begründen Sie, warum dieser spezielle Artikel benötigt wird" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Eine detaillierte Begründung ist für Sonderbestellungen erforderlich
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/")}>
              Abbrechen
            </Button>
            <Button 
              type="submit" 
              disabled={
                (budgetInfo.budgetExceeded && new Date().getFullYear() >= 2025) || 
                (watchCategory === "smartphone" && watchPrice > 1000 && !form.getValues("justification"))
              }
            >
              Bestellung abschicken
            </Button>
          </CardFooter>
        </Card>
        
        {budgetInfo.budgetExceeded && new Date().getFullYear() >= 2025 && (
          <Alert variant="destructive">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>Budget überschritten</AlertTitle>
            <AlertDescription>
              Ab dem 01.01.2025 ist ein Überziehen des Device Budgets nicht mehr möglich.
            </AlertDescription>
          </Alert>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Hinweise zur Hardware-Bestellung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-blue-50 dark:bg-blue-950/20">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Budget-Regelung</AlertTitle>
              <AlertDescription>
                Nach Beendigung der Probezeit stehen den Mitarbeitern 3950€ (brutto) zur Verfügung. 
                Jährlich kommen dann 950€ (brutto) hinzu. 
                Bestehende Budgets werden entsprechend dieser Regelung „aufgefüllt". 
                Ab dem 01.01.2025 ist ein Überziehen des Device Budgets nicht mehr möglich. 
                Ihr könnt bis zu 5000€ (brutto) ansparen, ein höheres Ansparen ist nicht mehr möglich.
              </AlertDescription>
            </Alert>
            
            <Alert className="bg-blue-50 dark:bg-blue-950/20">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Nachhaltigkeitshinweis</AlertTitle>
              <AlertDescription>
                Bitte beachten Sie die Richtlinien zur Nachhaltigkeit:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Notebooks sollten eine Mindestlebenszeit von 4 Jahren haben</li>
                  <li>Smartphones: maximaler Kaufpreis 1000€ brutto</li>
                  <li>Maximal ein Headset pro Mitarbeiter</li>
                  <li>Bei Zubehör wie Mäusen und Adaptern auf Nachhaltigkeit achten</li>
                  <li>Homeoffice-Ausstattung ist nicht mehr vorgesehen</li>
                  <li>Bei Poolgeräten bitte auf diese zurückgreifen</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
