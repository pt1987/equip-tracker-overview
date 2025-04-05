
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PageTransition from "@/components/layout/PageTransition";
import EmployeeCard from "@/components/employees/EmployeeCard";
import SearchFilter from "@/components/shared/SearchFilter";
import ViewToggle from "@/components/shared/ViewToggle";
import { Button } from "@/components/ui/button";
import { Employee } from "@/lib/types";
import { UserPlus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getEmployees } from "@/services/employeeService";

const EmployeesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");
  
  // Fetch employees from Supabase
  const { 
    data: employees, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees
  });

  useEffect(() => {
    if (!employees) return;
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      setFilteredEmployees(
        employees.filter(
          (employee) =>
            employee.firstName.toLowerCase().includes(lowerSearchTerm) ||
            employee.lastName.toLowerCase().includes(lowerSearchTerm) ||
            employee.position.toLowerCase().includes(lowerSearchTerm) ||
            employee.cluster.toLowerCase().includes(lowerSearchTerm)
        )
      );
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchTerm, employees]);

  return (
    <PageTransition>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Employees</h1>
            <p className="text-muted-foreground mt-1">
              Manage and view all employee information and assigned assets
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button onClick={() => navigate('/employee/create')} className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
            <ViewToggle view={view} onViewChange={setView} />
          </div>
        </div>
        
        <SearchFilter 
          placeholder="Search employees..." 
          onSearch={setSearchTerm}
          className="w-full md:max-w-md"
        />
        
        {/* Loading state */}
        {isLoading && (
          <div className="glass-card p-12 text-center">
            <div className="animate-spin mx-auto w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-muted-foreground">Loading employees...</p>
          </div>
        )}
        
        {/* Error state */}
        {isError && (
          <div className="glass-card p-12 text-center">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <X className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Failed to load employees</h3>
            <p className="text-muted-foreground mb-6">
              There was a problem loading the employees data.
            </p>
          </div>
        )}
        
        {/* No results state */}
        {!isLoading && !isError && filteredEmployees && filteredEmployees.length === 0 && (
          <div className="glass-card p-12 text-center">
            <h3 className="text-lg font-medium mb-2">No employees found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? "No employees match your search criteria." : "You haven't added any employees yet."}
            </p>
            <Button onClick={() => navigate('/employee/create')}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </div>
        )}
        
        {/* Employee grid */}
        {!isLoading && filteredEmployees && filteredEmployees.length > 0 && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEmployees.map((employee, index) => (
              <EmployeeCard 
                key={employee.id} 
                employee={employee} 
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default EmployeesPage;
