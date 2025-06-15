
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Asset, Employee } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBookingForm } from "./hooks/useBookingForm";
import BookingForm from "./components/BookingForm";

interface BookingDialogProps {
  asset?: Asset | null;
  initialDate?: Date;
  employees: Employee[];
  onClose: () => void;
}

export default function BookingDialog({
  asset: initialAsset,
  initialDate,
  employees,
  onClose
}: BookingDialogProps) {
  const isMobile = useIsMobile();
  
  const {
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
  } = useBookingForm({
    initialAsset,
    initialDate,
    employees,
    onSuccess: onClose
  });

  const DialogActions = () => (
    <>
      <Button variant="outline" onClick={onClose}>Abbrechen</Button>
      <Button onClick={handleSubmit} disabled={isLoading}>
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
              Wählen Sie ein Poolgerät und einen Zeitraum für die Buchung aus.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            <BookingForm
              selectedAssetId={selectedAssetId}
              setSelectedAssetId={setSelectedAssetId}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              startTime={startTime}
              setStartTime={setStartTime}
              endTime={endTime}
              setEndTime={setEndTime}
              employeeId={employeeId}
              setEmployeeId={setEmployeeId}
              purpose={purpose}
              setPurpose={setPurpose}
              poolAssets={poolAssets}
              employees={employees}
            />
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
            Wählen Sie ein Poolgerät und einen Zeitraum für die Buchung aus.
          </DialogDescription>
        </DialogHeader>
        <BookingForm
          selectedAssetId={selectedAssetId}
          setSelectedAssetId={setSelectedAssetId}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          employeeId={employeeId}
          setEmployeeId={setEmployeeId}
          purpose={purpose}
          setPurpose={setPurpose}
          poolAssets={poolAssets}
          employees={employees}
        />
        <DialogFooter>
          <DialogActions />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
