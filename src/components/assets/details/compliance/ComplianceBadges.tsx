
import { AssetClassification } from "@/lib/types";

interface ComplianceBadgeProps {
  classification: AssetClassification | undefined;
  riskLevel: string | undefined;
}

export function getClassificationBadgeColor(classification: AssetClassification | undefined) {
  switch (classification) {
    case 'public': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'internal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'confidential': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
    case 'restricted': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
}

export function getRiskLevelBadgeColor(riskLevel: string | undefined) {
  switch (riskLevel) {
    case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
    case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
}

export function ClassificationBadge({ classification }: { classification: AssetClassification | undefined }) {
  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getClassificationBadgeColor(classification)}`}>
      {classification === 'public' && 'Öffentlich'}
      {classification === 'internal' && 'Intern'}
      {classification === 'confidential' && 'Vertraulich'}
      {classification === 'restricted' && 'Streng vertraulich'}
      {!classification && 'Nicht klassifiziert'}
    </div>
  );
}

export function RiskLevelBadge({ riskLevel }: { riskLevel: string | undefined }) {
  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelBadgeColor(riskLevel)}`}>
      {riskLevel === 'low' && 'Niedrig'}
      {riskLevel === 'medium' && 'Mittel'}
      {riskLevel === 'high' && 'Hoch'}
      {!riskLevel && 'Nicht bewertet'}
    </div>
  );
}

export function PersonalDataBadge({ isPersonalData }: { isPersonalData: boolean | undefined }) {
  return (
    <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isPersonalData ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`}>
      {isPersonalData ? 'Ja' : 'Nein'}
    </div>
  );
}
