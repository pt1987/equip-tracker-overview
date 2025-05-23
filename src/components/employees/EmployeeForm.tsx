
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
import { EmployeeFormValues, availableClusters, competenceLevels } from "./EmployeeFormTypes";

export default function EmployeeFormFields() {
  const form = useFormContext<EmployeeFormValues>();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
          <FormItem className="w-full">
            <FormLabel>Cluster</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Cluster auswählen" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="w-full bg-popover z-50 shadow-md">
                {availableClusters.map((cluster) => (
                  <SelectItem key={cluster} value={cluster}>
                    {cluster}
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
        name="competenceLevel"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Kompetenzlevel</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Kompetenzlevel auswählen" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="w-full bg-popover z-50 shadow-md">
                {competenceLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Internes Kompetenzlevel des Mitarbeiters
            </FormDescription>
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
    </div>
  );
}

