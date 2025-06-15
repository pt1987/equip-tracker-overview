
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Trash2, Check, X, Eye } from "lucide-react";
import { Asset, AssetBooking, BookingStatus, Employee } from "@/lib/types";
import { updateBookingStatus, recordAssetReturn } from "@/data/bookings";
import { useToast } from "@/hooks/use-toast";
import BookingDetailDialog from "./BookingDetailDialog";

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
  const [selectedBooking, setSelectedBooking] = useState<AssetBooking | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<AssetBooking | null>(null);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const { toast } = useToast();
  
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;

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

  // FIXED: Show ALL bookings - don't filter by asset existence
  // This way we can see bookings even if the asset was deleted or changed
  const relevantBookings = bookings.filter(booking => {
    // Show all bookings - we'll handle missing assets in the display
    console.log(`Including booking ${booking.id}: assetId=${booking.assetId}`);
    return true;
  });

  console.log("Relevant bookings to display:", relevantBookings.length);
  console.log("Relevant bookings data:", relevantBookings);

  // Handle booking cancellation
  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;

    try {
      await updateBookingStatus(bookingToCancel.id, 'canceled');
      toast({
        title: "Buchung storniert",
        description: "Die Buchung wurde erfolgreich storniert.",
      });
      setBookingToCancel(null);
      onRefresh();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Die Buchung konnte nicht storniert werden.",
      });
    }
  };

  // Handle asset return
  const handleReturnAsset = async (condition: 'good' | 'damaged' | 'incomplete' | 'lost', comments?: string) => {
    if (!selectedBooking) return;

    try {
      await recordAssetReturn(selectedBooking.id, condition, comments);
      toast({
        title: "Gerät zurückgegeben",
        description: "Das Gerät wurde erfolgreich zurückgegeben.",
      });
      setSelectedBooking(null);
      setShowReturnDialog(false);
      onRefresh();
    } catch (error) {
      console.error("Error returning asset:", error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Das Gerät konnte nicht zurückgegeben werden.",
      });
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: BookingStatus) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'reserved':
        return 'secondary';
      case 'completed':
        return 'outline';
      case 'canceled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  // Get status label
  const getStatusLabel = (status: BookingStatus) => {
    switch (status) {
      case 'active':
        return 'Aktiv';
      case 'reserved':
        return 'Reserviert';
      case 'completed':
        return 'Abgeschlossen';
      case 'canceled':
        return 'Storniert';
      default:
        return status;
    }
  };

  // Sorted bookings - prioritize active and reserved bookings
  const sortedBookings = relevantBookings.sort((a, b) => {
    // Sort by status priority first
    const statusPriority = { 'active': 1, 'reserved': 2, 'completed': 3, 'canceled': 4 };
    const aPriority = statusPriority[a.status as keyof typeof statusPriority] || 5;
    const bPriority = statusPriority[b.status as keyof typeof statusPriority] || 5;
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    // Then sort by start date (newest first)
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
              Zeige {sortedBookings.length} Buchung(en)
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
                
                console.log(`Rendering booking ${booking.id}:`, {
                  asset: asset?.name || 'Asset nicht gefunden',
                  employee: `${employee?.firstName} ${employee?.lastName}`,
                  status: booking.status
                });
                
                return (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="font-medium">
                        {asset?.name || `Asset nicht gefunden (${booking.assetId.slice(0, 8)}...)`}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {asset ? `${asset.manufacturer} ${asset.model}` : 'Details nicht verfügbar'}
                      </div>
                      {!asset && (
                        <Badge variant="outline" className="text-xs mt-1">
                          Asset gelöscht/nicht verfügbar
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {employee ? (
                        <div>
                          <div className="font-medium">
                            {employee.firstName} {employee.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {employee.position}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Unbekannt</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Start: {format(parseISO(booking.startDate), "dd.MM.yyyy HH:mm")}</div>
                        <div>Ende: {format(parseISO(booking.endDate), "dd.MM.yyyy HH:mm")}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(booking.status)}>
                        {getStatusLabel(booking.status)}
                      </Badge>
                      {booking.returnInfo?.returned && (
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs">
                            Zurückgegeben
                          </Badge>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedBooking(booking)}
                          title="Details anzeigen"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {booking.status === 'active' && !booking.returnInfo?.returned && asset && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowReturnDialog(true);
                            }}
                            title="Gerät zurückgeben"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {(booking.status === 'reserved' || booking.status === 'active') && !booking.returnInfo?.returned && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setBookingToCancel(booking)}
                            title="Buchung stornieren"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {/* Add pagination if needed */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        isActive={currentPage === page} 
                        onClick={() => setCurrentPage(page)}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
          
          {/* Display information about showing X of Y bookings */}
          {totalBookings > bookingsPerPage && (
            <div className="text-center text-sm text-muted-foreground mt-2">
              Zeige {Math.min(startIndex + 1, totalBookings)}-{Math.min(startIndex + bookingsPerPage, totalBookings)} von {totalBookings} Buchungen
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <div className="p-4 bg-n26-secondary/20 rounded-lg">
            <h3 className="font-semibold mb-2">Keine Buchungen gefunden</h3>
            <p>Es wurden noch keine Buchungen erstellt.</p>
          </div>
        </div>
      )}

      {/* Booking detail dialog */}
      {selectedBooking && (
        <BookingDetailDialog
          booking={selectedBooking}
          asset={assets.find(a => a.id === selectedBooking.assetId)}
          employee={employees.find(e => e.id === selectedBooking.employeeId)}
          onClose={() => setSelectedBooking(null)}
          showReturnDialog={showReturnDialog}
          onReturn={handleReturnAsset}
          onCloseReturnDialog={() => setShowReturnDialog(false)}
        />
      )}

      {/* Cancel booking confirmation dialog */}
      <Dialog open={!!bookingToCancel} onOpenChange={() => setBookingToCancel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buchung stornieren</DialogTitle>
            <DialogDescription>
              Möchten Sie diese Buchung wirklich stornieren? Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setBookingToCancel(null)}>
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
