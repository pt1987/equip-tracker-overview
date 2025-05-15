
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface DashboardWidgetProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export default function DashboardWidget({ id, children, className = "" }: DashboardWidgetProps) {
  return (
    <Card key={id} className={`h-full overflow-hidden ${className}`}>
      {children}
    </Card>
  );
}
