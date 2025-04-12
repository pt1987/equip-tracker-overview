
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Employee } from "@/lib/types";
import { Form } from "@/components/ui/form";
import { useState, useEffect } from "react";
import { employeeFormSchema, EmployeeFormValues, competenceLevels } from "./EmployeeFormTypes";
import EmployeeFormFields from "./EmployeeForm";
import EmployeeImageUpload from "./EmployeeImageUpload";

interface EmployeeDetailEditProps {
  employee: Employee;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function EmployeeDetailEdit({
  employee,
  onSave,
  onCancel,
}: EmployeeDetailEditProps) {
  const [imagePreview, setImagePreview] = useState(employee.imageUrl || "");
  
  // Debug: Log the employee object to verify email exists
  console.log("Employee data in EmployeeDetailEdit:", employee);
  
  // Ensure competenceLevel is one of the valid values from our enum
  const validCompetenceLevel = employee.competenceLevel && 
    competenceLevels.includes(employee.competenceLevel as any) 
      ? employee.competenceLevel as any
      : "Junior"; // Default to Junior if not valid
  
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email || "",
      position: employee.position,
      cluster: employee.cluster as any, // Cast to any to handle potential type mismatch
      competenceLevel: validCompetenceLevel, 
      entryDate: new Date(employee.startDate).toISOString().split('T')[0],
      budget: employee.budget,
      profileImage: employee.imageUrl || "",
    },
  });
  
  useEffect(() => {
    console.log("Setting email in form to:", employee.email);
    form.setValue("firstName", employee.firstName);
    form.setValue("lastName", employee.lastName);
    form.setValue("email", employee.email || "");
    form.setValue("position", employee.position);
    form.setValue("cluster", employee.cluster as any);
    form.setValue("competenceLevel", validCompetenceLevel);
    form.setValue("entryDate", new Date(employee.startDate).toISOString().split('T')[0]);
    form.setValue("budget", employee.budget);
    form.setValue("profileImage", employee.imageUrl || "");
  }, [employee, form, validCompetenceLevel]);
  
  const handleImageChange = (imageUrl: string) => {
    setImagePreview(imageUrl);
    form.setValue("profileImage", imageUrl);
  };
  
  const handleSubmit = (data: EmployeeFormValues) => {
    console.log("Submitting form with data:", data);
    onSave({
      ...data, 
      startDate: new Date(data.entryDate),
      imageUrl: data.profileImage,
      email: data.email // Explicitly include email in the save data
    });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <EmployeeImageUpload
            initialImageUrl={employee.imageUrl}
            employeeId={employee.id}
            onImageChange={handleImageChange}
            onSave={form.handleSubmit(handleSubmit)}
            onCancel={onCancel}
          />
          
          <div className="flex-1">
            <EmployeeFormFields />
            
            <div className="mt-6 flex justify-end space-x-2">
              <button 
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
