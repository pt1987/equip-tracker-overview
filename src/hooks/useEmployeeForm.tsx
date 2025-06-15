
import { useState, useEffect } from "react";
import { getEmployeeById } from "@/data/employees/fetch";
import { uploadEmployeeImage } from "@/data/employees/storage";
import { toast } from "@/hooks/use-toast";
import { EmployeeFormValues } from "@/components/employees/EmployeeFormTypes";
import { useQueryClient } from "@tanstack/react-query";
import { createEmployee } from "@/data/employees/create";
import { updateEmployee } from "@/data/employees/update";
import { useNavigate } from "react-router-dom";

export function useEmployeeForm(id: string | undefined) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [employee, setEmployee] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(isEditing);

  // Load employee data if editing
  useEffect(() => {
    const loadEmployee = async () => {
      if (isEditing && id) {
        setIsLoading(true);
        try {
          const employeeData = await getEmployeeById(id);
          if (employeeData) {
            setEmployee(employeeData);
            setImagePreview(employeeData.imageUrl || null);
          }
        } catch (error) {
          console.error("Error loading employee:", error);
          toast({
            variant: "destructive",
            title: "Fehler beim Laden",
            description: "Mitarbeiterdaten konnten nicht geladen werden."
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadEmployee();
  }, [isEditing, id]);

  const handleImageChange = (file: File) => {
    setSelectedImage(file);
  };

  const handleSubmit = async (data: EmployeeFormValues) => {
    setIsSubmitting(true);
    
    try {
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
          competence_level: data.competenceLevel,
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
          competence_level: data.competenceLevel,
          start_date: data.entryDate,
          budget: data.budget,
          image_url: null,
          profile_image: null
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
        variant: "destructive",
        title: "Fehler",
        description: `Ein Fehler ist aufgetreten: ${(error as Error).message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isEditing,
    isLoading,
    isSubmitting,
    employee,
    imagePreview,
    handleImageChange,
    handleSubmit,
    handleCancel: () => navigate(-1)
  };
}
