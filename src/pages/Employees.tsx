
import { useState, useEffect } from "react";
import PageTransition from "@/components/layout/PageTransition";
import Navbar from "@/components/layout/Navbar";
import { employees } from "@/data/mockData";
import { Employee } from "@/lib/types";
import EmployeeCard from "@/components/employees/EmployeeCard";
import SearchFilter from "@/components/shared/SearchFilter";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, Check, Users } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

const EmployeesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);
  
  // Get unique clusters
  const clusters = [...new Set(employees.map(emp => emp.cluster))];
  
  useEffect(() => {
    let filtered = employees;
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(employee => 
        employee.firstName.toLowerCase().includes(lowerSearchTerm) ||
        employee.lastName.toLowerCase().includes(lowerSearchTerm) ||
        employee.position.toLowerCase().includes(lowerSearchTerm) ||
        employee.cluster.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Apply cluster filters
    if (selectedClusters.length > 0) {
      filtered = filtered.filter(employee => selectedClusters.includes(employee.cluster));
    }
    
    setFilteredEmployees(filtered);
  }, [searchTerm, selectedClusters]);
  
  const toggleClusterFilter = (cluster: string) => {
    if (selectedClusters.includes(cluster)) {
      setSelectedClusters(selectedClusters.filter(c => c !== cluster));
    } else {
      setSelectedClusters([...selectedClusters, cluster]);
    }
  };
  
  const clearFilters = () => {
    setSelectedClusters([]);
    setSearchTerm("");
  };

  return (
    <div className="flex min-h-screen">
      <Navbar />
      
      <div className="flex-1 md:ml-64">
        <PageTransition>
          <div className="p-4 md:p-8 pb-24 max-w-7xl mx-auto mt-12 md:mt-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Employees</h1>
                <p className="text-muted-foreground mt-1">
                  Manage and view all employees
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <SearchFilter 
                placeholder="Search employees..." 
                onSearch={setSearchTerm}
                className="flex-1"
              />
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-secondary transition-colors"
              >
                <SlidersHorizontal size={18} />
                <span>Filters</span>
                {selectedClusters.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-primary text-primary-foreground">
                    {selectedClusters.length}
                  </span>
                )}
              </button>
            </div>
            
            {/* Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-4 mb-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <X size={14} />
                    Clear all
                  </button>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Cluster</h4>
                  <div className="flex flex-wrap gap-2">
                    {clusters.map(cluster => (
                      <button
                        key={cluster}
                        onClick={() => toggleClusterFilter(cluster)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          selectedClusters.includes(cluster)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {cluster}
                        {selectedClusters.includes(cluster) && (
                          <Check size={14} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            
            {filteredEmployees.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Users size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No employees found</h3>
                <p className="text-muted-foreground mb-6">
                  There are no employees matching your current filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
};

export default EmployeesPage;
