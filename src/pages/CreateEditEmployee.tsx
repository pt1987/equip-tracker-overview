import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition";
import Navbar from "@/components/layout/Navbar";
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
import { employees } from "@/data/mockData";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";

// Schema für das Formular
const employeeFormSchema = z.object({
  firstName: z.string().min(1, "Bitte geben Sie einen Vornamen ein"),
  lastName: z.string().min(1, "Bitte geben Sie einen Nachnamen ein"),
  position: z.string().min(1, "Bitte geben Sie eine Position ein"),
  cluster: z.string().min(1, "Bitte wählen Sie einen Cluster"),
  entryDate: z.string().min(1, "Bitte geben Sie ein Eintrittsdatum an"),
  budget: z.coerce.number().min(0, "Das Budget darf nicht negativ sein"),
  profileImage: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export default function CreateEditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { data: employeeData = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: () => employees,
    initialData: employees,
  });

  const employee = isEditing ? employeeData.find(e => e.id === id) : null;

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: isEditing && employee ? {
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      position: employee.position || "",
      cluster: employee.cluster || "",
      entryDate: new Date(employee.entryDate).toISOString().split('T')[0],
      budget: employee.budget || 0,
      profileImage: employee.profileImage || "",
    } : {
      firstName: "",
      lastName: "",
      position: "",
      cluster: "",
      entryDate: new Date().toISOString().split('T')[0],
      budget: 5000,
      profileImage: "",
    }
  });

  const onSubmit = (data: EmployeeFormValues) => {
    // In einer echten Anwendung würden wir hier die Daten zur API senden
    console.log(data);
    
    // Toast-Nachricht anzeigen
    toast({
      title: isEditing ? "Mitarbeiter aktualisiert" : "Mitarbeiter erstellt",
      description: `${data.firstName} ${data.lastName} wurde erfolgreich ${isEditing ? 'aktualisiert' : 'erstellt'}.`,
    });
    
    // Zurück zur Mitarbeiter-Übersicht navigieren
    navigate("/employees");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 container px-4 py-6 md:px-6 md:py-8">
        <PageTransition>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {isEditing ? "Mitarbeiter bearbeiten" : "Neuen Mitarbeiter anlegen"}
                </h1>
                <p className="text-muted-foreground">
                  {isEditing 
                    ? "Aktualisieren Sie die Informationen des ausgewählten Mitarbeiters" 
                    : "Fügen Sie einen neuen Mitarbeiter zur Datenbank hinzu"}
                </p>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mitarbeiter Details</CardTitle>
                    <CardDescription>
                      Geben Sie die Informationen für diesen Mitarbeiter ein
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                            <FormLabel>Profilbild URL</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://example.com/image.jpg" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Geben Sie die URL eines Profilbilds ein
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate(-1)}
                    >
                      Abbrechen
                    </Button>
                    <Button type="submit">
                      {isEditing ? "Speichern" : "Erstellen"}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>
          </div>
        </PageTransition>
      </div>
    </div>
  );
}
