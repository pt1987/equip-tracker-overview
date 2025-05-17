
import { Link } from "react-router-dom";
import { Employee } from "@/lib/types";
import { formatDate, calculateEmploymentDuration } from "@/lib/utils";

interface EmployeeListViewProps {
  employees: Employee[];
}

const EmployeeListView = ({ employees }: EmployeeListViewProps) => {
  return (
    <div className="space-y-4">
      {employees.map((employee) => (
        <Link
          key={employee.id}
          to={`/employee/${employee.id}`}
          className="glass-card p-4 flex items-center gap-4 hover:bg-secondary/10 transition-colors"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
            <img
              src={employee.imageUrl}
              alt={`${employee.firstName} ${employee.lastName}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://avatar.vercel.sh/' + employee.id;
              }}
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{employee.firstName} {employee.lastName}</h3>
            <p className="text-sm text-muted-foreground">{employee.position}</p>
          </div>
          <div className="hidden md:block w-48">
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-secondary text-xs font-medium">
              {employee.cluster}
            </span>
          </div>
          <div className="hidden md:block w-48">
            <p className="text-sm">
              <span className="text-muted-foreground">Seit: </span>
              {formatDate(employee.startDate)}
            </p>
            <p className="text-xs text-muted-foreground">
              {calculateEmploymentDuration(employee.startDate)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default EmployeeListView;
