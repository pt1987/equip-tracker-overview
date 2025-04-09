
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { EmployeeFormValues } from "./EmployeeFormTypes";

export default function EmployeeFormFields() {
  const form = useFormContext<EmployeeFormValues>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vorname</FormLabel>
            <FormControl>
              <Input placeholder="Max" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nachname</FormLabel>
            <FormControl>
              <Input placeholder="Mustermann" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>E-Mail</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="max.mustermann@unternehmen.de" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="position"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Position</FormLabel>
            <FormControl>
              <Input placeholder="Software Entwickler" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="cluster"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cluster</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Cluster auswählen" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="development">Entwicklung</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="operations">Betrieb</SelectItem>
                <SelectItem value="management">Management</SelectItem>
                <SelectItem value="sales">Vertrieb</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="entryDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Eintrittsdatum</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="budget"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Geräte-Budget (€)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="5000" 
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
              />
            </FormControl>
            <FormDescription>
              Verfügbares Budget für Hardware-Anschaffungen
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="profileImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Profilbild (optional)</FormLabel>
            <FormControl>
              <Input 
                placeholder="Bild hochladen (optional)" 
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>
              Kann später hinzugefügt werden
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
