
import { motion } from "framer-motion";
import { AssetHistoryEntry } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { 
  CalendarClock,
  ShoppingCart, 
  UserCheck, 
  RefreshCcw, 
  RotateCcw,
  Clock
} from "lucide-react";

interface AssetHistoryTimelineProps {
  history: AssetHistoryEntry[];
}

const AssetHistoryTimeline = ({ history }: AssetHistoryTimelineProps) => {
  // Sort history by date (newest first)
  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getActionIcon = (action: string) => {
    switch (action) {
      case "purchase":
        return <ShoppingCart size={18} className="text-green-600" />;
      case "assign":
        return <UserCheck size={18} className="text-blue-600" />;
      case "status_change":
        return <RefreshCcw size={18} className="text-amber-600" />;
      case "return":
        return <RotateCcw size={18} className="text-purple-600" />;
      default:
        return <Clock size={18} className="text-gray-600" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "purchase":
        return "Kauf";
      case "assign":
        return "Zugewiesen";
      case "status_change":
        return "Status geändert";
      case "return":
        return "Zurückgegeben";
      default:
        return action;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "purchase":
        return "bg-green-100 border-green-200";
      case "assign":
        return "bg-blue-100 border-blue-200";
      case "status_change":
        return "bg-amber-100 border-amber-200";
      case "return":
        return "bg-purple-100 border-purple-200";
      default:
        return "bg-gray-100 border-gray-200";
    }
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-gradient-to-b from-primary/50 to-primary/10 rounded-full" />

      {/* Timeline entries */}
      <div className="space-y-6">
        {sortedHistory.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="relative pl-10"
          >
            {/* Timeline dot */}
            <div className="absolute left-0 w-7 h-7 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10">
              {getActionIcon(entry.action)}
            </div>

            {/* Content */}
            <div className={`rounded-lg border p-4 shadow-sm ${getActionColor(entry.action)}`}>
              <div className="flex flex-wrap justify-between gap-2 mb-2">
                <div className="flex items-center">
                  <CalendarClock size={14} className="mr-1.5 text-muted-foreground" />
                  <span className="text-sm font-medium">{formatDate(entry.date)}</span>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-white/80 text-xs font-medium">
                  {getActionLabel(entry.action)}
                </span>
              </div>
              
              <div className="mt-1">
                {entry.employeeId && (
                  <div className="text-sm mb-1">
                    <span className="text-muted-foreground">Mitarbeiter: </span>
                    <span className="font-medium">{entry.employeeId}</span>
                  </div>
                )}
                
                {entry.notes && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Notiz: </span>
                    <span>{entry.notes}</span>
                  </div>
                )}
                
                {!entry.notes && !entry.employeeId && (
                  <div className="text-sm text-muted-foreground italic">
                    Keine zusätzlichen Details verfügbar
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AssetHistoryTimeline;
