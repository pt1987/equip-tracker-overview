
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAssets } from "@/data/assets";
import { Asset } from "@/lib/types";
import { compareAsc, addDays, format } from "date-fns";
import { de } from "date-fns/locale";
import { Link } from "react-router-dom";

export default function WarrantyExpiryCard() {
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: getAssets
  });
  
  const thirtyDaysFromNow = addDays(new Date(), 30);
  
  const assetsWithExpiringWarranty = assets.filter((asset) => {
    if (!asset.warrantyExpiryDate) return false;
    
    const expiryDate = new Date(asset.warrantyExpiryDate);
    const today = new Date();
    
    return (
      compareAsc(expiryDate, today) >= 0 && 
      compareAsc(expiryDate, thirtyDaysFromNow) <= 0
    );
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="col-span-1">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            Garantien (ablaufend)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Garantiedaten werden geladen...</p>
            </div>
          ) : assetsWithExpiringWarranty.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              Keine Garantien laufen in den nächsten 30 Tagen ab.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">
                Folgende Assets haben in den nächsten 30 Tagen ablaufende Garantien:
              </p>
              <div className="space-y-2">
                {assetsWithExpiringWarranty.map((asset) => (
                  <div 
                    key={asset.id} 
                    className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-md border border-amber-100 dark:border-amber-900"
                  >
                    <div className="flex justify-between">
                      <Link to={`/asset/${asset.id}`} className="font-medium hover:underline">
                        {asset.name}
                      </Link>
                      <span className="text-amber-600 dark:text-amber-400 text-sm">
                        {asset.warrantyExpiryDate && format(new Date(asset.warrantyExpiryDate), "dd.MM.yyyy", { locale: de })}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 flex justify-between">
                      <span>{asset.manufacturer} {asset.model}</span>
                      <span>S/N: {asset.serialNumber || "N/A"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
