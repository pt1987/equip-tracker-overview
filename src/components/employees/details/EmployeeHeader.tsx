
import { Employee } from "@/lib/types";

interface EmployeeHeaderProps {
  employee: Employee;
}

export default function EmployeeHeader({ employee }: EmployeeHeaderProps) {
  return (
    <div>
      <div className="inline-flex items-center px-2 py-1 mb-2 rounded-full bg-secondary text-xs font-medium">
        {employee.cluster}
      </div>
      <h1 className="text-2xl font-bold mb-1">
        {employee.firstName} {employee.lastName}
      </h1>
      <p className="text-muted-foreground mb-6">{employee.position}</p>
    </div>
  );
}
