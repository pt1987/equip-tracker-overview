
import { AssetHistoryEntry } from "@/lib/types";
import TimelineEntry from "./history/TimelineEntry";
import { useTimelineData } from "./history/useTimelineData";
import { Skeleton } from "@/components/ui/skeleton";

interface AssetHistoryTimelineProps {
  history: AssetHistoryEntry[];
}

const AssetHistoryTimeline = ({ history }: AssetHistoryTimelineProps) => {
  const { userNames, employeeNames, sortedHistory, isLoading } = useTimelineData(history);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative pl-10">
            <div className="absolute left-0 w-6 h-6 rounded-full bg-secondary/20"></div>
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

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
