
import { useFormContext } from "react-hook-form";
import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { getEmployees } from "@/data/employees";
import { Employee } from "@/lib/types";

export const assetFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  model: z.string().min(1, "Model is required"),
  type: z.string().min(1, "Asset type is required"),
  vendor: z.string().min(1, "Vendor is required"),
  status: z.string().min(1, "Status is required"),
  purchaseDate: z.date(),
  price: z.number().nonnegative("Price cannot be negative"),
  serialNumber: z.string().optional(),
  inventoryNumber: z.string().optional(),
  hasWarranty: z.boolean().default(false),
  additionalWarranty: z.boolean().default(false),
  warrantyExpiryDate: z.date().nullable(),
  warrantyInfo: z.string().optional(),
  imageUrl: z.string().optional(),
  employeeId: z.string().nullable().optional(),
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;

export default function AssetFormFields() {
  const form = useFormContext<AssetFormValues>();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const hasWarranty = form.watch("hasWarranty");

  // Laden der Mitarbeiterliste beim Komponenten-Mount
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const employeeData = await getEmployees();
        setEmployees(employeeData);
      } catch (error) {
        console.error("Error loading employees:", error);
      }
    };
    
    loadEmployees();
  }, []);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Asset-Informationen</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Asset Name" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Input placeholder="z.B. Apple, Dell" {...field} />
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
                <Input placeholder="z.B. MacBook Pro" {...field} />
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
                <Input placeholder="z.B. Amazon" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Status auswählen" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ordered">Bestellt</SelectItem>
                  <SelectItem value="delivered">Geliefert</SelectItem>
                  <SelectItem value="in_use">In Benutzung</SelectItem>
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
          name="purchaseDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kaufdatum</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''} 
                  onChange={(e) => field.onChange(new Date(e.target.value))} 
                />
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
              <FormLabel>Preis (€)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mitarbeiterzuweisung */}
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zugewiesen an</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Mitarbeiter auswählen" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Nicht zugewiesen</SelectItem>
                  {employees.map((employee) => (
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

        <FormField
          control={form.control}
          name="serialNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seriennummer</FormLabel>
              <FormControl>
                <Input placeholder="Seriennummer" {...field} />
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
                <Input placeholder="Inventarnummer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Garantie-Bereich */}
        <div className="col-span-1 md:col-span-2 mt-4">
          <h3 className="text-lg font-medium mb-4">Garantie-Informationen</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="hasWarranty"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Garantie vorhanden</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {hasWarranty && (
              <>
                <FormField
                  control={form.control}
                  name="additionalWarranty"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Zusätzliche Garantie</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="warrantyExpiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Garantie gültig bis</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''} 
                          onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="warrantyInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Garantie-Informationen</FormLabel>
                      <FormControl>
                        <Input placeholder="Garantie-Informationen" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
