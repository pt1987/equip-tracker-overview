
import { Employee } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface EmployeeHeaderProps {
  employee: Employee;
}

export default function EmployeeHeader({ employee }: EmployeeHeaderProps) {
  return (
    <div className="mt-4 md:mt-0">
      <div className="inline-flex items-center flex-wrap gap-2">
        <Badge variant="secondary" className="px-2 py-1 mb-2 text-xs font-medium">
          {employee.cluster}
        </Badge>
        {employee.competenceLevel && (
          <Badge variant="outline" className="px-2 py-1 mb-2 text-xs font-medium">
            {employee.competenceLevel}
          </Badge>
        )}
      </div>
      <h1 className="text-xl md:text-2xl font-bold mb-1 break-words">
        {employee.firstName} {employee.lastName}
      </h1>
      <p className="text-muted-foreground mb-4 md:mb-6">{employee.position}</p>
    </div>
  );
}
