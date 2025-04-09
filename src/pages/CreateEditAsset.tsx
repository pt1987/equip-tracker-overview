import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { getAssets, getEmployees, updateAsset } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import { AssetStatus, AssetType } from "@/lib/types";

const assetFormSchema = z.object({
  category: z.string().min(1, "Bitte wählen Sie eine Kategorie"),
  manufacturer: z.string().min(1, "Bitte geben Sie einen Hersteller an"),
  model: z.string().min(1, "Bitte geben Sie ein Modell an"),
  status: z.string().min(1, "Bitte wählen Sie einen Status"),
  assignedTo: z.string().optional(),
  purchaseDate: z.string().min(1, "Bitte geben Sie ein Kaufdatum an"),
  price: z.coerce.number().min(0, "Der Preis darf nicht negativ sein"),
  vendor: z.string().optional(),
  serialNumber: z.string().optional(),
  inventoryNumber: z.string().optional(),
  hasWarranty: z.boolean().optional(),
  imei: z.string().optional(),
  phoneNumber: z.string().optional(),
  provider: z.string().optional(),
  contractDuration: z.string().optional(),
  contractName: z.string().optional(),
  relatedAssetId: z.string().optional(),
});

type AssetFormValues = z.infer<typeof assetFormSchema>;

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
      hasWarranty: asset.additionalWarranty || false,
      imei: asset.imei || "",
      phoneNumber: asset.phoneNumber || "",
      provider: asset.provider || "",
      contractDuration: asset.contractEndDate || "",
      contractName: asset.contractName || "",
      relatedAssetId: asset.connectedAssetId || "",
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
      imei: "",
      phoneNumber: "",
      provider: "",
      contractDuration: "",
      contractName: "",
      relatedAssetId: "",
    }
  });

  const watchCategory = form.watch("category");
  useEffect(() => {
    if (["notebook", "smartphone", "tablet"].includes(watchCategory)) {
      setActiveTab("details");
    } else if (watchCategory === "accessory") {
      setActiveTab("relation");
    } else {
      setActiveTab("basic");
    }
  }, [watchCategory]);

  const mutation = useMutation({
    mutationFn: async (data: AssetFormValues) => {
      console.log("Submitting asset data:", data);
      
      const dbAsset = {
        name: `${data.manufacturer} ${data.model}`,
        type: data.category as AssetType,
        manufacturer: data.manufacturer,
        model: data.model,
        purchase_date: data.purchaseDate,
        vendor: data.vendor || "",
        price: data.price,
        status: data.status as AssetStatus,
        employee_id: data.assignedTo !== "pool" ? data.assignedTo : null,
        category: data.category,
        serial_number: data.serialNumber,
        inventory_number: data.inventoryNumber,
        additional_warranty: data.hasWarranty,
        has_warranty: data.hasWarranty,
        imei: data.imei,
        phone_number: data.phoneNumber,
        provider: data.provider,
        contract_end_date: data.contractDuration,
        contract_name: data.contractName,
        connected_asset_id: data.relatedAssetId !== "none" ? data.relatedAssetId : null,
        related_asset_id: data.relatedAssetId !== "none" ? data.relatedAssetId : null
      };

      if (isEditing && id) {
        const { data: updatedAsset, error } = await supabase
          .from('assets')
          .update(dbAsset)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return updatedAsset;
      } else {
        const { data: newAsset, error } = await supabase
          .from('assets')
          .insert(dbAsset)
          .select()
          .single();
        
        if (error) throw error;
        return newAsset;
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
                <CardContent className="card-content">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4 w-full flex flex-wrap justify-start md:justify-start">
                      <TabsTrigger value="basic">Grundinformationen</TabsTrigger>
                      <TabsTrigger value="details">Erweiterte Details</TabsTrigger>
                      <TabsTrigger value="relation">Zuordnung</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-4 tabs-content">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Kategorie</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Kategorie auswählen" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="notebook">Notebook</SelectItem>
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
                                  <SelectItem value="in_use">Aktiv</SelectItem>
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
                          name="manufacturer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hersteller</FormLabel>
                              <FormControl>
                                <Input placeholder="z.B. Apple, Dell, Logitech" {...field} />
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
                                <Input placeholder="z.B. MacBook Pro, XPS 13" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="purchaseDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Kaufdatum</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Kaufpreis (€)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="0.00" 
                                  {...field} 
                                />
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
                              <FormLabel>Verkäufer</FormLabel>
                              <FormControl>
                                <Input placeholder="z.B. Amazon, MediaMarkt" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="assignedTo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zugewiesen an</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Mitarbeiter auswählen" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="pool">Nicht zugewiesen (Pool)</SelectItem>
                                  {employees.map(employee => (
                                    <SelectItem key={employee.id} value={employee.id}>
                                      {employee.firstName} {employee.lastName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="details" className="space-y-4 tabs-content">
                      {(watchCategory === "notebook" || watchCategory === "smartphone" || watchCategory === "tablet") && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          
                          {watchCategory === "notebook" && (
                            <FormField
                              control={form.control}
                              name="hasWarranty"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      Zusatzgarantie
                                    </FormLabel>
                                    <FormDescription>
                                      Hat dieses Gerät eine erweiterte Garantie?
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          )}
                          
                          {watchCategory === "smartphone" && (
                            <>
                              <FormField
                                control={form.control}
                                name="imei"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>IMEI</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Telefonnummer</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="provider"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Provider</FormLabel>
                                    <FormControl>
                                      <Input placeholder="z.B. Telekom, Vodafone" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="contractDuration"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Vertragslaufzeit</FormLabel>
                                    <FormControl>
                                      <Input placeholder="z.B. 24 Monate" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="contractName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Vertragsbezeichnung</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </>
                          )}
                        </div>
                      )}
                      
                      {!["notebook", "smartphone", "tablet"].includes(watchCategory) && (
                        <div className="flex items-center justify-center h-40">
                          <p className="text-muted-foreground">
                            Bitte wählen Sie zuerst eine Kategorie (Notebook, Smartphone oder Tablet), 
                            um erweiterte Details einzugeben.
                          </p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="relation" className="space-y-4 tabs-content">
                      {watchCategory === "accessory" ? (
                        <FormField
                          control={form.control}
                          name="relatedAssetId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zugehöriges Gerät</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Gerät auswählen" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="none">Kein zugehöriges Gerät</SelectItem>
                                  {assets
                                    .filter(a => ["notebook", "smartphone", "tablet"].includes(a.category))
                                    .map(asset => (
                                      <SelectItem key={asset.id} value={asset.id}>
                                        {asset.manufacturer} {asset.model}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Wenn dieses Zubehör zu einem anderen Gerät gehört, wählen Sie es hier aus.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-40">
                          <p className="text-muted-foreground">
                            Die Zuordnung ist nur für Zubehör verfügbar. Bitte wählen Sie "Zubehör" als Kategorie.
                          </p>
                        </div>
                      )}
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
