
import React from "react";
import { Link } from "react-router-dom";
import { PackageIcon, ArrowLeft } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import HardwareOrderForm from "@/components/hardware-order/HardwareOrderForm";
import { Button } from "@/components/ui/button";

export default function HardwareOrder() {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-8">
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
          
          <HardwareOrderForm />
        </div>
      </div>
    </PageTransition>
  );
}
