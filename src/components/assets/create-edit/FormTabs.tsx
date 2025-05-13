import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssetFormBasicInfo from "./AssetFormBasicInfo";
import AssetFormDetails from "./AssetFormDetails";
import AssetFormWarranty from "./AssetFormWarranty";
import AssetFormCompliance from "./compliance/AssetFormCompliance";
import { Employee } from "@/lib/types";
import ExternalAssetSection from "./ExternalAssetSection";

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
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="basic">Basisinfo</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="external">Eigentum</TabsTrigger>
        <TabsTrigger value="compliance">ISO 27001</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic" className="space-y-6">
        <AssetFormBasicInfo employees={employees} />
      </TabsContent>
      
      <TabsContent value="details" className="space-y-6">
        <AssetFormDetails />
        <AssetFormWarranty />
      </TabsContent>
      
      <TabsContent value="external" className="space-y-6">
        <ExternalAssetSection />
      </TabsContent>
      
      <TabsContent value="compliance" className="space-y-6">
        <AssetFormCompliance />
      </TabsContent>
    </Tabs>
  );
}
