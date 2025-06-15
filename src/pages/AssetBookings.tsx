import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllBookings, updateBookingStatuses } from "@/data/bookings";
import { getAssets } from "@/data/assets";
import { getEmployees } from "@/data/employees";
import { useToast } from "@/hooks/use-toast";
import { AssetType } from "@/lib/types";
import PageTransition from "@/components/layout/PageTransition";
import BookingHeader from "@/components/bookings/BookingHeader";
import BookingControls from "@/components/bookings/BookingControls";
import BookingEmptyState from "@/components/bookings/BookingEmptyState";
import BookingList from "@/components/bookings/BookingList";
import BookingCalendarView from "@/components/bookings/BookingCalendarView";
import BookingDialog from "@/components/bookings/BookingDialog";

export default function AssetBookings() {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  
  // Fetch data
  const { data: bookings, isLoading: isLoadingBookings, refetch: refetchBookings } = 
    useQuery({
      queryKey: ["bookings"],
      queryFn: getAllBookings
    });
  
  const { data: assets = [], isLoading: isLoadingAssets } = 
    useQuery({
      queryKey: ["assets"],
      queryFn: getAssets
    });
  
  const { data: employees, isLoading: isLoadingEmployees } = 
    useQuery({
      queryKey: ["employees"],
      queryFn: getEmployees
    });
  
  // Filter assets that are pool devices
  const poolAssets = assets.filter(asset => 
    asset.isPoolDevice === true || 
    asset.status === 'pool'
  );
  
  // Apply filters
  const filteredAssets = poolAssets.filter(asset => {
    const matchesType = selectedAssetType === "all" || asset.type === selectedAssetType;
    const matchesSearch = searchTerm === "" || 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesSearch;
  });
    
  // Update booking statuses periodically
  useEffect(() => {
    const updateStatuses = async () => {
      await updateBookingStatuses();
      refetchBookings();
    };
    
    updateStatuses();
    const interval = setInterval(updateStatuses, 60000);
    return () => clearInterval(interval);
  }, [refetchBookings]);
  
  const handleRefresh = async () => {
    await updateBookingStatuses();
    refetchBookings();
    toast({
      title: "Aktualisiert",
      description: "Buchungsdaten wurden erfolgreich aktualisiert.",
    });
  };
  
  const handleAssetSelect = (asset: any, date?: Date) => {
    setSelectedAsset(asset);
    if (date) {
      setSelectedDate(date);
    }
    setShowBookingDialog(true);
  };

  const handleCreateBooking = () => {
    // Reset selected asset to allow free selection
    setSelectedAsset(null);
    setShowBookingDialog(true);
  };
  
  const handleCloseDialog = () => {
    setSelectedAsset(null);
    setShowBookingDialog(false);
    refetchBookings();
  };
  
  const isLoading = isLoadingBookings || isLoadingAssets || isLoadingEmployees;

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-n26-light via-white to-n26-secondary/20">
        <div className="container mx-auto py-6 px-4 md:px-8 max-w-7xl space-y-6">
          <BookingHeader 
            filteredAssetsCount={filteredAssets.length}
            onRefresh={handleRefresh}
            isLoading={isLoading}
            bookings={bookings || []}
            assets={assets}
            onCreateBooking={handleCreateBooking}
          />
          
          <BookingControls
            view={view}
            setView={setView}
            selectedAssetType={selectedAssetType}
            setSelectedAssetType={setSelectedAssetType}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          
          {/* Main Content */}
          <div className="bg-white/50 backdrop-blur-sm border border-n26-secondary/30 rounded-lg p-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-n26-primary"></div>
              </div>
            ) : filteredAssets.length === 0 ? (
              <BookingEmptyState 
                filteredAssetsCount={filteredAssets.length}
                selectedAssetType={selectedAssetType}
                searchTerm={searchTerm}
                onCreateBooking={handleCreateBooking}
              />
            ) : view === "calendar" ? (
              <BookingCalendarView
                assets={filteredAssets}
                bookings={bookings || []}
                onAssetSelect={handleAssetSelect}
              />
            ) : (
              <BookingList
                assets={filteredAssets}
                bookings={bookings || []}
                employees={employees || []}
                onAssetSelect={handleAssetSelect}
                onRefresh={refetchBookings}
              />
            )}
          </div>
        </div>
      </div>
      
      {showBookingDialog && (
        <BookingDialog
          asset={selectedAsset}
          initialDate={selectedDate}
          employees={employees || []}
          onClose={handleCloseDialog}
        />
      )}
    </PageTransition>
  );
}
