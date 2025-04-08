
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EmployeeCardProps {
  employee: Employee;
  index?: number; // Added this optional prop to match usage in Employees.tsx
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  // Use React Query to get asset counts from Supabase
  const { data: assetSummary, isLoading } = useQuery({
    queryKey: ['employee-assets', employee.id],
    queryFn: async () => {
      if (!employee.id) return null;
      
      // Get all assets assigned to this employee
      const { data, error } = await supabase
        .from('assets')
        .select('type')
        .eq('employee_id', employee.id);
      
      if (error) {
        console.error("Error fetching employee assets:", error);
        return null;
      }

      // Count assets by type
      const summary = {
        laptop: data.filter(asset => asset.type === 'laptop').length,
        smartphone: data.filter(asset => asset.type === 'smartphone').length,
        tablet: data.filter(asset => asset.type === 'tablet').length,
        mouse: data.filter(asset => asset.type === 'mouse').length,
        keyboard: data.filter(asset => asset.type === 'keyboard').length,
        accessory: data.filter(asset => asset.type === 'accessory').length,
      };
      
      return summary;
    },
    enabled: !!employee.id
  });

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
            
            {isLoading ? (
              <div className="col-span-2 text-center text-sm text-muted-foreground">
                Loading asset data...
              </div>
            ) : assetSummary ? (
              <>
                <div>
                  <span className="text-muted-foreground">Laptops:</span>
                  <p>{assetSummary.laptop}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Smartphones:</span>
                  <p>{assetSummary.smartphone}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tablets:</span>
                  <p>{assetSummary.tablet}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Mice:</span>
                  <p>{assetSummary.mouse}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Keyboards:</span>
                  <p>{assetSummary.keyboard}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Accessories:</span>
                  <p>{assetSummary.accessory}</p>
                </div>
              </>
            ) : null}
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
