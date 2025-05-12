
import { Asset } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AssetTechnicalDetailsProps {
  asset: Asset;
}

export default function AssetTechnicalDetails({ asset }: AssetTechnicalDetailsProps) {
  const isMobile = useIsMobile();
  
  return (
    <Card className="shadow-sm">
      <CardHeader className={`${isMobile ? 'pb-2 pt-3 px-3' : 'pb-3'}`}>
        <CardTitle className="text-xl">Technische Details</CardTitle>
      </CardHeader>
      <CardContent className={`${isMobile ? 'pt-0 px-3 pb-3' : 'pt-0'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {asset.serialNumber && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Seriennummer</p>
              <p className="font-medium tracking-wide break-all">{asset.serialNumber}</p>
            </div>
          )}
          
          {asset.inventoryNumber && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Inventar-Nr.</p>
              <p className="font-medium break-all">{asset.inventoryNumber}</p>
            </div>
          )}
          
          {asset.imei && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">IMEI</p>
              <p className="font-medium break-all">{asset.imei}</p>
            </div>
          )}
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Garantie</p>
            <p className="font-medium flex items-center flex-wrap">
              {asset.hasWarranty ? (
                <>
                  <ShieldCheck className="h-4 w-4 mr-1 text-green-500" />
                  Ja
                  {asset.additionalWarranty && ", erweitert"}
                </>
              ) : (
                <>
                  <ShieldAlert className="h-4 w-4 mr-1 text-gray-400" />
                  Nein
                </>
              )}
            </p>
          </div>
          
          {asset.hasWarranty && asset.warrantyExpiryDate && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Garantie gültig bis</p>
              <p className="font-medium">{formatDate(asset.warrantyExpiryDate)}</p>
            </div>
          )}
          
          {asset.hasWarranty && asset.warrantyInfo && (
            <div className="space-y-1 col-span-1 sm:col-span-2">
              <p className="text-sm text-muted-foreground">Garantiedetails</p>
              <p className="font-medium">{asset.warrantyInfo}</p>
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
