
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

  // Get asset details by ID
  const getAsset = (assetId: string): Asset | undefined => {
    return assets.find(a => a.id === assetId);
  };

  // Get employee details by ID
  const getEmployee = (employeeId: string): Employee | undefined => {
    return employees.find(e => e.id === employeeId);
  };

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

  return (
    <div>
      {assets.length > 0 && bookings.length > 0 ? (
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
            {bookings
              .filter(booking => assets.some(asset => asset.id === booking.assetId))
              .sort((a, b) => {
                // Sort by status and then by date
                if (a.status === 'active' && b.status !== 'active') return -1;
                if (a.status !== 'active' && b.status === 'active') return 1;
                if (a.status === 'reserved' && b.status !== 'reserved') return -1;
                if (a.status !== 'reserved' && b.status === 'reserved') return 1;
                
                return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
              })
              .map(booking => {
                const asset = getAsset(booking.assetId);
                const employee = getEmployee(booking.employeeId);
                
                return (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="font-medium">{asset?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {asset?.manufacturer} {asset?.model}
                      </div>
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
                        {format(parseISO(booking.startDate), "dd.MM.yyyy HH:mm")}
                      </div>
                      <div className="text-sm">
                        {format(parseISO(booking.endDate), "dd.MM.yyyy HH:mm")}
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
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {booking.status === 'active' && !booking.returnInfo?.returned && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowReturnDialog(true);
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {(booking.status === 'reserved' || booking.status === 'active') && !booking.returnInfo?.returned && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setBookingToCancel(booking)}
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
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {assets.length === 0 
            ? "Keine Poolgeräte gefunden" 
            : "Keine Buchungen gefunden"}
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
