
import { useState } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Asset, AssetBooking, Employee } from "@/lib/types";
import BookingDetailDialog from "./BookingDetailDialog";
import BookingTableRow from "./BookingTableRow";
import BookingPagination from "./BookingPagination";
import { useBookingActions } from "./hooks/useBookingActions";

interface BookingListProps {
  assets: Asset[];
  bookings: AssetBooking[];
  employees: Employee[];
  onAssetSelect: (asset: Asset) => void;
  onRefresh: () => void;
}

export default function BookingList({
  assets,
  bookings,
  employees,
  onAssetSelect,
  onRefresh
}: BookingListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;

  const {
    selectedBooking,
    bookingToCancel,
    showReturnDialog,
    handleViewDetails,
    handleReturnRequest,
    handleCancelRequest,
    handleCancelBooking,
    handleReturnAsset,
    closeDialogs,
    setShowReturnDialog
  } = useBookingActions(onRefresh);

  // Debug logging
  console.log("=== BookingList Debug Info ===");
  console.log("Total assets:", assets.length);
  console.log("Total bookings:", bookings.length);
  console.log("Assets:", assets.map(a => ({ id: a.id, name: a.name, isPoolDevice: a.isPoolDevice, status: a.status })));
  console.log("All bookings:", bookings.map(b => ({ 
    id: b.id, 
    assetId: b.assetId, 
    status: b.status, 
    startDate: b.startDate, 
    endDate: b.endDate 
  })));

  // Get asset details by ID
  const getAsset = (assetId: string): Asset | undefined => {
    return assets.find(a => a.id === assetId);
  };

  // Get employee details by ID
  const getEmployee = (employeeId: string): Employee | undefined => {
    return employees.find(e => e.id === employeeId);
  };

  // Determine if an asset is a pool device
  const isPoolDevice = (asset: Asset): boolean => {
    return asset.isPoolDevice === true || asset.status === 'pool';
  };

  // Filter bookings to only show those with existing assets that are pool devices
  const relevantBookings = bookings.filter(booking => {
    const asset = getAsset(booking.assetId);
    
    if (!asset) {
      console.log(`Excluding booking ${booking.id}: asset ${booking.assetId} not found`);
      return false;
    }
    
    if (!isPoolDevice(asset)) {
      console.log(`Excluding booking ${booking.id}: asset ${asset.name} is not a pool device (isPoolDevice: ${asset.isPoolDevice}, status: ${asset.status})`);
      return false;
    }
    
    console.log(`Including booking ${booking.id} for pool asset ${asset.name} (isPoolDevice: ${asset.isPoolDevice}, status: ${asset.status})`);
    return true;
  });

  console.log("Relevant bookings to display:", relevantBookings.length);
  console.log("Relevant bookings data:", relevantBookings);

  // Sorted bookings - prioritize active and reserved bookings
  const sortedBookings = relevantBookings.sort((a, b) => {
    const statusPriority = { 'active': 1, 'reserved': 2, 'completed': 3, 'canceled': 4 };
    const aPriority = statusPriority[a.status as keyof typeof statusPriority] || 5;
    const bPriority = statusPriority[b.status as keyof typeof statusPriority] || 5;
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });
    
  // Calculate pagination values
  const totalBookings = sortedBookings.length;
  const totalPages = Math.ceil(totalBookings / bookingsPerPage);
  const startIndex = (currentPage - 1) * bookingsPerPage;
  const paginatedBookings = sortedBookings.slice(startIndex, startIndex + bookingsPerPage);

  console.log("Final display bookings:", paginatedBookings.length);

  return (
    <div>
      {sortedBookings.length > 0 ? (
        <>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Zeige {sortedBookings.length} Buchung(en) für Poolgeräte
            </p>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gerät</TableHead>
                <TableHead>Mitarbeiter</TableHead>
                <TableHead>Zeitraum</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBookings.map(booking => {
                const asset = getAsset(booking.assetId);
                const employee = getEmployee(booking.employeeId);
                
                if (!asset) {
                  console.warn(`Asset ${booking.assetId} not found for booking ${booking.id}`);
                  return null;
                }
                
                return (
                  <BookingTableRow
                    key={booking.id}
                    booking={booking}
                    asset={asset}
                    employee={employee}
                    onViewDetails={handleViewDetails}
                    onReturn={handleReturnRequest}
                    onCancel={handleCancelRequest}
                  />
                );
              })}
            </TableBody>
          </Table>
          
          <BookingPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalBookings={totalBookings}
            bookingsPerPage={bookingsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <div className="p-4 bg-n26-secondary/20 rounded-lg">
            <h3 className="font-semibold mb-2">Keine Buchungen gefunden</h3>
            <p>Es wurden noch keine Buchungen für Poolgeräte erstellt.</p>
          </div>
        </div>
      )}

      {/* Booking detail dialog */}
      {selectedBooking && (
        <BookingDetailDialog
          booking={selectedBooking}
          asset={assets.find(a => a.id === selectedBooking.assetId)}
          employee={employees.find(e => e.id === selectedBooking.employeeId)}
          onClose={closeDialogs}
          showReturnDialog={showReturnDialog}
          onReturn={handleReturnAsset}
          onCloseReturnDialog={() => setShowReturnDialog(false)}
        />
      )}

      {/* Cancel booking confirmation dialog */}
      <Dialog open={!!bookingToCancel} onOpenChange={closeDialogs}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buchung stornieren</DialogTitle>
            <DialogDescription>
              Möchten Sie diese Buchung wirklich stornieren? Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={closeDialogs}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking}>
              Stornieren
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
