
import { motion } from "framer-motion";
import { AssetHistoryEntry, AssetHistoryAction } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { 
  CalendarClock,
  ShoppingCart, 
  UserCheck, 
  RefreshCcw, 
  RotateCcw,
  Clock,
  Truck,
  Wrench,
  Trash2
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AssetHistoryTimelineProps {
  history: AssetHistoryEntry[];
}

const AssetHistoryTimeline = ({ history }: AssetHistoryTimelineProps) => {
  // Sort history by date (newest first)
  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getActionIcon = (action: AssetHistoryAction) => {
    switch (action) {
      case "purchase":
        return <ShoppingCart size={18} className="text-primary" />;
      case "delivery":
        return <Truck size={18} className="text-primary" />;
      case "assign":
        return <UserCheck size={18} className="text-primary" />;
      case "status_change":
        return <RefreshCcw size={18} className="text-primary" />;
      case "repair":
        return <Wrench size={18} className="text-primary" />;
      case "return":
        return <RotateCcw size={18} className="text-primary" />;
      case "dispose":
        return <Trash2 size={18} className="text-primary" />;
      default:
        return <Clock size={18} className="text-primary" />;
    }
  };

  const getActionLabel = (action: AssetHistoryAction) => {
    switch (action) {
      case "purchase":
        return "Kauf";
      case "delivery":
        return "Lieferung";
      case "assign":
        return "Zugewiesen";
      case "status_change":
        return "Status geändert";
      case "repair":
        return "Zur Reparatur";
      case "return":
        return "Zurückgegeben";
      case "dispose":
        return "Entsorgt";
      default:
        return action;
    }
  };

  if (sortedHistory.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Keine Historieneinträge vorhanden.</p>
      </div>
    );
  }

  return (
    <div className="relative pb-4">
      {/* Timeline line */}
      <div className="absolute left-3 top-3 bottom-3 w-px bg-secondary/40 rounded-full" />

      {/* Timeline entries */}
      <div className="space-y-3">
        {sortedHistory.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="relative pl-10"
          >
            {/* Timeline dot */}
            <div className="absolute left-0 w-6 h-6 rounded-full bg-background flex items-center justify-center z-10 border border-secondary/30">
              {getActionIcon(entry.action)}
            </div>

            {/* Content */}
            <div className="rounded-lg p-3 bg-secondary/5 backdrop-blur-sm border border-secondary/10">
              <div className="flex flex-wrap justify-between gap-2 mb-1">
                <div className="flex items-center">
                  <CalendarClock size={14} className="mr-1.5 text-muted-foreground" />
                  <span className="text-sm font-medium">{formatDate(entry.date)}</span>
                </div>
                <span className="inline-flex items-center text-xs font-medium text-primary">
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
