
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ComplianceBadge } from "./ComplianceBadge";
import { Users } from "lucide-react";
import { LicenseDetailsDialog } from "../../license-management/components/LicenseDetailsDialog";
import { useQueryClient } from "@tanstack/react-query";

interface License {
  id: string;
  name: string;
  license_type: string;
  expiry_date: string | null;
  total_licenses: number;
  assigned_count: number;
  cost_per_license: number;
  status: string;
  complianceStatus?: string;
  totalCost?: number;
}

interface LicenseTableProps {
  data: License[];
}

export const LicenseTable = ({ data }: LicenseTableProps) => {
  const queryClient = useQueryClient();
  
  const handleAssignmentChange = () => {
    queryClient.invalidateQueries({ queryKey: ['softwareLicenses'] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Softwarelizenzen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Gesamt</TableHead>
                <TableHead>Zugewiesen</TableHead>
                <TableHead>Ablaufdatum</TableHead>
                <TableHead>Kosten/Lizenz</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((license) => (
                <TableRow key={license.id}>
                  <TableCell>{license.name}</TableCell>
                  <TableCell>{license.license_type}</TableCell>
                  <TableCell>{license.total_licenses}</TableCell>
                  <TableCell>{license.assigned_count}</TableCell>
                  <TableCell>
                    {license.expiry_date ? formatDate(license.expiry_date) : '-'}
                  </TableCell>
                  <TableCell>{formatCurrency(license.cost_per_license)}</TableCell>
                  <TableCell>
                    <ComplianceBadge status={license.status || license.complianceStatus || 'compliant'} />
                  </TableCell>
                  <TableCell>
                    <LicenseDetailsDialog
                      license={license}
                      onAssignmentChange={handleAssignmentChange}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
