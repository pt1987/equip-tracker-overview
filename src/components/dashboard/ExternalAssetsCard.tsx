
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { OwnerCompanyDistribution } from "@/lib/types";

interface ExternalAssetsCardProps {
  ownerCompanyDistribution: OwnerCompanyDistribution[];
}

export default function ExternalAssetsCard({ ownerCompanyDistribution }: ExternalAssetsCardProps) {
  // If there are no external assets, show a different message
  if (!ownerCompanyDistribution.length) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              Externe Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Keine externen Assets vorhanden.</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="col-span-1">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            Externe Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ownerCompanyDistribution.map(item => (
              <div key={item.company} className="flex items-center justify-between">
                <span className="text-sm font-medium truncate max-w-[200px]" title={item.company}>
                  {item.company}
                </span>
                <span className="font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
