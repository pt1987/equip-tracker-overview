
import { Asset } from "@/lib/types";
import {
  LaptopIcon,
  SmartphoneIcon,
  TabletIcon,
  MouseIcon,
  KeyboardIcon,
  PackageIcon,
  QrCode
} from "lucide-react";
import { ReportInfoTooltip } from "@/components/reports/ReportInfoTooltip";
import QRCodeDialog from "../QRCodeDialog";

interface QuickStatsSectionProps {
  assetsByType: Record<string, Asset[]>;
  currentUrl: string;
}

export default function QuickStatsSection({ 
  assetsByType,
  currentUrl
}: QuickStatsSectionProps) {
  return (
    <div>
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Mitarbeiter QR-Code</h2>
          <QRCodeDialog currentUrl={currentUrl} />
        </div>
        <p className="text-sm text-muted-foreground">
          Scannen Sie diesen QR-Code, um schnell auf die Mitarbeiterdetails zuzugreifen
        </p>
      </div>
      
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Schnellübersicht</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100">
                <LaptopIcon size={16} className="text-blue-700" />
              </div>
              <span className="text-sm">Laptops</span>
            </div>
            <span className="font-medium text-sm">
              {assetsByType["laptop"]?.length || 0}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-100">
                <SmartphoneIcon size={16} className="text-purple-700" />
              </div>
              <span className="text-sm">Smartphones</span>
            </div>
            <span className="font-medium text-sm">
              {assetsByType["smartphone"]?.length || 0}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100">
                <TabletIcon size={16} className="text-green-700" />
              </div>
              <span className="text-sm">Tablets</span>
            </div>
            <span className="font-medium text-sm">
              {assetsByType["tablet"]?.length || 0}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-100">
                <MouseIcon size={16} className="text-amber-700" />
              </div>
              <span className="text-sm">Maus</span>
            </div>
            <span className="font-medium text-sm">
              {assetsByType["mouse"]?.length || 0}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gray-100">
                <KeyboardIcon size={16} className="text-gray-700" />
              </div>
              <span className="text-sm">Tastaturen</span>
            </div>
            <span className="font-medium text-sm">
              {assetsByType["keyboard"]?.length || 0}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-pink-100">
                <PackageIcon size={16} className="text-pink-700" />
              </div>
              <span className="text-sm">Zubehör</span>
            </div>
            <span className="font-medium text-sm">
              {assetsByType["accessory"]?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
