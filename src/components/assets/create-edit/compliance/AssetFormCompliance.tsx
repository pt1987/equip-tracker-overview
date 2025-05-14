
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import AssetOwnerSection from "./AssetOwnerSection";
import ClassificationSection from "./ClassificationSection";
import DisposalSection from "./DisposalSection";
import LifecycleSection from "./LifecycleSection";
import NotesSection from "./NotesSection";
import PersonalDataSection from "./PersonalDataSection";
import ReviewDatesSection from "./ReviewDatesSection";
import RiskLevelSection from "./RiskLevelSection";

export default function AssetFormCompliance() {
  const form = useFormContext();
  
  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">ISO 27001 Compliance</h3>
        <p className="text-sm text-muted-foreground">
          Informationen zur Compliance gemäß ISO 27001
        </p>
      </div>
      
      <ClassificationSection />
      <AssetOwnerSection />
      <ReviewDatesSection />
      <RiskLevelSection />
      <PersonalDataSection />
      <LifecycleSection />
      <DisposalSection />
      <NotesSection />
    </div>
  );
}
