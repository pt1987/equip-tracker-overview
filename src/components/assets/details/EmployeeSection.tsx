
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEmployeeById } from "@/data/employees";
import { User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface EmployeeSectionProps {
  employeeId: string | null;
}

export default function EmployeeSection({ employeeId }: EmployeeSectionProps) {
  const [employeeData, setEmployeeData] = useState<any | null>(null);
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (employeeId) {
        setIsLoadingEmployee(true);
        try {
          const employee = await getEmployeeById(employeeId);
          setEmployeeData(employee);
        } catch (error) {
          console.error("Error fetching employee data:", error);
        } finally {
          setIsLoadingEmployee(false);
        }
      }
    };
    
    if (employeeId) {
      fetchEmployee();
    }
  }, [employeeId]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Zugewiesener Mitarbeiter</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {employeeId ? (
          <>
            {isLoadingEmployee ? (
              <div className="flex justify-center py-4 w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : employeeData ? (
              <div className="flex items-center gap-5">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={employeeData.imageUrl || `https://avatar.vercel.sh/${employeeData.id}`} alt={`${employeeData.firstName} ${employeeData.lastName}`} />
                  <AvatarFallback>
                    {employeeData.firstName?.[0]}{employeeData.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Link to={`/employee/${employeeData.id}`} className="text-lg font-medium hover:underline">
                    {employeeData.firstName} {employeeData.lastName}
                  </Link>
                  <p className="text-sm text-muted-foreground">{employeeData.position}</p>
                  <p className="text-sm text-muted-foreground">{employeeData.cluster}</p>
                  <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
                    <Link to={`/employee/${employeeData.id}`}>
                      Details anzeigen
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <p>Mitarbeiterdaten konnten nicht geladen werden.</p>
                <p className="text-sm text-muted-foreground">ID: {employeeId}</p>
              </div>
            )}
          </>
        ) : (
          <div className="py-2 flex items-center gap-3">
            <User size={20} className="text-muted-foreground opacity-70" />
            <p className="text-muted-foreground">
              Dieses Asset ist keinem Mitarbeiter zugewiesen.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
