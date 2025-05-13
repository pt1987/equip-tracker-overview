
import { useState, useEffect } from "react";
import { Asset, AssetReview } from "@/lib/types";
import { getEmployeeById } from "@/data/employees";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile, useBreakpoint } from "@/hooks/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import component parts
import AssetImage from "./details/AssetImage";
import AssetHeaderInfo from "./details/AssetHeaderInfo";
import AssetTechnicalDetails from "./details/AssetTechnicalDetails";
import ConnectedAsset from "./details/ConnectedAsset";
import ComplianceSection from "./details/ComplianceSection";
import AssetReviewHistory from "./details/AssetReviewHistory";
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
  const [currentAsset, setCurrentAsset] = useState<Asset>(asset);
  const [activeTab, setActiveTab] = useState<"details" | "compliance">("details");
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const isSmallScreen = useBreakpoint('sm');

  useEffect(() => {
    const fetchEmployee = async () => {
      if (currentAsset.employeeId) {
        setIsLoadingEmployee(true);
        try {
          const employee = await getEmployeeById(currentAsset.employeeId);
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
      if (currentAsset.isPoolDevice || currentAsset.status === 'pool') {
        setLoadingBookingStatus(true);
        try {
          const currentBooking = await getCurrentOrUpcomingBooking(currentAsset.id);
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
  }, [currentAsset.employeeId, currentAsset.isPoolDevice, currentAsset.status, currentAsset.id]);

  const handleAssetUpdate = (updatedAsset: Asset) => {
    setCurrentAsset(updatedAsset);
  };

  const handleReviewAdded = (review: AssetReview) => {
    // In a real app, this would be saved to the database
    // For now, just update the asset's lastReviewDate and nextReviewDate
    const updatedAsset = {
      ...currentAsset,
      lastReviewDate: review.reviewDate,
      nextReviewDate: review.nextReviewDate
    };
    setCurrentAsset(updatedAsset);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "details" | "compliance");
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className={`${isSmallScreen ? 'order-2' : ''}`}>
          <AssetImage imageUrl={currentAsset.imageUrl} altText={currentAsset.name} />
        </div>
        <div className={`${isSmallScreen ? 'order-1' : ''}`}>
          <AssetHeaderInfo asset={currentAsset} onEdit={onEdit} onDelete={onDelete} />
          
          {/* Anzeigen des Pool-Status, wenn es ein Pool-Gerät ist */}
          {(currentAsset.isPoolDevice || currentAsset.status === 'pool') && (
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

      {isMobile ? (
        <div className="space-y-4">
          <div className="mb-2">
            <Select 
              id="mobile-asset-tab-selector" 
              value={activeTab} 
              onValueChange={handleTabChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Bereich auswählen">
                  {activeTab === "details" ? "Technische Details" : "ISO 27001 Compliance"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="details">Technische Details</SelectItem>
                <SelectItem value="compliance">ISO 27001 Compliance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {activeTab === "details" && (
            <div className="space-y-5">
              <AssetTechnicalDetails asset={currentAsset} />
              {currentAsset.connectedAssetId && (
                <ConnectedAsset connectedAssetId={currentAsset.connectedAssetId} />
              )}
            </div>
          )}
          
          {activeTab === "compliance" && (
            <div className="space-y-5">
              <ComplianceSection asset={currentAsset} onAssetUpdate={handleAssetUpdate} />
              <AssetReviewHistory asset={currentAsset} onReviewAdded={handleReviewAdded} />
            </div>
          )}
        </div>
      ) : (
        <Tabs id="asset-details-tabs" value={activeTab} onValueChange={(value) => setActiveTab(value as "details" | "compliance")} className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="details">Technische Details</TabsTrigger>
            <TabsTrigger value="compliance">ISO 27001 Compliance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6 pt-4">
            <AssetTechnicalDetails asset={currentAsset} />
            {currentAsset.connectedAssetId && <ConnectedAsset connectedAssetId={currentAsset.connectedAssetId} />}
          </TabsContent>
          
          <TabsContent value="compliance" className="space-y-6 pt-4">
            <ComplianceSection asset={currentAsset} onAssetUpdate={handleAssetUpdate} />
            <AssetReviewHistory asset={currentAsset} onReviewAdded={handleReviewAdded} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
