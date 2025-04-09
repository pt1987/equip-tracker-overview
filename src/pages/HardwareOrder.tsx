
import React from "react";
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

  const onSubmit = (data: HardwareOrderFormValues) => {
    console.log("Form submitted:", data);
    // Handle form submission logic here
  };

  return (
    <PageTransition>
      <div className="p-3 md:p-4 xl:p-6 space-y-6 max-w-full">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <PackageIcon className="h-8 w-8 text-primary" />
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
              <HardwareOrderForm />
              
              <div className="flex justify-end">
                <Button type="submit">Bestellung einreichen</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </PageTransition>
  );
}
