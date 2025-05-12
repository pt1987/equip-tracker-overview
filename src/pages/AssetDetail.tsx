
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PageTransition from "@/components/layout/PageTransition";
import { getAssetById, getAssetHistoryByAssetId } from "@/data/assets";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

import AssetDetailContent from "@/components/assets/details/AssetDetailContent";
import AssetLoading from "@/components/assets/details/AssetLoading";
import AssetNotFound from "@/components/assets/details/AssetNotFound";

export default function AssetDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Scroll to top when navigating to this page
  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0);
    }
  }, [id]);

  const {
    data: asset,
    isLoading: isAssetLoading,
    error: assetError
  } = useQuery({
    queryKey: ["asset", id],
    queryFn: () => getAssetById(id),
    enabled: !!id
  });

  const {
    data: assetHistory = [],
    isLoading: isHistoryLoading
  } = useQuery({
    queryKey: ["assetHistory", id],
    queryFn: () => getAssetHistoryByAssetId(id),
    enabled: !!id
  });
  
  const handleDelete = async () => {
    try {
      const { error } = await supabase.from('assets').delete().eq('id', id);
      
      if (error) {
        console.error("Delete error:", error);
        toast({
          variant: "destructive",
          title: "Fehler beim Löschen",
          description: error.message
        });
        return;
      }
      
      queryClient.invalidateQueries({
        queryKey: ["assets"]
      });
      
      toast({
        title: "Asset gelöscht",
        description: `Das Asset wurde erfolgreich gelöscht.`
      });
      
      navigate("/assets");
    } catch (err: any) {
      console.error("Delete error:", err);
      toast({
        variant: "destructive",
        title: "Fehler beim Löschen",
        description: err.message || "Ein unbekannter Fehler ist aufgetreten."
      });
    }
  };

  if (isAssetLoading) {
    return (
      <PageTransition>
        <AssetLoading />
      </PageTransition>
    );
  }

  if (assetError || !asset) {
    return (
      <PageTransition>
        <AssetNotFound />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className={`container mx-auto py-4 md:py-8 max-w-7xl ${isMobile ? 'px-3' : 'px-6'}`}>
        <div className="flex flex-col gap-4 md:gap-6">
          <div>
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-1 -ml-3 h-8 md:h-9 px-2">
              <ChevronLeft size={16} className="mr-1" />
              Zurück
            </Button>
            <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold tracking-tight`}>Asset Details</h1>
          </div>

          <AssetDetailContent 
            asset={asset}
            assetHistory={assetHistory}
            isHistoryLoading={isHistoryLoading}
            queryClient={queryClient}
            toast={toast}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </PageTransition>
  );
}
