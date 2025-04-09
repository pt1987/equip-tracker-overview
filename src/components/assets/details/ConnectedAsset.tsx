
import { useState, useEffect } from "react";
import { Asset } from "@/lib/types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAssetById } from "@/data/assets";
import { Link2 } from "lucide-react";

interface ConnectedAssetProps {
  connectedAssetId: string;
}

export default function ConnectedAsset({ connectedAssetId }: ConnectedAssetProps) {
  const [connectedAsset, setConnectedAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConnectedAsset = async () => {
      try {
        setIsLoading(true);
        const asset = await getAssetById(connectedAssetId);
        setConnectedAsset(asset);
      } catch (err) {
        console.error("Error fetching connected asset:", err);
        setError("Fehler beim Laden des verbundenen Assets");
      } finally {
        setIsLoading(false);
      }
    };

    if (connectedAssetId) {
      fetchConnectedAsset();
    }
  }, [connectedAssetId]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Verbundenes Asset</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : error ? (
          <div className="text-sm text-red-500">
            <p>{error}</p>
            <p className="text-muted-foreground">ID: {connectedAssetId}</p>
          </div>
        ) : connectedAsset ? (
          <div className="text-sm">
            <div className="flex items-center gap-3 mb-1">
              <Link2 size={16} className="text-muted-foreground" />
              <div>
                <p className="font-medium">{connectedAsset.name}</p>
                <p className="text-muted-foreground text-xs">{connectedAsset.type} • {connectedAsset.manufacturer} {connectedAsset.model}</p>
              </div>
            </div>
            <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
              <Link to={`/asset/${connectedAssetId}`}>
                Verbundenes Asset anzeigen
              </Link>
            </Button>
          </div>
        ) : (
          <div className="text-sm">
            <p className="text-muted-foreground">ID: {connectedAssetId}</p>
            <p className="text-muted-foreground text-xs">Asset nicht gefunden</p>
            <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
              <Link to={`/asset/${connectedAssetId}`}>
                Verbundenes Asset anzeigen
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
