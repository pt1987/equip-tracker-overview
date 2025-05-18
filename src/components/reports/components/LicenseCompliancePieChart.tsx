
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { KeyRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ComplianceData {
  name: string;
  value: number;
  color: string;
}

export const LicenseCompliancePieChart = ({ data }: { data: ComplianceData[] }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6 flex items-center">
          <KeyRound className="mr-2 h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Compliance Status</h3>
        </div>
        {data.some(item => item.value > 0) ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">Keine Compliance-Daten verfügbar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
