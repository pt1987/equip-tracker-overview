
import { motion } from "framer-motion";
import { Asset } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { 
  calculateAssetBookValue, 
  isFixedAsset, 
  isGWG, 
  getRecommendedDepreciationDuration 
} from "@/lib/depreciation-utils";
import { Badge } from "@/components/ui/badge";
import { CalculatorIcon, Calendar, EuroIcon, InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DepreciationSectionProps {
  asset: Asset;
}

export default function DepreciationSection({ asset }: DepreciationSectionProps) {
  // Only show for assets that can be depreciated
  if (!asset.purchaseDate) return null;
  
  const bookValue = calculateAssetBookValue(asset);
  const fixedAsset = isFixedAsset(asset);
  const gwg = isGWG(asset);
  const depreciationDurationYears = bookValue.totalMonths / 12;
  
  // If it's not a fixed asset or GWG, don't show this section
  if (!fixedAsset && !gwg) return null;
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <CalculatorIcon className="h-5 w-5" />
            Abschreibung
          </CardTitle>
          <AssetClassificationBadge asset={asset} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Anschaffungswert (netto)</div>
            <div className="text-lg font-medium">{formatCurrency(bookValue.originalValue)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Aktueller Buchwert</div>
            <div className="text-lg font-medium">{formatCurrency(bookValue.currentBookValue)}</div>
          </div>
        </div>
        
        {/* Depreciation progress bar */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span>Abschreibungsfortschritt</span>
            <span>{Math.round(bookValue.depreciationPercentage)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${bookValue.depreciationPercentage}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
              <span>Nutzungsdauer</span>
            </div>
            <div className="font-medium">
              {depreciationDurationYears} Jahre
              {gwg && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="inline h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>GWG wird im Anschaffungsjahr sofort abgeschrieben.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <EuroIcon className="h-4 w-4" />
              <span>Jährliche AfA</span>
            </div>
            <div className="font-medium">{formatCurrency(bookValue.annualDepreciation)}</div>
          </div>
          
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <EuroIcon className="h-4 w-4" />
              <span>Monatliche AfA</span>
            </div>
            <div className="font-medium">{formatCurrency(bookValue.monthlyDepreciation)}</div>
          </div>
        </div>
        
        {bookValue.isFullyDepreciated ? (
          <div className="mt-6 p-4 bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 rounded-md">
            <p className="text-sm font-medium">
              Dieses Asset ist vollständig abgeschrieben.
            </p>
          </div>
        ) : (
          <div className="mt-6 p-4 bg-muted rounded-md">
            <p className="text-sm">
              Verbleibende Abschreibungsdauer: <span className="font-medium">{bookValue.remainingMonths} Monate</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Badge component to show the asset classification
function AssetClassificationBadge({ asset }: { asset: Asset }) {
  const fixedAsset = isFixedAsset(asset);
  const gwg = isGWG(asset);
  
  if (fixedAsset) {
    return <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">Anlagevermögen</Badge>;
  }
  
  if (gwg) {
    return <Badge variant="outline" className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">GWG</Badge>;
  }
  
  return null;
}
