
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { getEmployees } from "@/data/employees";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import EmployeeFormFields from "@/components/employees/EmployeeForm";
import { employeeFormSchema, EmployeeFormValues } from "@/components/employees/EmployeeFormTypes";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export default function CreateEditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: employeeData = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });

  const employee = isEditing ? employeeData.find(e => e.id === id) : null;

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: isEditing && employee ? {
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      position: employee.position || "",
      cluster: employee.cluster || "",
      entryDate: employee.entryDate || employee.startDate ? new Date(employee.startDate).toISOString().split('T')[0] : "",
      budget: employee.budget || 0,
      profileImage: employee.profileImage || employee.imageUrl || "",
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

  const onSubmit = async (data: EmployeeFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Form submitted with data:", data);
      
      // Generate UUID for new employee
      const employeeId = isEditing ? id : crypto.randomUUID();
      
      // First, we need to create or update a profile entry
      // This is necessary because employees table has a foreign key constraint to profiles
      const profileData = {
        id: employeeId,
        name: `${data.firstName} ${data.lastName}`,
        email: `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}@example.com`, // Using a placeholder email
        role: 'user'
      };

      // Create or update the profile first
      if (isEditing) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', employeeId);
          
        if (profileError) throw profileError;
      } else {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([profileData]);
          
        if (profileError) throw profileError;
      }
      
      // Now prepare the employee data
      const employeeData = {
        id: employeeId,
        first_name: data.firstName,
        last_name: data.lastName,
        position: data.position,
        cluster: data.cluster,
        start_date: new Date(data.entryDate).toISOString(),
        entry_date: new Date(data.entryDate).toISOString(),
        budget: data.budget,
        image_url: data.profileImage || null,
        profile_image: data.profileImage || null
      };
      
      // Insert or update the employee data
      if (isEditing) {
        const { error } = await supabase
          .from('employees')
          .update(employeeData)
          .eq('id', id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('employees')
          .insert([employeeData]);
          
        if (error) throw error;
      }
      
      // Show success message
      toast({
        title: isEditing ? "Mitarbeiter aktualisiert" : "Mitarbeiter erstellt",
        description: `${data.firstName} ${data.lastName} wurde erfolgreich ${isEditing ? 'aktualisiert' : 'erstellt'}.`,
      });
      
      // Navigate back to the employee overview
      navigate("/employees");
    } catch (error) {
      console.error("Error saving employee:", error);
      toast({
        title: "Fehler",
        description: `Ein Fehler ist aufgetreten: ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
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
                <CardContent className="card-content">
                  <EmployeeFormFields />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(-1)}
                  >
                    Abbrechen
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting 
                      ? isEditing ? "Wird gespeichert..." : "Wird erstellt..." 
                      : isEditing ? "Speichern" : "Erstellen"}
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
