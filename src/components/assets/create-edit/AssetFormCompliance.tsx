
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function AssetFormCompliance() {
  const form = useFormContext();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">ISO 27001 Compliance</h3>
      
      <FormField
        control={form.control}
        name="classification"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Information Classification Level</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value || "internal"}
              value={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select classification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="confidential">Confidential</SelectItem>
                <SelectItem value="restricted">Restricted</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              The classification level determines handling requirements
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="assetOwnerId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ISO 27001 Asset Owner</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Asset owner ID" />
            </FormControl>
            <FormDescription>
              Person responsible for the asset according to ISO 27001
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="riskLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Risk Level</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value || "low"}
              value={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="lastReviewDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Security Review Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="nextReviewDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Next Required Review Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="isPersonalData"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Contains Personal Data</FormLabel>
              <FormDescription>
                Check this if the asset contains personal data relevant for GDPR
              </FormDescription>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="lifecycleStage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lifecycle Stage</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value || "operation"}
              value={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select lifecycle stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="procurement">Procurement</SelectItem>
                <SelectItem value="operation">Operation</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="disposal">Disposal</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="disposalMethod"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Disposal Method</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g., Data wiping procedure XYZ" />
            </FormControl>
            <FormDescription>
              Method used for secure disposal when needed
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
