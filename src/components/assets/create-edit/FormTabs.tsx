
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssetFormBasicInfo from "./AssetFormBasicInfo";
import AssetFormDetails from "./AssetFormDetails";
import AssetFormWarranty from "./AssetFormWarranty";
import AssetFormCompliance from "./AssetFormCompliance";
import { Employee } from "@/lib/types";
import ExternalAssetSection from "./ExternalAssetSection";
import { useFormContext } from "react-hook-form";
import type { AssetFormValues } from "./AssetFormSchema";

interface FormTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  assets: any[];
  employees: Employee[];
}

export default function FormTabs({ 
  activeTab, 
  setActiveTab, 
  assets, 
  employees 
}: FormTabsProps) {
  const form = useFormContext<AssetFormValues>();
  const isExternal = form.watch("isExternal");

  return (
    <div className="space-y-6">
      {/* Eigentumsverhältnis zuerst anzeigen, vor den Tabs */}
      <div className="mb-6">
        <ExternalAssetSection />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="basic">Basisinfo</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="compliance">ISO 27001</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-6">
          <AssetFormBasicInfo employees={employees} isExternal={isExternal} />
        </TabsContent>
        
        <TabsContent value="details" className="space-y-6">
          <AssetFormDetails />
          <AssetFormWarranty />
        </TabsContent>
        
        <TabsContent value="compliance" className="space-y-6">
          <AssetFormCompliance />
        </TabsContent>
      </Tabs>
    </div>
  );
}
