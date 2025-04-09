
import { Asset } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AssetTechnicalDetailsProps {
  asset: Asset;
}

export default function AssetTechnicalDetails({ asset }: AssetTechnicalDetailsProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Technische Details</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {asset.serialNumber && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Seriennummer</p>
              <p className="font-medium tracking-wide">{asset.serialNumber}</p>
            </div>
          )}
          
          {asset.inventoryNumber && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Inventar-Nr.</p>
              <p className="font-medium">{asset.inventoryNumber}</p>
            </div>
          )}
          
          {asset.imei && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">IMEI</p>
              <p className="font-medium">{asset.imei}</p>
            </div>
          )}
          
          {asset.hasWarranty !== undefined && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Garantie</p>
              <p className="font-medium">
                {asset.hasWarranty ? "Ja" : "Nein"}
                {asset.additionalWarranty && ", erweitert"}
              </p>
            </div>
          )}
        </div>
        
        {asset.type === "smartphone" && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Vertragsdaten</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {asset.phoneNumber && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Telefonnummer</p>
                  <p className="font-medium">{asset.phoneNumber}</p>
                </div>
              )}
              
              {asset.provider && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Provider</p>
                  <p className="font-medium">{asset.provider}</p>
                </div>
              )}
              
              {asset.contractName && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Vertrag</p>
                  <p className="font-medium">{asset.contractName}</p>
                </div>
              )}
              
              {asset.contractEndDate && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Vertragsende</p>
                  <p className="font-medium">{formatDate(asset.contractEndDate)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
