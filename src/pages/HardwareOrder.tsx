
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageTransition from "@/components/layout/PageTransition";
import { HardwareOrderForm } from "@/components/hardware-order/HardwareOrderForm";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { HardwareCategory } from "@/lib/hardware-order-types";
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
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
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

  const onSubmit = async (data: HardwareOrderFormValues) => {
    if (!selectedEmployee) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie einen Mitarbeiter aus.",
        variant: "destructive"
      });
      return;
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
        description: "Die Hardware-Bestellung wurde erfolgreich eingereicht."
      });

      // Reset form
      form.reset();
      setSelectedEmployee(null);
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
  
  return <PageTransition>
      <div className="p-3 md:p-4 xl:p-6 space-y-6 max-w-full">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
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
    </PageTransition>;
}
