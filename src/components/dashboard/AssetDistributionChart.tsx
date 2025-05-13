
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AssetTypeDistribution } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface AssetDistributionChartProps {
  assetTypeDistribution: AssetTypeDistribution[];
}

export default function AssetDistributionChart({ assetTypeDistribution }: AssetDistributionChartProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="col-span-1">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Asset-Verteilung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assetTypeDistribution.map((item, index) => (
              <div key={item.type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.type}</span>
                  <span className="text-sm text-muted-foreground">{item.count} Assets</span>
                </div>
                <Progress 
                  value={item.count / assetTypeDistribution.reduce((acc, curr) => acc + curr.count, 0) * 100} 
                  className={cn("h-2", index % 5 === 0 ? "bg-blue-100" : index % 5 === 1 ? "bg-green-100" : index % 5 === 2 ? "bg-amber-100" : index % 5 === 3 ? "bg-purple-100" : "bg-red-100")}
                  label={`${item.type} Asset-Verteilung`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
