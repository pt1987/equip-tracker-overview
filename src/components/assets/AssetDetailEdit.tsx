
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Asset } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, SaveIcon, X } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { uploadAssetImage } from "@/data/assets";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Name wird benötigt"),
  manufacturer: z.string().min(1, "Hersteller wird benötigt"),
  model: z.string().min(1, "Modell wird benötigt"),
  type: z.string().min(1, "Typ wird benötigt"),
  vendor: z.string().min(1, "Lieferant wird benötigt"),
  status: z.string().min(1, "Status wird benötigt"),
  purchaseDate: z.date(),
  price: z.coerce.number().min(0, "Preis kann nicht negativ sein"),
  serialNumber: z.string().optional(),
  inventoryNumber: z.string().optional(),
  additionalWarranty: z.boolean().optional(),
  imageUrl: z.string().optional(),
});

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
  const [imagePreview, setImagePreview] = useState(asset.imageUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
      additionalWarranty: asset.additionalWarranty || false,
      imageUrl: asset.imageUrl || "",
    },
  });
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        
        // Create local preview
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setImagePreview(result);
        };
        reader.readAsDataURL(file);
        
        // Upload to Supabase
        const imageUrl = await uploadAssetImage(file, asset.id);
        form.setValue("imageUrl", imageUrl);
        
        toast({
          title: "Bild hochgeladen",
          description: "Das Bild wurde erfolgreich hochgeladen.",
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          variant: "destructive",
          title: "Fehler beim Hochladen",
          description: "Das Bild konnte nicht hochgeladen werden.",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };
  
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
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
          <div className="w-full md:w-1/3 flex-shrink-0">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden relative group">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Asset"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer px-3 py-2 bg-background rounded-md text-sm font-medium">
                  {isUploading ? "Wird hochgeladen..." : "Bild ändern"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>
            <div className="mt-4 flex gap-2 justify-center">
              <Button type="submit" size="sm" disabled={isUploading}>
                <SaveIcon size={16} className="mr-2" />
                Speichern
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={isUploading}
              >
                <X size={16} className="mr-2" />
                Abbrechen
              </Button>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Typ</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Typ auswählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="laptop">Laptop</SelectItem>
                        <SelectItem value="smartphone">Smartphone</SelectItem>
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="mouse">Maus</SelectItem>
                        <SelectItem value="keyboard">Tastatur</SelectItem>
                        <SelectItem value="accessory">Zubehör</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hersteller</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modell</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Kaufdatum</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="w-full pl-3 text-left font-normal flex justify-between"
                          >
                            {field.value ? (
                              format(field.value, "dd.MM.yyyy")
                            ) : (
                              <span>Datum wählen</span>
                            )}
                            <CalendarIcon className="h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date()
                          }
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preis (€)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="vendor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lieferant</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Status auswählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ordered">Bestellt</SelectItem>
                        <SelectItem value="delivered">Geliefert</SelectItem>
                        <SelectItem value="in_use">In Gebrauch</SelectItem>
                        <SelectItem value="defective">Defekt</SelectItem>
                        <SelectItem value="repair">In Reparatur</SelectItem>
                        <SelectItem value="pool">Pool</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seriennummer</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="inventoryNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inventarnummer</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
