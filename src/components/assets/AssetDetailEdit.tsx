
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Asset } from "@/lib/types";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AssetImageUpload from "./details/AssetImageUpload";
import AssetFormFields, { assetFormSchema, AssetFormValues } from "./details/AssetFormFields";
import { Button } from "@/components/ui/button";

interface AssetDetailEditProps {
  asset: Asset;
  onSave: (data: AssetFormValues) => Promise<void>;
  onCancel: () => void;
  disabled?: boolean;
}

export default function AssetDetailEdit({
  asset,
  onSave,
  onCancel,
  disabled = false
}: AssetDetailEditProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      name: asset.name,
      manufacturer: asset.manufacturer,
      model: asset.model,
      type: asset.type,
      vendor: asset.vendor,
      status: asset.status,
      purchaseDate: new Date(asset.purchaseDate),
      price: asset.price,
      serialNumber: asset.serialNumber || "",
      inventoryNumber: asset.inventoryNumber || "",
      hasWarranty: asset.hasWarranty || false,
      additionalWarranty: asset.additionalWarranty || false,
      warrantyExpiryDate: asset.warrantyExpiryDate ? new Date(asset.warrantyExpiryDate) : null,
      warrantyInfo: asset.warrantyInfo || "",
      imageUrl: asset.imageUrl || "",
      employeeId: asset.employeeId || "not_assigned",
      isPoolDevice: asset.isPoolDevice || false,
    },
  });
  
  const handleImageChange = (imageUrl: string) => {
    form.setValue("imageUrl", imageUrl);
  };
  
  const handleSubmit = async (data: AssetFormValues) => {
    try {
      console.log("Form submission data:", data);
      
      // Validate required fields
      if (!data.name || !data.manufacturer || !data.model) {
        throw new Error("Name, Hersteller und Modell sind erforderlich");
      }
      
      // Handle employeeId conversion
      const processedData = {
        ...data,
        employeeId: data.employeeId === "not_assigned" ? null : data.employeeId,
      };
      
      await onSave(processedData);
    } catch (error) {
      console.error("Error saving asset:", error);
      toast({
        variant: "destructive",
        title: "Fehler beim Speichern",
        description: error instanceof Error ? error.message : "Das Asset konnte nicht gespeichert werden.",
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <AssetImageUpload
            assetId={asset.id}
            initialImageUrl={asset.imageUrl}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
            onImageChange={handleImageChange}
            onSave={form.handleSubmit(handleSubmit)}
            onCancel={onCancel}
          />
          <div className="flex-1">
            <AssetFormFields />
            <div className="flex justify-end gap-3 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={disabled || isUploading}
              >
                Abbrechen
              </Button>
              <Button 
                type="submit" 
                disabled={disabled || isUploading}
              >
                {disabled ? "Speichere..." : "Speichern"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
