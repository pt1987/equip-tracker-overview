
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { getEmployees, createEmployee, updateEmployee } from "@/data/employees";
import { uploadEmployeeImage } from "@/data/employees/storage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import EmployeeFormFields from "@/components/employees/EmployeeForm";
import { employeeFormSchema, EmployeeFormValues } from "@/components/employees/EmployeeFormTypes";
import { useState } from "react";

export default function CreateEditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: EmployeeFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Form submitted with data:", data);
      
      let imageUrl = data.profileImage;
      
      if (isEditing && id) {
        // If there's a new image, upload it first
        if (selectedImage) {
          imageUrl = await uploadEmployeeImage(selectedImage, id);
        }
        
        // Update existing employee
        const success = await updateEmployee(id, {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          position: data.position,
          cluster: data.cluster,
          start_date: data.entryDate,
          budget: data.budget,
          image_url: imageUrl || null,
          profile_image: imageUrl || null
        });
        
        if (!success) {
          throw new Error("Failed to update employee record");
        }
      } else {
        // Create new employee
        const employeeId = await createEmployee({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          position: data.position,
          cluster: data.cluster,
          start_date: data.entryDate,
          budget: data.budget,
          image_url: null,  // Will update after creation if needed
          profile_image: null  // Will update after creation if needed
        });
        
        // If we have a selected image and got a valid employee ID, upload it
        if (selectedImage && employeeId) {
          imageUrl = await uploadEmployeeImage(selectedImage, employeeId);
          
          // Update the employee with the image URL
          await updateEmployee(employeeId, {
            image_url: imageUrl,
            profile_image: imageUrl
          });
        }
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="col-span-1">
                      <div className="aspect-square bg-muted rounded-full overflow-hidden relative group">
                        <img
                          src={imagePreview || form.watch("profileImage") || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer px-3 py-2 bg-background rounded-md text-sm font-medium">
                            Bild auswählen
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <EmployeeFormFields />
                    </div>
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
