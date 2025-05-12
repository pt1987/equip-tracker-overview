
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Calendar as CalendarIcon, List, RefreshCw } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import { useQuery } from "@tanstack/react-query";
import { getAllBookings, updateBookingStatuses } from "@/data/bookings";
import { getAssets } from "@/data/assets";
import { getEmployees } from "@/data/employees";
import { useToast } from "@/hooks/use-toast";
import { AssetType } from "@/lib/types";
import BookingList from "@/components/bookings/BookingList";
import BookingCalendarView from "@/components/bookings/BookingCalendarView";
import BookingDialog from "@/components/bookings/BookingDialog";
import AssetTypeFilter from "@/components/bookings/AssetTypeFilter";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AssetBookings() {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType | "all">("all");
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
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
  
  // Filter assets that are pool devices - fixed to include both is_pool_device and status='pool'
  const poolAssets = assets.filter(asset => 
    asset.isPoolDevice === true || 
    asset.status === 'pool'
  );
  
  // Filter by asset type
  const filteredAssets = selectedAssetType === "all"
    ? poolAssets
    : poolAssets.filter(asset => asset.type === selectedAssetType);
    
  // Update booking statuses periodically
  useEffect(() => {
    const updateStatuses = async () => {
      await updateBookingStatuses();
      refetchBookings();
    };
    
    updateStatuses();
    
    const interval = setInterval(updateStatuses, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [refetchBookings]);
  
  const handleRefresh = async () => {
    await updateBookingStatuses();
    refetchBookings();
    toast({
      title: "Aktualisiert",
      description: "Buchungsdaten wurden aktualisiert.",
    });
  };
  
  const handleAssetSelect = (asset: any, date?: Date) => {
    setSelectedAsset(asset);
    if (date) {
      setSelectedDate(date);
    }
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
      <div className="container mx-auto py-6 px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold tracking-tight`}>Poolgeräte Buchungen</h1>
              <p className="text-muted-foreground">
                Verwalten Sie die Buchungen für alle Poolgeräte und reservieren Sie Geräte.
              </p>
            </div>
            
            <div className="flex gap-2 self-start md:self-auto">
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "default"}
                onClick={handleRefresh}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                {isMobile ? "" : "Aktualisieren"}
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                  <CardTitle>Poolgeräte</CardTitle>
                  <CardDescription>
                    {filteredAssets.length} Geräte verfügbar
                  </CardDescription>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2 md:mt-0 w-full md:w-auto">
                  <AssetTypeFilter 
                    selectedType={selectedAssetType} 
                    onChange={setSelectedAssetType}
                  />
                  
                  <div className="flex border rounded-md overflow-hidden flex-grow md:flex-grow-0">
                    <Button
                      variant={view === "calendar" ? "default" : "ghost"}
                      size="sm"
                      className="rounded-none flex-1 md:flex-auto"
                      onClick={() => setView("calendar")}
                    >
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Kalender
                    </Button>
                    <Button
                      variant={view === "list" ? "default" : "ghost"}
                      size="sm"
                      className="rounded-none flex-1 md:flex-auto"
                      onClick={() => setView("list")}
                    >
                      <List className="h-4 w-4 mr-1" />
                      Liste
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mb-2" />
                  <h3 className="text-lg font-medium">Keine Poolgeräte gefunden</h3>
                  <p className="text-muted-foreground mt-1 max-w-md">
                    Es wurden keine Poolgeräte für den ausgewählten Typ gefunden. Bitte wählen Sie einen anderen Typ oder fügen Sie neue Poolgeräte hinzu.
                  </p>
                </div>
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
            </CardContent>
          </Card>
        </div>
      </div>
      
      {showBookingDialog && selectedAsset && (
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
