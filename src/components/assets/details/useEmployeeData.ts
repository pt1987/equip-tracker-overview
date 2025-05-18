
import { useState, useEffect } from "react";
import { Asset, Employee } from "@/lib/types";
import { getEmployeeById } from "@/data/employees";

export function useEmployeeData(asset: Asset) {
  const [employeeData, setEmployeeData] = useState<Employee | null>(null);
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (asset.employeeId) {
        setIsLoadingEmployee(true);
        try {
          const employee = await getEmployeeById(asset.employeeId);
          setEmployeeData(employee);
        } catch (error) {
          console.error("Error fetching employee data:", error);
        } finally {
          setIsLoadingEmployee(false);
        }
      }
    };

    fetchEmployee();
  }, [asset.employeeId]);

  return { employeeData, isLoadingEmployee };
}
