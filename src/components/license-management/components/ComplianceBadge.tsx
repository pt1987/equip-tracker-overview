
import React from "react";
import { Badge } from "@/components/ui/badge";

interface ComplianceBadgeProps {
  status: string;
}

export const ComplianceBadge = ({ status }: ComplianceBadgeProps) => {
  switch (status) {
    case "compliant":
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Konform</Badge>;
    case "overused":
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Übernutzung</Badge>;
    case "underused":
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Unternutzung</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};
