
import { format } from "date-fns";
import { Asset, AssetBooking } from "@/lib/types";
import { getAssetStatusOnDate } from "../utils/bookingUtils";

interface CalendarDayProps {
  day: Date;
  assets: Asset[];
  bookings: AssetBooking[];
}

export default function CalendarDay({ day, assets, bookings }: CalendarDayProps) {
  // Count how many assets are booked on this day
  const bookedCount = assets.filter(asset => 
    getAssetStatusOnDate(asset, day, bookings) === "booked"
  ).length;
  
  const partialCount = assets.filter(asset => 
    getAssetStatusOnDate(asset, day, bookings) === "available-partial"
  ).length;
  
  // Determine the color based on availability
  let bgColor = "";
  if (bookedCount === assets.length) {
    bgColor = "bg-red-100 dark:bg-red-900/20";
  } else if (bookedCount > 0 || partialCount > 0) {
    bgColor = "bg-yellow-100 dark:bg-yellow-900/20";
  } else if (assets.length > 0) {
    bgColor = "bg-green-100 dark:bg-green-900/20";
  }

  return (
    <div className={`h-9 w-9 p-0 font-normal flex items-center justify-center rounded-md ${bgColor}`}>
      {format(day, "d")}
      {(bookedCount > 0 || partialCount > 0) && (
        <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-orange-500"></span>
      )}
    </div>
  );
}
