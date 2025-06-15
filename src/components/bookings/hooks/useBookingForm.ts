
import { useState, useEffect } from "react";
import { addHours } from "date-fns";
import { Asset, Employee } from "@/lib/types";
import { createBooking } from "@/data/bookings";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getAssets } from "@/data/assets";

interface UseBookingFormProps {
  initialAsset?: Asset | null;
  initialDate?: Date;
  employees: Employee[];
  onSuccess: () => void;
}

export const useBookingForm = ({ 
  initialAsset, 
  initialDate, 
  employees, 
  onSuccess 
}: UseBookingFormProps) => {
  const [selectedAssetId, setSelectedAssetId] = useState(initialAsset?.id || "");
  const [startDate, setStartDate] = useState<Date | undefined>(initialDate);
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialDate ? addHours(initialDate, 8) : undefined
  );
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [employeeId, setEmployeeId] = useState("");
  const [purpose, setPurpose] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch all assets for selection
  const { data: allAssets = [] } = useQuery({
    queryKey: ["assets"],
    queryFn: getAssets
  });

  // Filter only pool devices
  const poolAssets = allAssets.filter(asset => 
    asset.isPoolDevice === true || asset.status === 'pool'
  );

  useEffect(() => {
    // Set employee ID to the first employee in the list
    if (employees.length > 0 && !employeeId) {
      setEmployeeId(employees[0].id);
    }
  }, [employees, employeeId]);

  useEffect(() => {
    // Set asset ID to the first pool asset if none selected and no initial asset
    if (poolAssets.length > 0 && !selectedAssetId) {
      setSelectedAssetId(poolAssets[0].id);
    }
  }, [poolAssets, selectedAssetId]);

  const handleSubmit = async () => {
    if (!startDate || !endDate || !employeeId || !selectedAssetId) {
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
        assetId: selectedAssetId,
        employeeId,
        startDate: startDateISO,
        endDate: endDateISO,
        purpose
      });

      const booking = await createBooking(
        selectedAssetId,
        employeeId,
        startDateISO,
        endDateISO,
        purpose
      );

      if (booking) {
        const selectedAsset = poolAssets.find(a => a.id === selectedAssetId);
        toast({
          title: "Buchung erfolgreich",
          description: `${selectedAsset?.name || 'Gerät'} wurde erfolgreich für den angegebenen Zeitraum gebucht.`,
        });
        onSuccess();
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

  return {
    selectedAssetId,
    setSelectedAssetId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    employeeId,
    setEmployeeId,
    purpose,
    setPurpose,
    isLoading,
    poolAssets,
    handleSubmit
  };
};
