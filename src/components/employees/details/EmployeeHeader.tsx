
import { Employee } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface EmployeeHeaderProps {
  employee: Employee;
}

export default function EmployeeHeader({ employee }: EmployeeHeaderProps) {
  return (
    <div>
      <div className="inline-flex items-center gap-2">
        <Badge variant="secondary" className="px-2 py-1 mb-2 text-xs font-medium">
          {employee.cluster}
        </Badge>
        {employee.competence_level && (
          <Badge variant="outline" className="px-2 py-1 mb-2 text-xs font-medium">
            {employee.competence_level}
          </Badge>
        )}
      </div>
      <h1 className="text-2xl font-bold mb-1">
        {employee.firstName} {employee.lastName}
      </h1>
      <p className="text-muted-foreground mb-6">{employee.position}</p>
    </div>
  );
}
