
import { format, parseISO } from "date-fns";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Asset, AssetBooking, Employee } from "@/lib/types";
import BookingStatusActions from "./BookingStatusActions";
import { getStatusLabel, getStatusBadgeVariant } from "@/data/bookings";

interface BookingTableRowProps {
  booking: AssetBooking;
  asset: Asset;
  employee: Employee | undefined;
  onViewDetails: (booking: AssetBooking) => void;
  onReturn: (booking: AssetBooking) => void;
  onCancel: (booking: AssetBooking) => void;
}

export default function BookingTableRow({
  booking,
  asset,
  employee,
  onViewDetails,
  onReturn,
  onCancel
}: BookingTableRowProps) {
  console.log(`Rendering booking ${booking.id}:`, {
    asset: asset.name,
    employee: `${employee?.firstName} ${employee?.lastName}`,
    status: booking.status
  });

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{asset.name}</div>
        <div className="text-sm text-muted-foreground">
          {asset.manufacturer} {asset.model}
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
        <BookingStatusActions
          booking={booking}
          onViewDetails={onViewDetails}
          onReturn={onReturn}
          onCancel={onCancel}
        />
      </TableCell>
    </TableRow>
  );
}
