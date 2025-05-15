
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserRound } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAssetHistoryEntries } from "@/data/assets/history";
import { getAssets } from "@/data/assets";
import { getEmployees } from "@/data/employees";
import { Link } from "react-router-dom";
import { subDays, format } from "date-fns";
import { de } from "date-fns/locale";
import { Asset, Employee } from "@/lib/types";

export default function EmployeeChangesCard() {
  const sevenDaysAgo = subDays(new Date(), 7);
  
  const { data: historyEntries = [], isLoading: historyLoading } = useQuery({
    queryKey: ["assetHistory", "employeeChanges", sevenDaysAgo.toISOString()],
    queryFn: async () => {
      const entries = await getAssetHistoryEntries();
      return entries.filter(entry => {
        // Filter for assign/return actions within the last 7 days
        const entryDate = new Date(entry.date);
        return (entry.action === "assign" || entry.action === "return") && entryDate >= sevenDaysAgo;
      });
    }
  });
  
  const { data: assets = [], isLoading: assetsLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: getAssets
  });
  
  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees
  });
  
  // Map asset IDs and employee IDs to their objects for quick lookup
  const assetMap = assets.reduce<Record<string, Asset>>((map, asset) => {
    map[asset.id] = asset;
    return map;
  }, {});
  
  const employeeMap = employees.reduce<Record<string, Employee>>((map, employee) => {
    map[employee.id] = employee;
    return map;
  }, {});
  
  const isLoading = historyLoading || assetsLoading || employeesLoading;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="col-span-1">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <UserRound className="h-5 w-5 text-purple-500" />
            Mitarbeiterzuweisungen (letzte 7 Tage)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Zuweisungsänderungen werden geladen...</p>
            </div>
          ) : historyEntries.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              Keine Mitarbeiterzuweisungen in den letzten 7 Tagen.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">
                Folgende Assets haben in den letzten 7 Tagen ihre Mitarbeiterzuweisung geändert:
              </p>
              <div className="space-y-2">
                {historyEntries.map((entry) => {
                  const asset = assetMap[entry.assetId];
                  const employee = entry.employeeId ? employeeMap[entry.employeeId] : null;
                  
                  if (!asset) return null;
                  
                  return (
                    <div 
                      key={entry.id} 
                      className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-md border border-purple-100 dark:border-purple-900"
                    >
                      <div className="flex justify-between">
                        <Link to={`/asset/${asset.id}`} className="font-medium hover:underline">
                          {asset.name}
                        </Link>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(entry.date), "dd.MM.yyyy", { locale: de })}
                        </span>
                      </div>
                      
                      <div className="text-sm mt-1">
                        {entry.action === "assign" && employee ? (
                          <div className="flex justify-between">
                            <span>Zugewiesen an:</span>
                            <Link to={`/employee/${employee.id}`} className="font-medium hover:underline text-purple-600 dark:text-purple-400">
                              {employee.firstName} {employee.lastName}
                            </Link>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Zurück in den Pool</span>
                        )}
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
