
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAssets } from "@/data/assets";
import { Link } from "react-router-dom";
import { compareAsc, addDays, format, differenceInDays } from "date-fns";
import { de } from "date-fns/locale";

export default function ExternalReturnsCard() {
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: getAssets
  });
  
  const thirtyDaysFromNow = addDays(new Date(), 30);
  
  const externalAssetsNeedingReturn = assets.filter((asset) => {
    if (!asset.isExternal || !asset.plannedReturnDate || asset.actualReturnDate) return false;
    
    const returnDate = new Date(asset.plannedReturnDate);
    const today = new Date();
    
    return (
      compareAsc(returnDate, today) >= 0 && 
      compareAsc(returnDate, thirtyDaysFromNow) <= 0
    );
  }).sort((a, b) => {
    const dateA = new Date(a.plannedReturnDate || "");
    const dateB = new Date(b.plannedReturnDate || "");
    return compareAsc(dateA, dateB);
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="col-span-1">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-blue-500" />
            Externe Assets (Rückgabe)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Externe Assets werden geladen...</p>
            </div>
          ) : externalAssetsNeedingReturn.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              Keine externen Assets müssen in den nächsten 30 Tagen zurückgegeben werden.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">
                Folgende externe Assets müssen in den nächsten 30 Tagen zurückgegeben werden:
              </p>
              <div className="space-y-2">
                {externalAssetsNeedingReturn.map((asset) => {
                  const daysUntilReturn = asset.plannedReturnDate 
                    ? differenceInDays(new Date(asset.plannedReturnDate), new Date()) 
                    : 0;
                    
                  return (
                    <div 
                      key={asset.id} 
                      className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-100 dark:border-blue-900"
                    >
                      <div className="flex justify-between">
                        <Link to={`/asset/${asset.id}`} className="font-medium hover:underline">
                          {asset.name}
                        </Link>
                        <span className={`text-sm ${daysUntilReturn < 7 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                          {asset.plannedReturnDate && format(new Date(asset.plannedReturnDate), "dd.MM.yyyy", { locale: de })}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 flex justify-between">
                        <span>{asset.ownerCompany}</span>
                        <span className={daysUntilReturn < 7 ? 'font-medium text-red-600 dark:text-red-400' : ''}>
                          {daysUntilReturn} Tage verbleibend
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
