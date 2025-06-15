
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AssetFormValues } from "../AssetFormFields";

export default function TechnicalInfoSection() {
  const form = useFormContext<AssetFormValues>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
}
