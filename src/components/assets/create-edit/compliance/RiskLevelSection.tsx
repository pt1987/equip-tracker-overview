
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RISK_LEVELS } from "./ComplianceFormTypes";
import type { AssetFormValues } from "../AssetFormSchema";

export default function RiskLevelSection() {
  const form = useFormContext<AssetFormValues>();
  
  return (
    <FormField
      control={form.control}
      name="riskLevel"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Risikostufe</FormLabel>
          <Select 
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Risiko wählen" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {RISK_LEVELS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Bewerten Sie das Sicherheitsrisiko, das mit diesem Asset verbunden ist
          </FormDescription>
        </FormItem>
      )}
    />
  );
}
