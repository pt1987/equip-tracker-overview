
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus } from "lucide-react";

interface RecentEmployeesListProps {
  recentEmployees: Array<{
    id: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    startDate: string;
  }>;
}

export default function RecentEmployeesList({ recentEmployees }: RecentEmployeesListProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="col-span-1">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Zuletzt hinzugefügte Mitarbeiter</CardTitle>
          <CardDescription>Kürzlich hinzugefügte Mitarbeiter</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[280px] pr-4">
            <div className="space-y-4">
              {recentEmployees.map(employee => (
                <div key={employee.id} className="flex items-center space-x-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="flex-shrink-0">
                    {employee.imageUrl ? (
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img 
                          src={employee.imageUrl} 
                          alt={`${employee.firstName} ${employee.lastName}`} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <UserPlus size={12} className="mr-1" />
                      {new Date(employee.startDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {recentEmployees.length === 0 && (
                <p className="text-center text-muted-foreground py-4">Keine neuen Mitarbeiter</p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
