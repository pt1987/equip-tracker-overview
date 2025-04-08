
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface EmployeeCardProps {
  employee: Employee;
  index?: number; // Added this optional prop to match usage in Employees.tsx
}

type AssetSummary = {
  laptop: number;
  smartphone: number;
  tablet: number;
  mouse: number;
  keyboard: number;
  accessory: number;
  totalCount: number;
  totalValue: number;
};

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  // Use React Query to get asset counts from Supabase
  const { data: assetSummary, isLoading } = useQuery({
    queryKey: ['employee-assets', employee.id],
    queryFn: async () => {
      if (!employee.id) return null;
      
      // Get all assets assigned to this employee
      const { data, error } = await supabase
        .from('assets')
        .select('type, price')
        .eq('employee_id', employee.id);
      
      if (error) {
        console.error("Error fetching employee assets:", error);
        return null;
      }

      // Initialize summary
      const summary: AssetSummary = {
        laptop: 0,
        smartphone: 0,
        tablet: 0,
        mouse: 0,
        keyboard: 0,
        accessory: 0,
        totalCount: data.length,
        totalValue: data.reduce((sum, asset) => sum + asset.price, 0)
      };
      
      // Count assets by type
      data.forEach(asset => {
        if (summary[asset.type as keyof Omit<AssetSummary, 'totalCount' | 'totalValue'>] !== undefined) {
          summary[asset.type as keyof Omit<AssetSummary, 'totalCount' | 'totalValue'>]++;
        }
      });
      
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
              <div className="col-span-2 mt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Assets ({assetSummary.totalCount})</span>
                  <Badge variant="outline" className="text-xs">
                    Value: ${assetSummary.totalValue.toLocaleString()}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {assetSummary.laptop > 0 && (
                    <Badge variant="secondary" className="flex justify-between">
                      Laptops <span className="font-bold">{assetSummary.laptop}</span>
                    </Badge>
                  )}
                  {assetSummary.smartphone > 0 && (
                    <Badge variant="secondary" className="flex justify-between">
                      Phones <span className="font-bold">{assetSummary.smartphone}</span>
                    </Badge>
                  )}
                  {assetSummary.tablet > 0 && (
                    <Badge variant="secondary" className="flex justify-between">
                      Tablets <span className="font-bold">{assetSummary.tablet}</span>
                    </Badge>
                  )}
                  {assetSummary.mouse > 0 && (
                    <Badge variant="secondary" className="flex justify-between">
                      Mice <span className="font-bold">{assetSummary.mouse}</span>
                    </Badge>
                  )}
                  {assetSummary.keyboard > 0 && (
                    <Badge variant="secondary" className="flex justify-between">
                      Keyboards <span className="font-bold">{assetSummary.keyboard}</span>
                    </Badge>
                  )}
                  {assetSummary.accessory > 0 && (
                    <Badge variant="secondary" className="flex justify-between">
                      Accessories <span className="font-bold">{assetSummary.accessory}</span>
                    </Badge>
                  )}
                </div>
              </div>
            ) : (
              <div className="col-span-2 text-center text-sm text-muted-foreground">
                No assets found
              </div>
            )}
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
