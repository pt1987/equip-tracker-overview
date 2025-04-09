
import { formatDate } from "@/lib/utils";
import { Employee } from "@/lib/types";

interface EmployeeInfoDisplayProps {
  employee: Employee;
}

const EmployeeInfoDisplay = ({ employee }: EmployeeInfoDisplayProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <span className="text-muted-foreground">Position:</span>
        <p>{employee.position}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Cluster:</span>
        <p>{employee.cluster}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Start Date:</span>
        <p>{formatDate(employee.startDate)}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Budget:</span>
        <p>{employee.budget}</p>
      </div>
    </div>
  );
};

export default EmployeeInfoDisplay;
