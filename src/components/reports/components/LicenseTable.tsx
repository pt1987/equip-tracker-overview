
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ComplianceBadge } from "./ComplianceBadge";

interface License {
  id: string;
  name: string;
  license_type: string;
  expiry_date: string | null;
  total_licenses: number;
  assigned_count: number;
  cost_per_license: number;
  complianceStatus: string;
}

export const LicenseTable = ({ data }: { data: License[] }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium">Software Lizenzen</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted">
              <tr>
                <th className="p-3">Software</th>
                <th className="p-3">Lizenztyp</th>
                <th className="p-3">Ablaufdatum</th>
                <th className="p-3">Zugewiesen</th>
                <th className="p-3">Gesamt</th>
                <th className="p-3">Kosten pro Lizenz</th>
                <th className="p-3">Gesamtkosten</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3">{item.license_type}</td>
                  <td className="p-3">{item.expiry_date ? formatDate(item.expiry_date) : '-'}</td>
                  <td className="p-3">{item.assigned_count}</td>
                  <td className="p-3">{item.total_licenses}</td>
                  <td className="p-3">{formatCurrency(item.cost_per_license)}</td>
                  <td className="p-3">{formatCurrency(item.cost_per_license * item.total_licenses)}</td>
                  <td className="p-3"><ComplianceBadge status={item.complianceStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
