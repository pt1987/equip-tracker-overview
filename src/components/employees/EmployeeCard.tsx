
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Employee } from "@/lib/types";
import { useEmployeeAssets } from "@/hooks/use-employee-assets";
import EmployeeCardHeader from "./card/EmployeeCardHeader";
import EmployeeInfoDisplay from "./card/EmployeeInfoDisplay";
import AssetSummaryDisplay from "./card/AssetSummaryDisplay";

interface EmployeeCardProps {
  employee: Employee;
  index?: number;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, index }) => {
  // Use the custom hook to get asset data
  const { data: assetSummary, isLoading } = useEmployeeAssets(employee.id);

  return (
    <Link to={`/employee/${employee.id}`} className="block w-full">
      <Card className="glass-card hover:shadow-lg transition-all duration-200 hover:border-primary/20 cursor-pointer">
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
      </Card>
    </Link>
  );
};

export default EmployeeCard;
