
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Asset } from "@/lib/types";
import {
  Form,
} from "@/components/ui/form";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AssetImageUpload from "./details/AssetImageUpload";
import AssetFormFields, { assetFormSchema, AssetFormValues } from "./details/AssetFormFields";

interface AssetDetailEditProps {
  asset: Asset;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function AssetDetailEdit({
  asset,
  onSave,
  onCancel,
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
    },
  });
  
  const handleImageChange = (imageUrl: string) => {
    form.setValue("imageUrl", imageUrl);
  };
  
  const handleSubmit = async (data: AssetFormValues) => {
    try {
      // Pass the form data to the parent component's onSave function
      onSave(data);
    } catch (error) {
      console.error("Error saving asset:", error);
      toast({
        variant: "destructive",
        title: "Fehler beim Speichern",
        description: "Das Asset konnte nicht gespeichert werden.",
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
          <AssetFormFields />
        </div>
      </form>
    </Form>
  );
}
