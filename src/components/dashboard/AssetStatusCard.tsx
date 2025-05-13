
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/assets/StatusBadge";
import { AssetStatusDistribution } from "@/lib/types";

interface AssetStatusCardProps {
  assetStatusDistribution: AssetStatusDistribution[];
}

export default function AssetStatusCard({ assetStatusDistribution }: AssetStatusCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-1">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Asset-Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assetStatusDistribution.map(item => (
              <div key={item.status} className="flex items-center justify-between">
                <StatusBadge status={item.status} size="md" />
                <span className="font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
