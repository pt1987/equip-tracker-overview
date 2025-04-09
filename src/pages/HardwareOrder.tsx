
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PackageIcon, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageTransition from "@/components/layout/PageTransition";
import { HardwareOrderForm } from "@/components/hardware-order/HardwareOrderForm";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { HardwareCategory } from "@/lib/hardware-order-types";
import { getEmployeeById } from "@/data/employees";
import BudgetDisplay from "@/components/hardware-order/BudgetDisplay";
import { calculateAvailableBudget } from "@/lib/hardware-order-types";
import { Employee } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { sendOrderEmail } from "@/lib/hardware-order-service";
import BudgetInfoCard from "@/components/hardware-order/BudgetInfoCard";

// Create a schema for the hardware order form
const hardwareOrderSchema = z.object({
  employeeId: z.string().min(1, "Bitte wählen Sie einen Mitarbeiter aus"),
  articleName: z.string().min(1, "Bitte geben Sie einen Artikelnamen ein"),
  articleConfiguration: z.string().min(1, "Bitte geben Sie eine Konfiguration ein"),
  articleCategory: z.string() as z.ZodType<HardwareCategory>,
  articleLink: z.string().url("Bitte geben Sie einen gültigen Link ein"),
  justification: z.string().optional(),
  estimatedPrice: z.number().min(0, "Der Preis muss positiv sein")
});
export type HardwareOrderFormValues = z.infer<typeof hardwareOrderSchema>;

export default function HardwareOrder() {
  // State for selected employee
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [budgetInfo, setBudgetInfo] = useState<{
    totalBudget: number;
    availableBudget: number;
    budgetExceeded: boolean;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<HardwareOrderFormValues>({
    resolver: zodResolver(hardwareOrderSchema),
    defaultValues: {
      employeeId: "",
      articleName: "",
      articleConfiguration: "",
      articleCategory: "notebook",
      articleLink: "",
      justification: "",
      estimatedPrice: 0
    }
  });
  
  const watchEmployeeId = form.watch('employeeId');
  const watchEstimatedPrice = form.watch('estimatedPrice');
  const watchArticleCategory = form.watch('articleCategory');
  
  // Fetch employee data when employee ID changes
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (watchEmployeeId) {
        try {
          const employee = await getEmployeeById(watchEmployeeId);
          setSelectedEmployee(employee);
          
          if (employee && employee.entryDate) {
            const budgetCalc = calculateAvailableBudget(
              employee.entryDate || employee.startDate,
              employee.usedBudget
            );
            setBudgetInfo(budgetCalc);
          } else {
            setBudgetInfo(null);
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
  }, [watchEmployeeId]);

  // Check if justification is required
  useEffect(() => {
    const category = watchArticleCategory as HardwareCategory;
    const isExpensiveSmartphone = category === 'smartphone' && watchEstimatedPrice > 1000;
    
    if (category === 'special' || isExpensiveSmartphone) {
      form.setValue('justification', form.getValues('justification') || '');
    }
  }, [watchArticleCategory, watchEstimatedPrice, form]);

  const onSubmit = async (data: HardwareOrderFormValues) => {
    if (!selectedEmployee) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie einen Mitarbeiter aus.",
        variant: "destructive"
      });
      return;
    }
    
    if (budgetInfo && watchEstimatedPrice > budgetInfo.availableBudget) {
      // Warn if budget would be exceeded
      if (!confirm("Das Budget würde mit dieser Bestellung überschritten werden. Möchten Sie trotzdem fortfahren?")) {
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Form submitted:", data);
      
      // Make sure all required properties are non-optional when passing to sendOrderEmail
      await sendOrderEmail({
        employeeId: data.employeeId,
        articleName: data.articleName,
        articleConfiguration: data.articleConfiguration,
        articleCategory: data.articleCategory as HardwareCategory,
        articleLink: data.articleLink,
        justification: data.justification || "",
        estimatedPrice: data.estimatedPrice
      }, selectedEmployee);
      
      toast({
        title: "Bestellung eingereicht",
        description: "Die Hardware-Bestellung wurde erfolgreich eingereicht.",
      });
      
      // Reset form
      form.reset();
      setSelectedEmployee(null);
      setBudgetInfo(null);
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Fehler",
        description: "Die Bestellung konnte nicht eingereicht werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="p-3 md:p-4 xl:p-6 space-y-6 max-w-full">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <PackageIcon className="h-8 w-8" />
                Hardware-Bestellung
              </h1>
              <p className="text-muted-foreground">
                Füllen Sie das Formular aus, um eine neue Hardware-Bestellung einzureichen
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Zurück zum Dashboard
              </Link>
            </Button>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <HardwareOrderForm />
                </div>
                
                <div className="lg:col-span-1 space-y-6">
                  <BudgetInfoCard />
                  
                  {selectedEmployee && budgetInfo && (
                    <BudgetDisplay 
                      employee={selectedEmployee} 
                      budgetInfo={budgetInfo} 
                      estimatedPrice={watchEstimatedPrice || 0} 
                    />
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Wird eingereicht..." : "Bestellung einreichen"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </PageTransition>
  );
}
