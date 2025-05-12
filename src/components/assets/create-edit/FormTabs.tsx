
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssetFormBasicInfo from "@/components/assets/create-edit/AssetFormBasicInfo";
import AssetFormDetails from "@/components/assets/create-edit/AssetFormDetails";
import AssetFormWarranty from "@/components/assets/create-edit/AssetFormWarranty";
import AssetFormRelation from "@/components/assets/create-edit/AssetFormRelation";
import AssetFormCompliance from "@/components/assets/create-edit/AssetFormCompliance";
import { Asset, Employee } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface FormTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  assets: Asset[];
  employees: Employee[];
}

export default function FormTabs({ activeTab, setActiveTab, assets, employees }: FormTabsProps) {
  const isMobile = useIsMobile();
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className={`mb-4 w-full ${isMobile ? 'grid grid-cols-3 gap-1' : 'flex flex-wrap justify-start md:justify-start'}`}>
        <TabsTrigger value="basic" className={isMobile ? 'text-xs py-1.5 px-2' : ''}>
          {isMobile ? 'Grundinfo' : 'Grundinformationen'}
        </TabsTrigger>
        <TabsTrigger value="details" className={isMobile ? 'text-xs py-1.5 px-2' : ''}>
          Details
        </TabsTrigger>
        <TabsTrigger value="relation" className={isMobile ? 'text-xs py-1.5 px-2' : ''}>
          Zuordnung
        </TabsTrigger>
        <TabsTrigger value="warranty" className={isMobile ? 'text-xs py-1.5 px-1.5' : ''}>
          Garantie
        </TabsTrigger>
        <TabsTrigger value="compliance" className={isMobile ? 'text-xs py-1.5 px-1.5' : ''}>
          ISO 27001
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic">
        <AssetFormBasicInfo employees={employees} />
      </TabsContent>
      
      <TabsContent value="details">
        <AssetFormDetails />
      </TabsContent>
      
      <TabsContent value="relation">
        <AssetFormRelation assets={assets} />
      </TabsContent>
      
      <TabsContent value="warranty">
        <AssetFormWarranty />
      </TabsContent>
      
      <TabsContent value="compliance">
        <AssetFormCompliance />
      </TabsContent>
    </Tabs>
  );
}
