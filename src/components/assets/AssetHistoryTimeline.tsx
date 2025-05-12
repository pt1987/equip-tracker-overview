
import { AssetHistoryEntry } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import TimelineEntry from "./history/TimelineEntry";
import { useTimelineData } from "./history/useTimelineData";

interface AssetHistoryTimelineProps {
  history: AssetHistoryEntry[];
}

const AssetHistoryTimeline = ({ history }: AssetHistoryTimelineProps) => {
  const { userNames, employeeNames, sortedHistory } = useTimelineData(history);

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
          <TimelineEntry 
            key={entry.id}
            entry={entry}
            index={index}
            userNames={userNames}
            employeeNames={employeeNames}
          />
        ))}
      </div>
    </div>
  );
};

export default AssetHistoryTimeline;
