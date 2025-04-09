
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Employee } from "@/lib/types";

interface EmployeeCardHeaderProps {
  employee: Employee;
}

const EmployeeCardHeader = ({ employee }: EmployeeCardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={employee.profileImage || employee.imageUrl} alt={`${employee.firstName} ${employee.lastName}`} />
          <AvatarFallback>{employee.firstName?.[0]}{employee.lastName?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          {employee.firstName} {employee.lastName}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to={`/employee/${employee.id}`}>
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/employee/edit/${employee.id}`}>
              Edit Employee
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Deactivate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default EmployeeCardHeader;
