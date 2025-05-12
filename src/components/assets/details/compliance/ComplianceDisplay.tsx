
import { Asset, AssetClassification, Employee } from "@/lib/types";
import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ClassificationBadge, RiskLevelBadge, PersonalDataBadge } from "./ComplianceBadges";

interface ComplianceDisplayProps {
  asset: Asset;
  getOwnerName: (ownerId: string | undefined) => string;
}

export default function ComplianceDisplay({ asset, getOwnerName }: ComplianceDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Klassifizierung</p>
          <ClassificationBadge classification={asset.classification as AssetClassification} />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Asset Owner</p>
          <p className="text-sm font-medium">{getOwnerName(asset.assetOwnerId)}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Risikostufe</p>
          <RiskLevelBadge riskLevel={asset.riskLevel} />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Lebenszyklus-Phase</p>
          <p className="text-sm font-medium">
            {asset.lifecycleStage === 'procurement' && 'Beschaffung'}
            {asset.lifecycleStage === 'operation' && 'Betrieb'}
            {asset.lifecycleStage === 'maintenance' && 'Wartung'}
            {asset.lifecycleStage === 'disposal' && 'Entsorgung'}
            {!asset.lifecycleStage && 'Nicht angegeben'}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Letzte Überprüfung</p>
          <p className="text-sm font-medium flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            {asset.lastReviewDate ? formatDate(asset.lastReviewDate) : 'Nie überprüft'}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Nächste Überprüfung</p>
          <p className="text-sm font-medium flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            {asset.nextReviewDate ? formatDate(asset.nextReviewDate) : 'Nicht geplant'}
          </p>
        </div>

        {asset.disposalMethod && (
          <div className="col-span-1 md:col-span-2 space-y-2">
            <p className="text-sm text-muted-foreground">Entsorgungsmethode</p>
            <p className="text-sm">{asset.disposalMethod}</p>
          </div>
        )}

        <div className="col-span-1 md:col-span-2 space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Personenbezogene Daten (DSGVO-relevant)</p>
            <PersonalDataBadge isPersonalData={asset.isPersonalData} />
          </div>
        </div>

        {asset.notes && (
          <div className="col-span-1 md:col-span-2 space-y-2">
            <p className="text-sm text-muted-foreground">Compliance-Notizen</p>
            <p className="text-sm">{asset.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
