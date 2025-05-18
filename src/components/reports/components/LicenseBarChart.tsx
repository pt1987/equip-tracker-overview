
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { KeyRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface License {
  name: string;
  total_licenses: number;
  assigned_count: number;
}

export const LicenseBarChart = ({ data }: { data: License[] }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6 flex items-center">
          <KeyRound className="mr-2 h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Lizenzzuweisung</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_licenses" name="Gesamt Lizenzen" fill="#8884d8" />
            <Bar dataKey="assigned_count" name="Zugewiesen" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
