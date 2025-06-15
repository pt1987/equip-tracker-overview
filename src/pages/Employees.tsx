import { useState, useEffect } from "react";
import PageTransition from "@/components/layout/PageTransition";
import { Employee } from "@/lib/types";
import EmployeeCard from "@/components/employees/EmployeeCard";
import ViewToggle from "@/components/shared/ViewToggle";
import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/data/employees/fetch";
import EmployeeFilters from "@/components/employees/EmployeeFilters";
import EmployeeEmptyState from "@/components/employees/EmployeeEmptyState";
import EmployeeListView from "@/components/employees/EmployeeListView";
import EmployeeLoadingState from "@/components/employees/EmployeeLoadingState";

const EmployeesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");
  
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees
  });
  
  const clusters = [...new Set(employees.map(emp => emp.cluster))];
  
  useEffect(() => {
    let filtered = employees;
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(employee => 
        employee.firstName.toLowerCase().includes(lowerSearchTerm) ||
        employee.lastName.toLowerCase().includes(lowerSearchTerm) ||
        employee.position.toLowerCase().includes(lowerSearchTerm) ||
        employee.cluster.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    if (selectedClusters.length > 0) {
      filtered = filtered.filter(employee => selectedClusters.includes(employee.cluster));
    }
    
    setFilteredEmployees(filtered);
  }, [searchTerm, selectedClusters, employees]);
  
  const clearFilters = () => {
    setSelectedClusters([]);
    setSearchTerm("");
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="p-3 md:p-4 xl:p-6 space-y-6 max-w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Employees</h1>
              <p className="text-muted-foreground mt-1">Loading...</p>
            </div>
          </div>
          <EmployeeLoadingState variant="card" count={6} />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="p-3 md:p-4 xl:p-6 space-y-6 max-w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Employees</h1>
            <p className="text-muted-foreground mt-1">
              Manage and view all employees
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <ViewToggle view={view} onViewChange={setView} />
          </div>
        </div>
        
        <EmployeeFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedClusters={selectedClusters}
          setSelectedClusters={setSelectedClusters}
          clusters={clusters}
          clearFilters={clearFilters}
        />
        
        {filteredEmployees.length === 0 ? (
          <EmployeeEmptyState clearFilters={clearFilters} />
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <EmployeeCard 
                key={employee.id} 
                employee={employee} 
              />
            ))}
          </div>
        ) : (
          <EmployeeListView employees={filteredEmployees} />
        )}
      </div>
    </PageTransition>
  );
};

export default EmployeesPage;
