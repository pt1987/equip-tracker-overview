
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, Info } from "lucide-react";
import { budgetRules } from "@/lib/hardware-order-types";
import { formatCurrency } from "@/lib/utils";

export default function BudgetInfoCard() {
  return (
    <Card className="bg-muted/30 overflow-hidden">
      <CardHeader className="bg-blue-50 border-b border-blue-100">
        <CardTitle className="text-base flex items-center gap-2">
          <CircleDollarSign className="h-5 w-5 text-blue-600" />
          Budget-Richtlinien
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 text-sm space-y-4">
        <div>
          <h3 className="font-semibold mb-1">Das Budget</h3>
          <p>Nach Beendigung der Probezeit stehen {formatCurrency(budgetRules.baseInitialBudget)} (brutto) zur Verfügung.</p>
          <p>Jährlich kommen dann {formatCurrency(budgetRules.yearlyIncrease)} (brutto) hinzu.</p>
          <p>Ab dem 01.01.2025 ist ein Überziehen des Device Budgets nicht mehr möglich.</p>
          <p>Maximal können {formatCurrency(budgetRules.maxBudget)} (brutto) angespart werden.</p>
        </div>

        <div>
          <h3 className="font-semibold mb-1">Beachte</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Bei Laptops sollte die Lebenszeit auf mind. 4 Jahre ausgelegt sein</li>
            <li>Der maximale Preis für Smartphones beträgt {formatCurrency(budgetRules.maxSmartphonePrice)} (brutto)</li>
            <li>Es ist nur ein Headset pro Mitarbeiter erlaubt</li>
            <li>Sonderbestellungen erfordern eine Begründung und Genehmigung</li>
          </ul>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-blue-50 p-2 rounded border border-blue-100">
          <Info className="h-4 w-4 text-blue-500" />
          <p>Bei allen Geräten gilt: Wenn eine ähnliche Alternative im Pool verfügbar ist, bevorzuge das Poolgerät.</p>
        </div>
      </CardContent>
    </Card>
  );
}
