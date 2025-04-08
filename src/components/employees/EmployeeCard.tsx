import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Employee } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { getEmployeeAssetsSummary } from "@/data/employees";

interface EmployeeCardProps {
  employee: Employee;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  const [laptopCount, setLaptopCount] = useState(0);
  const [phoneCount, setPhoneCount] = useState(0);
  const [tabletCount, setTabletCount] = useState(0);
  const [mouseCount, setMouseCount] = useState(0);
  const [keyboardCount, setKeyboardCount] = useState(0);
  const [accessoryCount, setAccessoryCount] = useState(0);

  useEffect(() => {
    const fetchAssetSummary = async () => {
      if (employee.id) {
        const summary = await getEmployeeAssetsSummary(employee.id);
        // Now set the state with the summary data or use it directly
        setLaptopCount(summary.assetsByType.laptop.length);
        setPhoneCount(summary.assetsByType.smartphone.length);
        setTabletCount(summary.assetsByType.tablet.length);
        setMouseCount(summary.assetsByType.mouse.length);
        setKeyboardCount(summary.assetsByType.keyboard.length);
        setAccessoryCount(summary.assetsByType.accessory.length);
      }
    };
    
    fetchAssetSummary();
  }, [employee.id]);

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={employee.profileImage || employee.imageUrl} alt={`${employee.firstName} ${employee.lastName}`} />
                <AvatarFallback>{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
              </Avatar>
              <div>
                {employee.firstName} {employee.lastName}
              </div>
            </div>
          </CardTitle>
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
      </CardHeader>
      <CardContent>
        <CardDescription>
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
            <div>
              <span className="text-muted-foreground">Laptops:</span>
              <p>{laptopCount}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Smartphones:</span>
              <p>{phoneCount}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Tablets:</span>
              <p>{tabletCount}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Mice:</span>
              <p>{mouseCount}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Keyboards:</span>
              <p>{keyboardCount}</p>
            </div>
             <div>
              <span className="text-muted-foreground">Accessories:</span>
              <p>{accessoryCount}</p>
            </div>
          </div>
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link to={`/employee/${employee.id}`}>
          <Button>View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EmployeeCard;
