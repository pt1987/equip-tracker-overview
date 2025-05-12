
import { motion } from "framer-motion";
import { AssetHistoryEntry } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { CalendarClock } from "lucide-react";
import { getActionIcon, getActionLabel } from "./timelineUtils";

interface TimelineEntryProps {
  entry: AssetHistoryEntry;
  index: number;
  userNames: Record<string, string>;
  employeeNames: Record<string, string>;
}

const TimelineEntry = ({ entry, index, userNames, employeeNames }: TimelineEntryProps) => {
  // Function to format time from ISO string
  const formatTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('de-DE', { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    } catch (e) {
      console.error("Error formatting time:", e);
      return '';
    }
  };

  // Format the notes to properly display change details
  const renderNotes = () => {
    if (!entry.notes) return null;
    
    // Check if the notes contain multiple lines (change details)
    if (entry.notes.includes('\n')) {
      return entry.notes.split('\n').map((line, i) => (
        <div key={i} className={`${i > 0 ? "mt-1" : ""} text-sm`}>
          {line}
        </div>
      ));
    }
    
    return <div className="text-sm">{entry.notes}</div>;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
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
            <span className="text-sm font-medium">
              {formatDate(entry.date)}
              <span className="ml-2 text-xs text-muted-foreground">
                {formatTime(entry.date)}
              </span>
            </span>
          </div>
          <span className="inline-flex items-center text-xs font-medium text-primary">
            {getActionLabel(entry.action)}
          </span>
        </div>
        
        <div className="mt-1">
          {entry.employeeId && (
            <div className="text-sm mb-1">
              <span className="text-muted-foreground">Mitarbeiter: </span>
              <span className="font-medium">
                {employeeNames[entry.employeeId] || "Unbekannt"}
              </span>
            </div>
          )}
          
          <div className="text-sm mb-1">
            <span className="text-muted-foreground">Durch: </span>
            <span className="font-medium">
              {entry.userId ? (userNames[entry.userId] || "Unbekannt") : "System"}
            </span>
          </div>
          
          {entry.notes && (
            <div className="text-sm mt-2 border-t border-secondary/20 pt-2">
              <div className="text-xs text-muted-foreground mb-1">Änderungen:</div>
              {renderNotes()}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineEntry;
