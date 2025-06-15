
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Asset, Employee } from "@/lib/types";
import BookingAssetSelector from "./BookingAssetSelector";
import BookingTimeSelector from "./BookingTimeSelector";

interface BookingFormProps {
  selectedAssetId: string;
  setSelectedAssetId: (id: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  employeeId: string;
  setEmployeeId: (id: string) => void;
  purpose: string;
  setPurpose: (purpose: string) => void;
  poolAssets: Asset[];
  employees: Employee[];
}

export default function BookingForm({
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
  poolAssets,
  employees
}: BookingFormProps) {
  return (
    <div className="grid gap-4 py-4 overflow-y-auto max-h-[calc(100vh-200px)]">
      <BookingAssetSelector
        selectedAssetId={selectedAssetId}
        setSelectedAssetId={setSelectedAssetId}
        employeeId={employeeId}
        setEmployeeId={setEmployeeId}
        poolAssets={poolAssets}
        employees={employees}
      />
      
      <BookingTimeSelector
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
      />
      
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
}
