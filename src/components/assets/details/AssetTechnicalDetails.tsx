
import { Asset } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { useIsMobile, useBreakpoint } from "@/hooks/use-mobile";

interface AssetTechnicalDetailsProps {
  asset: Asset;
}

export default function AssetTechnicalDetails({ asset }: AssetTechnicalDetailsProps) {
  const isMobile = useIsMobile();
  const isSmall = useBreakpoint('sm');
  
  return (
    <Card className="shadow-sm">
      <CardHeader className={`${isMobile ? 'pb-2 pt-3 px-3' : 'pb-3'}`}>
        <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'}`}>Technische Details</CardTitle>
      </CardHeader>
      <CardContent className={`${isMobile ? 'pt-0 px-3 pb-3' : 'pt-0'} overflow-x-auto`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 min-w-[300px]">
          {asset.serialNumber && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Seriennummer</p>
              <p className={`font-medium tracking-wide break-all ${isMobile ? 'text-sm' : ''}`}>{asset.serialNumber}</p>
            </div>
          )}
          
          {asset.inventoryNumber && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Inventar-Nr.</p>
              <p className={`font-medium break-all ${isMobile ? 'text-sm' : ''}`}>{asset.inventoryNumber}</p>
            </div>
          )}
          
          {asset.imei && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">IMEI</p>
              <p className={`font-medium break-all ${isMobile ? 'text-sm' : ''}`}>{asset.imei}</p>
            </div>
          )}
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Garantie</p>
            <p className={`font-medium flex items-center flex-wrap ${isMobile ? 'text-sm' : ''}`}>
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
              <p className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{formatDate(asset.warrantyExpiryDate)}</p>
            </div>
          )}
          
          {asset.hasWarranty && asset.warrantyInfo && (
            <div className="space-y-1 col-span-1 sm:col-span-2">
              <p className="text-sm text-muted-foreground">Garantiedetails</p>
              <p className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{asset.warrantyInfo}</p>
            </div>
          )}
        </div>
        
        {asset.type === "smartphone" && (
          <div className="mt-5">
            <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium mb-2`}>Vertragsdaten</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 min-w-[300px]">
              {asset.phoneNumber && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Telefonnummer</p>
                  <p className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{asset.phoneNumber}</p>
                </div>
              )}
              
              {asset.provider && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Provider</p>
                  <p className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{asset.provider}</p>
                </div>
              )}
              
              {asset.contractName && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Vertrag</p>
                  <p className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{asset.contractName}</p>
                </div>
              )}
              
              {asset.contractEndDate && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Vertragsende</p>
                  <p className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{formatDate(asset.contractEndDate)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
