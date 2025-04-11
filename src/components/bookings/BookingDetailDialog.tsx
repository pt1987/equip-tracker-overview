
import { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Asset, AssetBooking, BookingReturnCondition, Employee } from "@/lib/types";

interface BookingDetailDialogProps {
  booking: AssetBooking;
  asset?: Asset;
  employee?: Employee;
  onClose: () => void;
  showReturnDialog: boolean;
  onReturn: (condition: BookingReturnCondition, comments?: string) => void;
  onCloseReturnDialog: () => void;
}

export default function BookingDetailDialog({
  booking,
  asset,
  employee,
  onClose,
  showReturnDialog,
  onReturn,
  onCloseReturnDialog
}: BookingDetailDialogProps) {
  const [condition, setCondition] = useState<BookingReturnCondition>("good");
  const [comments, setComments] = useState("");

  // Get status label
  const getStatusLabel = (status: string) => {
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

  const handleReturn = () => {
    onReturn(condition, comments);
  };

  return (
    <>
      <Dialog open={!showReturnDialog} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Buchungsdetails</DialogTitle>
            <DialogDescription>
              Details zur Buchung vom {format(parseISO(booking.startDate), "dd.MM.yyyy")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-2">
              <Label className="font-medium">Gerät:</Label>
              <div className="col-span-2">
                {asset ? `${asset.name} (${asset.manufacturer} ${asset.model})` : "Unbekannt"}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Label className="font-medium">Mitarbeiter:</Label>
              <div className="col-span-2">
                {employee ? `${employee.firstName} ${employee.lastName}` : "Unbekannt"}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Label className="font-medium">Zeitraum:</Label>
              <div className="col-span-2">
                {format(parseISO(booking.startDate), "dd.MM.yyyy HH:mm")} - 
                {format(parseISO(booking.endDate), "dd.MM.yyyy HH:mm")}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Label className="font-medium">Status:</Label>
              <div className="col-span-2">
                <Badge>
                  {getStatusLabel(booking.status)}
                </Badge>
              </div>
            </div>
            
            {booking.purpose && (
              <div className="grid grid-cols-3 gap-2">
                <Label className="font-medium">Zweck:</Label>
                <div className="col-span-2">{booking.purpose}</div>
              </div>
            )}
            
            {booking.returnInfo?.returned && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <Label className="font-medium">Zurückgegeben:</Label>
                  <div className="col-span-2">
                    {booking.returnInfo.returnedAt ? 
                      format(parseISO(booking.returnInfo.returnedAt), "dd.MM.yyyy HH:mm") : 
                      "Ja"}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <Label className="font-medium">Zustand:</Label>
                  <div className="col-span-2">
                    {booking.returnInfo.condition === "good" && "In Ordnung"}
                    {booking.returnInfo.condition === "damaged" && "Beschädigt"}
                    {booking.returnInfo.condition === "incomplete" && "Unvollständig"}
                    {booking.returnInfo.condition === "lost" && "Verloren"}
                  </div>
                </div>
                
                {booking.returnInfo.comments && (
                  <div className="grid grid-cols-3 gap-2">
                    <Label className="font-medium">Kommentar:</Label>
                    <div className="col-span-2">{booking.returnInfo.comments}</div>
                  </div>
                )}
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Schließen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Return Dialog */}
      <Dialog open={showReturnDialog} onOpenChange={onCloseReturnDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Gerät zurückgeben</DialogTitle>
            <DialogDescription>
              Bitte geben Sie den Zustand des Geräts bei der Rückgabe an
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="condition">Zustand des Geräts</Label>
              <Select 
                value={condition} 
                onValueChange={(value) => setCondition(value as BookingReturnCondition)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Zustand wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="good">In Ordnung</SelectItem>
                  <SelectItem value="damaged">Beschädigt</SelectItem>
                  <SelectItem value="incomplete">Unvollständig (Zubehör fehlt)</SelectItem>
                  <SelectItem value="lost">Verloren</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="comments">Kommentar</Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Weitere Informationen zum Zustand oder zur Rückgabe..."
                className="resize-none"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onCloseReturnDialog}>Abbrechen</Button>
            <Button onClick={handleReturn}>Zurückgeben</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
