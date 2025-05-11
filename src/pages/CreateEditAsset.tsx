
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { getAssets } from "@/data/mockData";
import { getEmployees } from "@/data/employees";
import { createAsset, updateAsset } from "@/data/assets";
import { assetFormSchema } from "@/components/assets/create-edit/AssetFormSchema";
import type { AssetFormValues } from "@/components/assets/create-edit/AssetFormSchema";
import AssetFormBasicInfo from "@/components/assets/create-edit/AssetFormBasicInfo";
import AssetFormDetails from "@/components/assets/create-edit/AssetFormDetails";
import AssetFormWarranty from "@/components/assets/create-edit/AssetFormWarranty";
import AssetFormRelation from "@/components/assets/create-edit/AssetFormRelation";
import AssetFormCompliance from "@/components/assets/create-edit/AssetFormCompliance";
import { AssetType, AssetStatus, Employee, AssetClassification } from "@/lib/types";

export default function CreateEditAsset() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [activeTab, setActiveTab] = useState("basic");
  const { toast } = useToast();

  const { data: assets = [] } = useQuery({
    queryKey: ["assets"],
    queryFn: getAssets
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees
  });

  const asset = isEditing ? assets.find(a => a.id === id) : null;

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: isEditing && asset ? {
      category: asset.category || "",
      manufacturer: asset.manufacturer || "",
      model: asset.model || "",
      status: asset.status || "ordered",
      assignedTo: asset.employeeId || "",
      purchaseDate: new Date(asset.purchaseDate).toISOString().split('T')[0],
      price: asset.price || 0,
      vendor: asset.vendor || "",
      serialNumber: asset.serialNumber || "",
      inventoryNumber: asset.inventoryNumber || "",
      hasWarranty: asset.hasWarranty || false,
      additionalWarranty: asset.additionalWarranty || false,
      warrantyExpiryDate: asset.warrantyExpiryDate || "",
      warrantyInfo: asset.warrantyInfo || "",
      imei: asset.imei || "",
      phoneNumber: asset.phoneNumber || "",
      provider: asset.provider || "",
      contractDuration: asset.contractEndDate || "",
      contractName: asset.contractName || "",
      relatedAssetId: asset.connectedAssetId || "",
      // ISO 27001 fields
      classification: asset.classification || "internal",
      assetOwnerId: asset.assetOwnerId || "",
      lastReviewDate: asset.lastReviewDate || "",
      nextReviewDate: asset.nextReviewDate || "",
      riskLevel: asset.riskLevel || "low",
      isPersonalData: asset.isPersonalData || false,
      disposalMethod: asset.disposalMethod || "",
      lifecycleStage: asset.lifecycleStage || "operation",
      notes: asset.notes || "",
    } : {
      category: "",
      manufacturer: "",
      model: "",
      status: "ordered",
      assignedTo: "",
      purchaseDate: new Date().toISOString().split('T')[0],
      price: 0,
      vendor: "",
      serialNumber: "",
      inventoryNumber: "",
      hasWarranty: false,
      additionalWarranty: false,
      warrantyExpiryDate: "",
      warrantyInfo: "",
      imei: "",
      phoneNumber: "",
      provider: "",
      contractDuration: "",
      contractName: "",
      relatedAssetId: "",
      // ISO 27001 default fields
      classification: "internal",
      assetOwnerId: "",
      lastReviewDate: "",
      nextReviewDate: "",
      riskLevel: "low",
      isPersonalData: false,
      disposalMethod: "",
      lifecycleStage: "operation",
      notes: "",
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: AssetFormValues) => {
      console.log("Submitting asset data:", data);
      
      const formattedPurchaseDate = data.purchaseDate ? data.purchaseDate : null;
      const formattedWarrantyDate = data.hasWarranty && data.warrantyExpiryDate ? data.warrantyExpiryDate : null;
      
      const assetData = {
        id: isEditing && id ? id : crypto.randomUUID(),
        name: `${data.manufacturer} ${data.model}`,
        type: data.category as AssetType,
        manufacturer: data.manufacturer,
        model: data.model,
        purchaseDate: formattedPurchaseDate,
        vendor: data.vendor || "",
        price: data.price,
        status: data.status as AssetStatus,
        employeeId: data.assignedTo && data.assignedTo !== "pool" ? data.assignedTo : null,
        category: data.category,
        serialNumber: data.serialNumber || "",
        inventoryNumber: data.inventoryNumber || "",
        hasWarranty: data.hasWarranty || false,
        additionalWarranty: data.additionalWarranty || false,
        warrantyExpiryDate: formattedWarrantyDate,
        warrantyInfo: data.warrantyInfo || "",
        imei: data.imei || "",
        phoneNumber: data.phoneNumber || "",
        provider: data.provider || "",
        contractEndDate: data.contractDuration || null,
        contractName: data.contractName || "",
        connectedAssetId: data.relatedAssetId && data.relatedAssetId !== "none" ? data.relatedAssetId : null,
        relatedAssetId: data.relatedAssetId && data.relatedAssetId !== "none" ? data.relatedAssetId : null,
        // ISO 27001 fields
        classification: data.classification as AssetClassification,
        assetOwnerId: data.assetOwnerId || null,
        lastReviewDate: data.lastReviewDate || null,
        nextReviewDate: data.nextReviewDate || null,
        riskLevel: data.riskLevel as 'low' | 'medium' | 'high' || null,
        isPersonalData: data.isPersonalData || false,
        disposalMethod: data.disposalMethod || null,
        lifecycleStage: data.lifecycleStage as 'procurement' | 'operation' | 'maintenance' | 'disposal' || null,
        notes: data.notes || null,
      };

      if (isEditing && id) {
        return await updateAsset(assetData);
      } else {
        return await createAsset(assetData);
      }
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Asset aktualisiert" : "Asset erstellt",
        description: `${form.getValues("manufacturer")} ${form.getValues("model")} wurde erfolgreich ${isEditing ? 'aktualisiert' : 'erstellt'}.`,
      });
      navigate("/assets");
    },
    onError: (error) => {
      console.error("Error saving asset:", error);
      toast({
        variant: "destructive",
        title: isEditing ? "Fehler beim Aktualisieren" : "Fehler beim Erstellen",
        description: `Das Asset konnte nicht gespeichert werden: ${error.message}`,
      });
    }
  });

  const onSubmit = (data: AssetFormValues) => {
    console.log("Form submitted with data:", data);
    mutation.mutate(data);
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {isEditing ? "Asset bearbeiten" : "Neues Asset anlegen"}
              </h1>
              <p className="text-muted-foreground">
                {isEditing 
                  ? "Aktualisieren Sie die Informationen des ausgewählten Assets" 
                  : "Fügen Sie ein neues Asset zur Inventarliste hinzu"}
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Details</CardTitle>
                  <CardDescription>
                    Geben Sie die grundlegenden Informationen für dieses Asset ein
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4 w-full flex flex-wrap justify-start md:justify-start">
                      <TabsTrigger value="basic">Grundinformationen</TabsTrigger>
                      <TabsTrigger value="details">Erweiterte Details</TabsTrigger>
                      <TabsTrigger value="relation">Zuordnung</TabsTrigger>
                      <TabsTrigger value="warranty">Garantie</TabsTrigger>
                      <TabsTrigger value="compliance">ISO 27001</TabsTrigger>
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
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(-1)}
                  >
                    Abbrechen
                  </Button>
                  <Button 
                    type="submit"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? 'Wird gespeichert...' : (isEditing ? "Speichern" : "Erstellen")}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </PageTransition>
  );
}
