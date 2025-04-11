
import { useState, useEffect } from "react";
import { Asset } from "@/lib/types";
import { getEmployeeById } from "@/data/employees";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

// Import new component parts
import AssetImage from "./details/AssetImage";
import AssetHeaderInfo from "./details/AssetHeaderInfo";
import AssetTechnicalDetails from "./details/AssetTechnicalDetails";
import ConnectedAsset from "./details/ConnectedAsset";
import AssetStatusIndicator from "@/components/bookings/AssetStatusIndicator";
import { getCurrentOrUpcomingBooking } from "@/data/bookings";

interface AssetDetailViewProps {
  asset: Asset;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}

export default function AssetDetailView({
  asset,
  onEdit,
  onDelete
}: AssetDetailViewProps) {
  const [employeeData, setEmployeeData] = useState<any | null>(null);
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<"available" | "booked" | "available-partial">("available");
  const [loadingBookingStatus, setLoadingBookingStatus] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmployee = async () => {
      if (asset.employeeId) {
        setIsLoadingEmployee(true);
        try {
          const employee = await getEmployeeById(asset.employeeId);
          setEmployeeData(employee);
        } catch (error) {
          console.error("Error fetching employee data:", error);
        } finally {
          setIsLoadingEmployee(false);
        }
      }
    };

    // Fetch booking status for pool devices
    const fetchBookingStatus = async () => {
      if (asset.isPoolDevice || asset.status === 'pool') {
        setLoadingBookingStatus(true);
        try {
          const currentBooking = await getCurrentOrUpcomingBooking(asset.id);
          if (currentBooking && currentBooking.status === 'active') {
            setBookingStatus("booked");
          } else if (currentBooking && currentBooking.status === 'reserved') {
            setBookingStatus("available-partial");
          } else {
            setBookingStatus("available");
          }
        } catch (error) {
          console.error("Error fetching booking status:", error);
        } finally {
          setLoadingBookingStatus(false);
        }
      }
    };
    
    fetchEmployee();
    fetchBookingStatus();
  }, [asset.employeeId, asset.isPoolDevice, asset.status, asset.id]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AssetImage imageUrl={asset.imageUrl} altText={asset.name} />
        <div>
          <AssetHeaderInfo asset={asset} onEdit={onEdit} onDelete={onDelete} />
          
          {/* Anzeigen des Pool-Status, wenn es ein Pool-Gerät ist */}
          {(asset.isPoolDevice || asset.status === 'pool') && (
            <div className="mt-4 flex items-center gap-2">
              <span className="font-medium">Buchungsstatus:</span> 
              {loadingBookingStatus ? (
                <span className="text-sm text-muted-foreground">Wird geladen...</span>
              ) : (
                <AssetStatusIndicator status={bookingStatus} />
              )}
            </div>
          )}
        </div>
      </div>

      <AssetTechnicalDetails asset={asset} />

      {asset.connectedAssetId && <ConnectedAsset connectedAssetId={asset.connectedAssetId} />}
    </div>
  );
}
