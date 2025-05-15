
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface DashboardWidgetProps {
  id: string;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function DashboardWidget({ children, className = "" }: DashboardWidgetProps) {
  return (
    <Card className={`h-full ${className}`}>
      {children}
    </Card>
  );
}
