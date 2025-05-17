
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEmployees } from '@/data/employees';
import { getAssets } from '@/data/assets';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { Employee, Asset } from '@/lib/types';
import { Search } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface EmployeeBudgetReportProps {
  dateRange?: DateRange;
}

const EmployeeBudgetReport = ({ dateRange }: EmployeeBudgetReportProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  
  // Fetch both employees and assets
  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees,
    meta: {
      onError: () => {
        console.error('Failed to fetch employee data');
      }
    }
  });
  
  const { data: assets = [], isLoading: isLoadingAssets } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets,
    meta: {
      onError: () => {
        console.error('Failed to fetch asset data');
      }
    }
  });
  
  useEffect(() => {
    if (!isLoadingEmployees && !isLoadingAssets && employees.length > 0) {
      // Filter assets by date range if provided
      const filteredAssets = dateRange && (dateRange.from || dateRange.to)
        ? assets.filter(asset => {
            const purchaseDate = new Date(asset.purchaseDate);
            if (dateRange.from && dateRange.to) {
              return purchaseDate >= dateRange.from && purchaseDate <= dateRange.to;
            } else if (dateRange.from) {
              return purchaseDate >= dateRange.from;
            } else if (dateRange.to) {
              return purchaseDate <= dateRange.to;
            }
            return true;
          })
        : assets;
      
      // Calculate used budget based on filtered assets
      const employeesWithFilteredBudget = employees.map(employee => {
        const employeeAssets = filteredAssets.filter(asset => asset.employeeId === employee.id);
        const usedBudget = employeeAssets.reduce((sum, asset) => sum + asset.price, 0);
        
        return {
          ...employee,
          usedBudget: usedBudget
        };
      });
      
      // Filter employees by search query
      const filtered = employeesWithFilteredBudget.filter((employee: Employee) => {
        const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase()) || 
              employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
              employee.cluster.toLowerCase().includes(searchQuery.toLowerCase());
      });
      
      // Sort employees by last name
      const sorted = [...filtered].sort((a, b) => 
        a.lastName.localeCompare(b.lastName)
      );
      
      setFilteredEmployees(sorted);
    }
  }, [employees, assets, searchQuery, dateRange, isLoadingEmployees, isLoadingAssets]);

  // Calculate remaining budget for each employee
  const calculateRemainingBudget = (budget: number, usedBudget: number) => {
    return budget - usedBudget;
  };
  
  // Calculate budget percentage used
  const calculateBudgetPercentage = (budget: number, usedBudget: number) => {
    if (budget === 0) return 0;
    return Math.min(100, Math.round((usedBudget / budget) * 100));
  };

  if (isLoadingEmployees || isLoadingAssets) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Lade Mitarbeiterdaten...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Mitarbeiter suchen..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mitarbeiter</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Cluster</TableHead>
              <TableHead>Gesamtbudget</TableHead>
              <TableHead>Genutzt</TableHead>
              <TableHead>Verfügbar</TableHead>
              <TableHead>Nutzung</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => {
                const remainingBudget = calculateRemainingBudget(employee.budget, employee.usedBudget);
                const budgetPercentage = calculateBudgetPercentage(employee.budget, employee.usedBudget);
                
                return (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.firstName} {employee.lastName}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.cluster}</TableCell>
                    <TableCell>{formatCurrency(employee.budget)}</TableCell>
                    <TableCell>{formatCurrency(employee.usedBudget)}</TableCell>
                    <TableCell className={remainingBudget < 0 ? "text-destructive font-medium" : ""}>
                      {formatCurrency(remainingBudget)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${budgetPercentage >= 90 ? 'bg-destructive' : 'bg-primary'}`} 
                            style={{ width: `${budgetPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{budgetPercentage}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Keine Mitarbeiter gefunden
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-xs text-muted-foreground">
        Insgesamt {filteredEmployees.length} Mitarbeiter angezeigt
      </div>
    </div>
  );
};

export default EmployeeBudgetReport;
