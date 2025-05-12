
import { useState, useEffect } from "react";
import { format, addHours } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { Asset, Employee } from "@/lib/types";
import { createBooking } from "@/data/bookings";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface BookingDialogProps {
  asset: Asset;
  initialDate?: Date;
  employees: Employee[];
  onClose: () => void;
}

export default function BookingDialog({
  asset,
  initialDate,
  employees,
  onClose
}: BookingDialogProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(initialDate);
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialDate ? addHours(initialDate, 8) : undefined
  );
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [employeeId, setEmployeeId] = useState("");
  const [purpose, setPurpose] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Set employee ID to the first employee in the list
    if (employees.length > 0 && !employeeId) {
      setEmployeeId(employees[0].id);
    }
  }, [employees, employeeId]);

  // Handle date selection and close popover
  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    setStartDateOpen(false);
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date);
    setEndDateOpen(false);
  };

  const handleBook = async () => {
    if (!startDate || !endDate || !employeeId) {
      toast({
        variant: "destructive",
        title: "Fehlende Informationen",
        description: "Bitte füllen Sie alle erforderlichen Felder aus.",
      });
      return;
    }

    // Combine date and time
    const startDateTime = new Date(startDate);
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    startDateTime.setHours(startHours, startMinutes, 0, 0);

    const endDateTime = new Date(endDate);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    endDateTime.setHours(endHours, endMinutes, 0, 0);

    // Validate dates
    if (startDateTime >= endDateTime) {
      toast({
        variant: "destructive",
        title: "Ungültiger Zeitraum",
        description: "Die Startzeit muss vor der Endzeit liegen.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Format dates to ISO string to avoid serialization issues
      const startDateISO = startDateTime.toISOString();
      const endDateISO = endDateTime.toISOString();

      console.log("Booking asset with dates:", {
        assetId: asset.id,
        employeeId,
        startDate: startDateISO,
        endDate: endDateISO,
        purpose
      });

      const booking = await createBooking(
        asset.id,
        employeeId,
        startDateISO,
        endDateISO,
        purpose
      );

      if (booking) {
        toast({
          title: "Buchung erfolgreich",
          description: `${asset.name} wurde erfolgreich für den angegebenen Zeitraum gebucht.`,
        });
        onClose();
      } else {
        throw new Error("Buchung konnte nicht erstellt werden");
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        variant: "destructive",
        title: "Fehler bei der Buchung",
        description: error.message || "Ein unbekannter Fehler ist aufgetreten.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate time options (from 00:00 to 23:30 in 30 min intervals)
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2).toString().padStart(2, '0');
    const minutes = (i % 2 === 0 ? '00' : '30');
    return `${hours}:${minutes}`;
  });

  // Content for both mobile and desktop views
  const DialogContent = () => (
    <div className="grid gap-4 py-4 overflow-y-auto max-h-[calc(100vh-200px)]">
      <div className="grid gap-2">
        <Label htmlFor="employee">Mitarbeiter</Label>
        <Select value={employeeId} onValueChange={setEmployeeId}>
          <SelectTrigger id="employee">
            <SelectValue placeholder="Mitarbeiter auswählen" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Startdatum</Label>
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "dd.MM.yyyy") : "Datum wählen"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="start-time">Startzeit</Label>
          <Select value={startTime} onValueChange={setStartTime}>
            <SelectTrigger id="start-time">
              <SelectValue placeholder="Startzeit" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={`start-${time}`} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Enddatum</Label>
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "dd.MM.yyyy") : "Datum wählen"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="end-time">Endzeit</Label>
          <Select value={endTime} onValueChange={setEndTime}>
            <SelectTrigger id="end-time">
              <SelectValue placeholder="Endzeit" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={`end-${time}`} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="purpose">Verwendungszweck (optional)</Label>
        <Textarea
          id="purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="Zweck der Buchung, z.B. Kundenmeeting, Test, etc."
          className="resize-none"
        />
      </div>
    </div>
  );

  const DialogActions = () => (
    <>
      <Button variant="outline" onClick={onClose}>Abbrechen</Button>
      <Button onClick={handleBook} disabled={isLoading}>
        {isLoading ? "Wird gebucht..." : "Buchen"}
      </Button>
    </>
  );

  // Render different components based on device type
  if (isMobile) {
    return (
      <Drawer open={true} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Poolgerät buchen</DrawerTitle>
            <DrawerDescription>
              Buchen Sie {asset.name} ({asset.manufacturer} {asset.model})
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            <DialogContent />
          </div>
          <DrawerFooter className="pt-2">
            <DialogActions />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Poolgerät buchen</DialogTitle>
          <DialogDescription>
            Buchen Sie {asset.name} ({asset.manufacturer} {asset.model}) für einen bestimmten Zeitraum.
          </DialogDescription>
        </DialogHeader>
        <DialogContent />
        <DialogFooter>
          <DialogActions />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
