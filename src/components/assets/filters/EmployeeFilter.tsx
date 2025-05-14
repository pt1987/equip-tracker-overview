
import { UserRound } from "lucide-react";
import FilterSection from "./FilterSection";
import FilterOption from "./FilterOption";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
}

interface EmployeeFilterProps {
  selectedEmployees: string[];
  setSelectedEmployees: (employees: string[]) => void;
  employees: Employee[];
}

const EmployeeFilter = ({
  selectedEmployees,
  setSelectedEmployees,
  employees
}: EmployeeFilterProps) => {
  const toggleEmployeeFilter = (employeeId: string) => {
    if (selectedEmployees.includes(employeeId)) {
      setSelectedEmployees(selectedEmployees.filter(e => e !== employeeId));
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    }
  };

  return (
    <FilterSection title="Zugewiesener Mitarbeiter" maxHeight>
      {employees.map(employee => (
        <FilterOption
          key={employee.id}
          icon={<UserRound size={14} />}
          label={`${employee.firstName} ${employee.lastName}`}
          isSelected={selectedEmployees.includes(employee.id)}
          onClick={() => toggleEmployeeFilter(employee.id)}
        />
      ))}
    </FilterSection>
  );
};

export default EmployeeFilter;
