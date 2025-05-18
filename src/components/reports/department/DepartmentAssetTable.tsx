
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DepartmentAssetData } from "./DepartmentAssetsReport";

interface DepartmentAssetTableProps {
  data: DepartmentAssetData[];
}

const DepartmentAssetTable = ({ data }: DepartmentAssetTableProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium">Detaillierte Abteilungsübersicht</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted">
              <tr>
                <th className="p-3">Abteilung</th>
                <th className="p-3">Mitarbeiter</th>
                <th className="p-3">Assets</th>
                <th className="p-3">Laptops</th>
                <th className="p-3">Smartphones</th>
                <th className="p-3">Tablets</th>
                <th className="p-3">Zubehör</th>
                <th className="p-3">Assets/MA</th>
                <th className="p-3">Gesamtwert</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="p-3 font-medium">{item.department}</td>
                  <td className="p-3">{item.employeeCount}</td>
                  <td className="p-3">{item.assetCount}</td>
                  <td className="p-3">{item.assetsByType.laptop || 0}</td>
                  <td className="p-3">{item.assetsByType.smartphone || 0}</td>
                  <td className="p-3">{item.assetsByType.tablet || 0}</td>
                  <td className="p-3">{item.assetsByType.accessory || 0}</td>
                  <td className="p-3">{item.assetsPerEmployee.toFixed(2)}</td>
                  <td className="p-3">{formatCurrency(item.totalValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

export default DepartmentAssetTable;
