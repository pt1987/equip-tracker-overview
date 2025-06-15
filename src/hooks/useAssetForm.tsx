import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { getAssets } from "@/data/mockData";
import { createAsset } from "@/data/assets/create";
import { updateAsset } from "@/data/assets/update";
import { assetFormSchema, validateExternalAsset } from "@/components/assets/create-edit/AssetFormSchema";
import type { AssetFormValues } from "@/components/assets/create-edit/AssetFormSchema";
import type { Asset, AssetType, AssetStatus, AssetClassification } from "@/lib/types";

export function useAssetForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [activeTab, setActiveTab] = useState("basic");
  const { toast } = useToast();

  const { data: assets = [] } = useQuery({
    queryKey: ["assets"],
    queryFn: getAssets
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
      purchaseDate: asset.purchaseDate ? asset.purchaseDate.split('T')[0] : new Date().toISOString().split('T')[0],
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
      // External asset fields
      isExternal: asset.isExternal || false,
      ownerCompany: asset.ownerCompany || "PHAT Consulting GmbH",
      ...(asset.isExternal ? {
        projectId: asset.projectId || "",
        responsibleEmployeeId: asset.responsibleEmployeeId || "",
        handoverToEmployeeDate: asset.handoverToEmployeeDate || "",
        plannedReturnDate: asset.plannedReturnDate || "",
        actualReturnDate: asset.actualReturnDate || "",
      } : {})
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
      // External asset default fields
      isExternal: false,
      ownerCompany: "PHAT Consulting GmbH",
      projectId: "",
      responsibleEmployeeId: "",
      handoverToEmployeeDate: "",
      plannedReturnDate: "",
      actualReturnDate: "",
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: AssetFormValues) => {
      console.log("Submitting asset data:", data);
      
      // Validate external assets
      const externalErrors = validateExternalAsset(data);
      if (externalErrors) {
        for (const [field, message] of Object.entries(externalErrors)) {
          form.setError(field as any, { message });
        }
        throw new Error("Validation failed for external asset");
      }
      
      // Für externe Assets behandeln wir die Daten entsprechend anders
      let formattedPurchaseDate;
      if (data.isExternal) {
        // Für externe Assets verwenden wir ein Dummy-Datum, da die Datenbank ein Datum erfordert
        formattedPurchaseDate = data.handoverToEmployeeDate || new Date().toISOString().split('T')[0];
      } else {
        formattedPurchaseDate = data.purchaseDate || null;
      }
      
      const formattedWarrantyDate = data.hasWarranty && data.warrantyExpiryDate ? data.warrantyExpiryDate : null;
      
      const assetData: Asset = {
        id: isEditing && id ? id : crypto.randomUUID(),
        name: `${data.manufacturer} ${data.model}`,
        type: data.category as AssetType,
        manufacturer: data.manufacturer,
        model: data.model,
        purchaseDate: formattedPurchaseDate,
        vendor: data.isExternal ? "Externe Firma" : (data.vendor || ""),
        price: data.isExternal ? 0 : data.price,
        status: data.status as AssetStatus,
        employeeId: data.assignedTo && data.assignedTo !== "pool" && data.assignedTo !== "not_assigned" ? data.assignedTo : null,
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
        riskLevel: data.riskLevel as 'low' | 'medium' | 'high',
        isPersonalData: data.isPersonalData || false,
        disposalMethod: data.disposalMethod || null,
        lifecycleStage: data.lifecycleStage as 'procurement' | 'operation' | 'maintenance' | 'disposal',
        notes: data.notes || null,
        // External asset fields
        isExternal: data.isExternal || false,
        ownerCompany: data.ownerCompany || "PHAT Consulting GmbH",
        projectId: data.isExternal ? data.projectId || null : null,
        responsibleEmployeeId: data.isExternal ? data.responsibleEmployeeId || null : null,
        handoverToEmployeeDate: data.isExternal ? data.handoverToEmployeeDate || null : null,
        plannedReturnDate: data.isExternal ? data.plannedReturnDate || null : null,
        actualReturnDate: data.isExternal ? data.actualReturnDate || null : null,
      };

      if (isEditing && id) {
        return await updateAsset(assetData);
      } else {
        return await createAsset(assetData);
      }
    },
    onSuccess: () => {
      navigate("/assets");
    },
    onError: (error) => {
      console.error("Error saving asset:", error);
      
      // Set focus to the external tab if there are errors there
      const formErrors = form.formState.errors;
      const externalFields = ['ownerCompany', 'projectId', 'responsibleEmployeeId', 'handoverToEmployeeDate', 'plannedReturnDate'];
      
      if (form.getValues("isExternal")) {
        for (const field of externalFields) {
          if (formErrors[field as keyof AssetFormValues]) {
            setActiveTab('basic'); // Setzen wir auf 'basic' da external jetzt Teil der ersten Seite ist
            break;
          }
        }
      }
      
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

  const handleCancel = () => {
    navigate(-1);
  };

  return {
    isEditing,
    form,
    activeTab,
    setActiveTab,
    onSubmit,
    handleCancel,
    mutation,
    assets
  };
}
