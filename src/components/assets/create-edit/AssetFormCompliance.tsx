
import { Separator } from "@/components/ui/separator";
import ClassificationSection from "./compliance/ClassificationSection";
import RiskLevelSection from "./compliance/RiskLevelSection";
import AssetOwnerSection from "./compliance/AssetOwnerSection";
import LifecycleSection from "./compliance/LifecycleSection";
import ReviewDatesSection from "./compliance/ReviewDatesSection";
import PersonalDataSection from "./compliance/PersonalDataSection";
import DisposalSection from "./compliance/DisposalSection";
import NotesSection from "./compliance/NotesSection";

export default function AssetFormCompliance() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">ISO 27001 Compliance</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Asset-Klassifikation und Compliance-Informationen gemäß ISO 27001
        </p>
      </div>

      <Separator className="my-4" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ClassificationSection />
        <RiskLevelSection />
        <AssetOwnerSection />
        <LifecycleSection />
        <ReviewDatesSection />
        <PersonalDataSection />
        <DisposalSection />
        <NotesSection />
      </div>
    </div>
  );
}
