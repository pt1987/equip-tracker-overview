
import { useFormContext } from "react-hook-form";
import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEmployees } from "@/data/employees";
import { Employee } from "@/lib/types";
import { AssetFormValues } from "../AssetFormFields";

export default function EmployeeAssignmentSection() {
  const form = useFormContext<AssetFormValues>();
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const employeeData = await getEmployees();
        setEmployees(employeeData);
      } catch (error) {
        console.error("Error loading employees:", error);
      }
    };
    
    loadEmployees();
  }, []);

  return (
    <FormField
      control={form.control}
      name="employeeId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Zugewiesen an</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value || 'not_assigned'}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Mitarbeiter auswählen" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="not_assigned">Nicht zugewiesen</SelectItem>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
