
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Employee } from "@/lib/types";
import { Form } from "@/components/ui/form";
import { useState } from "react";
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
  
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: employee.firstName,
      lastName: employee.lastName,
      position: employee.position,
      cluster: employee.cluster,
      entryDate: new Date(employee.startDate).toISOString().split('T')[0],
      budget: employee.budget,
      profileImage: employee.imageUrl || "",
    },
  });
  
  const handleImageChange = (imageUrl: string) => {
    setImagePreview(imageUrl);
    form.setValue("profileImage", imageUrl);
  };
  
  const handleSubmit = (data: EmployeeFormValues) => {
    onSave({
      ...data, 
      startDate: new Date(data.entryDate),
      imageUrl: data.profileImage
    });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <EmployeeImageUpload
            initialImageUrl={employee.imageUrl}
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
