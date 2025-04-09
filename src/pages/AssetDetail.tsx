
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PageTransition from "@/components/layout/PageTransition";
import { getAssetById, getAssetHistoryByAssetId } from "@/data/assets";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import AssetDetailContent from "@/components/assets/details/AssetDetailContent";
import AssetLoading from "@/components/assets/details/AssetLoading";
import AssetNotFound from "@/components/assets/details/AssetNotFound";

export default function AssetDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
      <div className="container mx-auto py-8 max-w-7xl px-6">
        <div className="flex flex-col gap-6">
          <div>
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-1 -ml-3 h-9 px-2">
              <ChevronLeft size={16} className="mr-1" />
              Zurück
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Asset Details</h1>
          </div>

          <AssetDetailContent 
            asset={asset}
            assetHistory={assetHistory}
            isHistoryLoading={isHistoryLoading}
            queryClient={queryClient}
            toast={toast}
          />
        </div>
      </div>
    </PageTransition>
  );
}
