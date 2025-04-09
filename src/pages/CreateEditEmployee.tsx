
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

// Function to generate a secure random password
const generateSecurePassword = () => {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  
  // Ensure password has at least one of each: uppercase, lowercase, number, special char
  password += "Aa1!";
  
  // Fill the rest with random characters
  for (let i = 0; i < length - 4; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  // Shuffle the password characters
  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
};

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
      email: employee.email || "",
      position: employee.position || "",
      cluster: employee.cluster || "",
      entryDate: employee.entryDate || employee.startDate ? new Date(employee.startDate).toISOString().split('T')[0] : "",
      budget: employee.budget || 0,
      profileImage: employee.profileImage || employee.imageUrl || "",
    } : {
      firstName: "",
      lastName: "",
      email: "",
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

      if (isEditing) {
        // Update existing employee
        await updateExistingEmployee(employeeId as string, data);
      } else {
        // Create new employee with auth account
        await createNewEmployeeWithAuth(employeeId, data);
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

  const updateExistingEmployee = async (employeeId: string, data: EmployeeFormValues) => {
    // Update profile data
    const profileData = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
    };

    const { error: profileError } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', employeeId);
      
    if (profileError) throw profileError;
    
    // Update employee data
    const employeeData = {
      id: employeeId,
      first_name: data.firstName,
      last_name: data.lastName,
      position: data.position,
      cluster: data.cluster,
      start_date: new Date(data.entryDate).toISOString(),
      entry_date: new Date(data.entryDate).toISOString(),
      budget: data.budget,
      // Make image fields optional
      image_url: data.profileImage || null,
      profile_image: data.profileImage || null
    };

    const { error } = await supabase
      .from('employees')
      .update(employeeData)
      .eq('id', employeeId);
      
    if (error) throw error;
  };

  const createNewEmployeeWithAuth = async (employeeId: string, data: EmployeeFormValues) => {
    const temporaryPassword = generateSecurePassword();
    
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        first_name: data.firstName,
        last_name: data.lastName,
      },
      role: "authenticated"
    });
    
    if (authError) throw new Error(`Fehler beim Erstellen des Benutzerkontos: ${authError.message}`);
    
    const userId = authData.user.id;
    
    // 2. Create profile entry
    const profileData = {
      id: userId,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      role: 'user'
    };
    
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([profileData]);
      
    if (profileError) throw new Error(`Fehler beim Erstellen des Profils: ${profileError.message}`);
    
    // 3. Create employee entry - with optional images
    const employeeData = {
      id: userId,
      first_name: data.firstName,
      last_name: data.lastName,
      position: data.position,
      cluster: data.cluster,
      start_date: new Date(data.entryDate).toISOString(),
      entry_date: new Date(data.entryDate).toISOString(),
      budget: data.budget,
      // Make image fields optional
      image_url: data.profileImage || null,
      profile_image: data.profileImage || null
    };
    
    const { error: employeeError } = await supabase
      .from('employees')
      .insert([employeeData]);
      
    if (employeeError) throw new Error(`Fehler beim Erstellen des Mitarbeiters: ${employeeError.message}`);
    
    // 4. Send invitation email with password reset link
    const { error: passwordResetError } = await supabase.auth.resetPasswordForEmail(
      data.email,
      {
        redirectTo: `${window.location.origin}/reset-password`
      }
    );
    
    if (passwordResetError) {
      console.error("Fehler beim Senden der Einladungs-E-Mail:", passwordResetError);
      throw new Error(`Mitarbeiter wurde erstellt, aber die Einladungs-E-Mail konnte nicht gesendet werden: ${passwordResetError.message}`);
    }
    
    // Log temporary password - in a real app you would send this via a secure channel
    console.log(`Temporäres Passwort für ${data.email}: ${temporaryPassword}`);
    
    // Show additional success message with temp password
    toast({
      title: "Temporäres Passwort",
      description: `Temporäres Passwort für ${data.email}: ${temporaryPassword}`,
    });
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
