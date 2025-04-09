
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Employee } from "@/lib/types";
import { useEmployeeAssets } from "@/hooks/use-employee-assets";
import EmployeeCardHeader from "./card/EmployeeCardHeader";
import EmployeeInfoDisplay from "./card/EmployeeInfoDisplay";
import AssetSummaryDisplay from "./card/AssetSummaryDisplay";

interface EmployeeCardProps {
  employee: Employee;
  index?: number; // Added this optional prop to match usage in Employees.tsx
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, index }) => {
  // Use the custom hook to get asset data
  const { data: assetSummary, isLoading } = useEmployeeAssets(employee.id);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>
          <EmployeeCardHeader employee={employee} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <EmployeeInfoDisplay employee={employee} />
          <AssetSummaryDisplay assetSummary={assetSummary} isLoading={isLoading} />
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
