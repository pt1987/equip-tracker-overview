
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { AssetBooking } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { addAssetHistoryEntry } from '@/data/assets/history';
import { getUserId } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { getEmployeeById } from "@/data/employees/fetch";

interface BookingHistorySectionProps {
  bookings: AssetBooking[];
  getBookingDisplayStatus: (booking: AssetBooking) => string;
  getStatusLabel: (status: string) => string;
  getStatusBadgeVariant: (status: string) => "default" | "secondary" | "destructive" | "outline";
  assetId: string; // Required prop
}

export default function BookingHistorySection({
  bookings,
  getBookingDisplayStatus,
  getStatusLabel,
  getStatusBadgeVariant,
  assetId
}: BookingHistorySectionProps) {
  const isMobile = useIsMobile();
  const [isProcessing, setIsProcessing] = useState(false);
  const [employeeNames, setEmployeeNames] = useState<Record<string, string>>({});
  
  // Fetch employee names for the bookings
  useEffect(() => {
    const fetchEmployeeNames = async () => {
      if (bookings.length === 0) return;
      
      try {
        const employeeIds = [...new Set(bookings.map(booking => booking.employeeId).filter(Boolean))];
        const namesMap: Record<string, string> = {};
        
        for (const empId of employeeIds) {
          if (empId) {
            const employee = await getEmployeeById(empId);
            if (employee) {
              namesMap[empId] = `${employee.firstName} ${employee.lastName}`;
            }
          }
        }
        
        setEmployeeNames(namesMap);
      } catch (error) {
        console.error("Error fetching employee names:", error);
      }
    };
    
    fetchEmployeeNames();
  }, [bookings]);
  
  // Ensure past bookings are logged in asset history
  useEffect(() => {
    const ensureBookingsAreInHistory = async () => {
      // This is a safeguard to ensure all existing bookings are in history
      // In a real app, you'd track this more systematically
      if (bookings.length > 0 && assetId) {
        try {
          setIsProcessing(true);
          const userId = await getUserId();
          // We don't want to perform actual writes in this effect
          // This is just a demonstration of how we could ensure history entries exist
          console.log(`Would ensure ${bookings.length} bookings are in history for asset ${assetId}`);
        } catch (error) {
          console.error("Error in booking history check:", error);
        } finally {
          setIsProcessing(false);
        }
      }
    };
    
    ensureBookingsAreInHistory();
  }, [bookings, assetId]);
  
  if (bookings.length === 0) {
    return null;
  }
  
  // Helper function to get employee name
  const getEmployeeName = (employeeId: string | null): string => {
    if (!employeeId) return "";
    return employeeNames[employeeId] || "Wird geladen...";
  };
  
  return (
    <div>
      <h3 className={`text-md font-medium mb-2 ${isMobile ? 'text-sm' : ''}`}>Letzte Buchungen</h3>
      <div className="border rounded-md divide-y">
        {bookings.slice(0, 5).map(booking => (
          <div key={booking.id} className={`p-3 ${isMobile ? 'text-xs' : ''}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                  {format(parseISO(booking.startDate), "dd.MM.yyyy")} - 
                  {format(parseISO(booking.endDate), "dd.MM.yyyy")}
                </div>
                {booking.employeeId && (
                  <div className={`${isMobile ? 'text-xs' : 'text-sm'} mt-1`}>
                    Mitarbeiter: {getEmployeeName(booking.employeeId)}
                  </div>
                )}
                {booking.returnInfo?.returned && (
                  <Badge variant="outline" className={`mt-1 ${isMobile ? 'text-xs px-1 py-0' : ''}`}>
                    Zurückgegeben am {format(parseISO(booking.returnInfo.returnedAt!), "dd.MM.yyyy")}
                  </Badge>
                )}
              </div>
              <Badge 
                variant={getStatusBadgeVariant(getBookingDisplayStatus(booking))}
                className={isMobile ? 'text-xs px-1 py-0' : ''}
              >
                {getStatusLabel(getBookingDisplayStatus(booking))}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
