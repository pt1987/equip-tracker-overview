
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { getAssets } from "@/data/assets";
import { getEmployees } from "@/data/employees";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Info } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(5, "Titel muss mindestens 5 Zeichen lang sein."),
  assetId: z.string().min(1, "Bitte wählen Sie ein Asset aus."),
  description: z.string().min(10, "Beschreibung muss mindestens 10 Zeichen lang sein."),
  priority: z.enum(["low", "medium", "high"]),
  damageType: z.string().min(1, "Bitte wählen Sie eine Schadensart aus."),
  damageDate: z.string().min(1, "Bitte geben Sie das Schadensdatum an."),
  location: z.string().optional(),
  reportedBy: z.string().min(1, "Bitte wählen Sie aus, wer den Schaden gemeldet hat."),
  isConfidential: z.boolean().default(false),
  damageDescription: z.string().min(10, "Bitte beschreiben Sie den Schaden detailliert."),
  measuresDescription: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface DamageIncidentFormProps {
  incidentId?: string | null;
  onSubmit: (values: FormValues) => void;
}

export function DamageIncidentForm({ incidentId, onSubmit }: DamageIncidentFormProps) {
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  // Fetch assets
  const { data: assets = [], isLoading: assetsLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: getAssets
  });

  // Fetch employees
  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees
  });

  // Mock data for existing incident (for edit mode)
  const mockIncident = incidentId ? {
    title: "Laptop Displayschaden",
    assetId: "A-2023-001",
    description: "MacBook Pro Display hat einen Riss",
    priority: "high" as const,
    damageType: "physical",
    damageDate: "2023-04-15",
    location: "Büro Berlin",
    reportedBy: "user-123",
    isConfidential: false,
    damageDescription: "Display wurde fallen gelassen und hat jetzt einen Riss diagonal über den Bildschirm. Das Gerät ist funktionsfähig, aber das Display ist beeinträchtigt.",
    measuresDescription: "MacBook wurde vorübergehend an externen Monitor angeschlossen. Reparatur notwendig."
  } : null;

  const defaultValues: FormValues = mockIncident || {
    title: "",
    assetId: "",
    description: "",
    priority: "medium",
    damageType: "",
    damageDate: new Date().toISOString().split('T')[0],
    location: "",
    reportedBy: "",
    isConfidential: false,
    damageDescription: "",
    measuresDescription: "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleFormSubmit = async (values: FormValues) => {
    setIsLoadingSubmit(true);
    try {
      // In a real app, we would save the data to the database here
      console.log("Form values:", values);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      onSubmit(values);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const damageTypes = [
    { value: "physical", label: "Physischer Schaden" },
    { value: "water", label: "Wasserschaden" },
    { value: "electrical", label: "Elektrischer Defekt" },
    { value: "software", label: "Software Problem" },
    { value: "theft", label: "Diebstahl" },
    { value: "loss", label: "Verlust" },
    { value: "other", label: "Sonstiges" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titel des Schadensfalls</FormLabel>
                <FormControl>
                  <Input placeholder="z.B. Laptop Display gebrochen" {...field} />
                </FormControl>
                <FormDescription>Kurze Beschreibung des Schadens</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="assetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Betroffenes Asset</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Asset auswählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assetsLoading ? (
                        <SelectItem value="loading">Lädt...</SelectItem>
                      ) : (
                        assets.map((asset) => (
                          <SelectItem key={asset.id} value={asset.id}>
                            {asset.name} ({asset.serialNumber || asset.inventoryNumber})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="damageDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schadensdatum</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="damageType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Art des Schadens</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Schadensart auswählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {damageTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
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
              name="priority"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Priorität</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-1"
                    >
                      <FormItem className="flex items-center space-x-1 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="low" />
                        </FormControl>
                        <FormLabel className="font-normal">Niedrig</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-1 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="medium" />
                        </FormControl>
                        <FormLabel className="font-normal">Mittel</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-1 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="high" />
                        </FormControl>
                        <FormLabel className="font-normal">Hoch</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ort des Schadensereignisses</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Büro Berlin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reportedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gemeldet durch</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Person auswählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employeesLoading ? (
                        <SelectItem value="loading">Lädt...</SelectItem>
                      ) : (
                        employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.firstName} {employee.lastName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <Alert variant="outline" className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertTitle>ISO 27001 Anforderungen</AlertTitle>
            <AlertDescription>
              Geben Sie bitte eine detaillierte Beschreibung des Schadens ein, um die Anforderungen der ISO 27001 an das Incident Management zu erfüllen.
            </AlertDescription>
          </Alert>

          <FormField
            control={form.control}
            name="damageDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detaillierte Schadensbeschreibung</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Beschreiben Sie den Schaden detailliert" 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Beschreiben Sie genau, was passiert ist, wie der Schaden entstanden ist und welche Auswirkungen er hat.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="measuresDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sofort eingeleitete Maßnahmen</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Welche Maßnahmen wurden bereits ergriffen?" 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Beschreiben Sie, welche Sofortmaßnahmen bereits ergriffen wurden, um den Schaden zu begrenzen.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4 space-x-2 flex justify-end">
          <Button variant="outline" type="button" onClick={() => form.reset()}>
            Zurücksetzen
          </Button>
          <Button type="submit" disabled={isLoadingSubmit}>
            {isLoadingSubmit ? "Wird gespeichert..." : incidentId ? "Aktualisieren" : "Speichern"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
