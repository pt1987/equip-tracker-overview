
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeFormSchema, EmployeeFormValues, competenceLevels } from "@/components/employees/EmployeeFormTypes";
import { useEffect } from "react";
import { Employee } from "@/lib/types";

interface EmployeeFormContainerProps {
  employee: Employee | null;
  onSubmit: (data: EmployeeFormValues) => Promise<void>;
  isSubmitting: boolean;
  children: React.ReactNode;
}

export function EmployeeFormContainer({ 
  employee, 
  onSubmit, 
  isSubmitting, 
  children 
}: EmployeeFormContainerProps) {
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      position: "",
      cluster: "Development",
      competenceLevel: "Junior" as const,
      entryDate: new Date().toISOString().split('T')[0],
      budget: 5000,
      profileImage: "",
    },
  });

  // Update form when employee data is loaded
  useEffect(() => {
    if (employee) {
      console.log("Setting form values from employee:", employee);

      // Ensure competenceLevel is one of the valid values from our enum
      const validCompetenceLevel = employee.competenceLevel && 
        competenceLevels.includes(employee.competenceLevel as any) 
          ? employee.competenceLevel as any
          : "Junior"; // Default to Junior if not valid
          
      form.reset({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        email: employee.email || "",
        position: employee.position || "",
        cluster: employee.cluster as any || "Development",
        competenceLevel: validCompetenceLevel,
        entryDate: employee.startDate ? new Date(employee.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        budget: employee.budget || 5000,
        profileImage: employee.imageUrl || "",
      });
    }
  }, [employee, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {children}
      </form>
    </Form>
  );
}
