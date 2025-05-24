
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus } from "lucide-react";
import MicaCard from "./MicaCard";

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
    <MicaCard className="h-full">
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground/90">Neue Mitarbeiter</h3>
          <p className="text-sm text-muted-foreground/70">Kürzlich hinzugefügte Mitarbeiter</p>
        </div>
        
        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-3">
            {recentEmployees.map((employee, index) => (
              <motion.div 
                key={employee.id} 
                className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex-shrink-0">
                  {employee.imageUrl ? (
                    <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-white/20">
                      <img 
                        src={employee.imageUrl} 
                        alt={`${employee.firstName} ${employee.lastName}`} 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-foreground/80 font-medium text-sm">
                        {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium line-clamp-1 text-foreground/90">
                    {employee.firstName} {employee.lastName}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground/70">
                    <UserPlus size={12} className="mr-1" />
                    {new Date(employee.startDate).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {recentEmployees.length === 0 && (
              <div className="text-center py-8 text-muted-foreground/60">
                Keine neuen Mitarbeiter
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </MicaCard>
  );
}
