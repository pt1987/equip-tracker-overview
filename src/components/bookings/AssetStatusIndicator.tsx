
import { Badge } from "@/components/ui/badge";

interface AssetStatusIndicatorProps {
  status: "available" | "booked" | "available-partial";
  bookingCount?: number;
}

export default function AssetStatusIndicator({ status, bookingCount = 0 }: AssetStatusIndicatorProps) {
  switch (status) {
    case "available":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800">
          Verfügbar
        </Badge>
      );
    case "booked":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30 border-red-200 dark:border-red-800">
          Gebucht
        </Badge>
      );
    case "available-partial":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300 dark:hover:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800">
          {bookingCount} Buchung{bookingCount !== 1 ? 'en' : ''}
        </Badge>
      );
    default:
      return null;
  }
}
