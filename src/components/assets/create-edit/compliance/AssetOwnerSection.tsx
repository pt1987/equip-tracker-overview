
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/data/employees";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AssetFormValues } from "../AssetFormSchema";

export default function AssetOwnerSection() {
  const form = useFormContext<AssetFormValues>();
  
  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees
  });
  
  return (
    <FormField
      control={form.control}
      name="assetOwnerId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Asset Owner</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value || "not_assigned"}
            value={field.value || "not_assigned"}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Asset Owner wählen" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="not_assigned">Nicht zugewiesen</SelectItem>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Person, die für dieses Asset und dessen Sicherheit verantwortlich ist
          </FormDescription>
        </FormItem>
      )}
    />
  );
}
