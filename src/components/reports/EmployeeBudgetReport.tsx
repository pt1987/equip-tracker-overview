
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEmployees } from '@/data/employees';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { Employee } from '@/lib/types';
import { Search } from 'lucide-react';

const EmployeeBudgetReport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees,
    meta: {
      onError: () => {
        console.error('Failed to fetch employee data');
      }
    }
  });
  
  // Filter employees by search query
  const filteredEmployees = employees.filter((employee: Employee) => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
           employee.cluster.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Sort employees by last name
  const sortedEmployees = [...filteredEmployees].sort((a, b) => 
    a.lastName.localeCompare(b.lastName)
  );

  // Calculate remaining budget for each employee
  const calculateRemainingBudget = (budget: number, usedBudget: number) => {
    return budget - usedBudget;
  };
  
  // Calculate budget percentage used
  const calculateBudgetPercentage = (budget: number, usedBudget: number) => {
    if (budget === 0) return 0;
    return Math.min(100, Math.round((usedBudget / budget) * 100));
  };

  if (isLoading) {
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
            {sortedEmployees.length > 0 ? (
              sortedEmployees.map((employee) => {
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
        Insgesamt {sortedEmployees.length} Mitarbeiter angezeigt
      </div>
    </div>
  );
};

export default EmployeeBudgetReport;
