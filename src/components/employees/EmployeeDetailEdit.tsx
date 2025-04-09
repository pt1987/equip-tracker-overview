
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Employee } from "@/lib/types";
import { Form } from "@/components/ui/form";
import { useState, useEffect } from "react";
import { employeeFormSchema, EmployeeFormValues } from "./EmployeeFormTypes";
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
  
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email || "", // Ensure email is initialized, even if empty
      position: employee.position,
      cluster: employee.cluster,
      entryDate: new Date(employee.startDate).toISOString().split('T')[0],
      budget: employee.budget,
      profileImage: employee.imageUrl || "",
    },
  });
  
  // Update form when employee data changes, especially when email is loaded
  useEffect(() => {
    console.log("Setting email in form to:", employee.email);
    // Update all form fields to ensure nothing is lost
    form.setValue("firstName", employee.firstName);
    form.setValue("lastName", employee.lastName);
    form.setValue("email", employee.email || "");
    form.setValue("position", employee.position);
    form.setValue("cluster", employee.cluster);
    form.setValue("entryDate", new Date(employee.startDate).toISOString().split('T')[0]);
    form.setValue("budget", employee.budget);
    form.setValue("profileImage", employee.imageUrl || "");
  }, [employee, form]);
  
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
          </div>
        </div>
      </form>
    </Form>
  );
}
