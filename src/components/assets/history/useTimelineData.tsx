
import { useState, useEffect } from "react";
import { AssetHistoryEntry } from "@/lib/types";
import { getUserNameFromId } from "@/data/assets/history";
import { getEmployeeById } from "@/data/employees/fetch";

export const useTimelineData = (history: AssetHistoryEntry[]) => {
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [employeeNames, setEmployeeNames] = useState<Record<string, string>>({});
  const [sortedHistory, setSortedHistory] = useState<AssetHistoryEntry[]>([]);

  // Sort history by date (newest first)
  useEffect(() => {
    const sorted = [...history].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setSortedHistory(sorted);
  }, [history]);
  
  // Fetch user names on component mount and whenever history changes
  useEffect(() => {
    const fetchUserNames = async () => {
      const userIds = [...new Set(sortedHistory.map(entry => entry.userId).filter(Boolean))];
      const namesMap: Record<string, string> = {};
      
      for (const userId of userIds) {
        if (userId) {
          const name = await getUserNameFromId(userId);
          namesMap[userId] = name;
        }
      }
      
      setUserNames(namesMap);
    };
    
    fetchUserNames();
  }, [sortedHistory]);

  // Fetch employee names on component mount and whenever history changes
  useEffect(() => {
    const fetchEmployeeNames = async () => {
      const employeeIds = [...new Set(sortedHistory.map(entry => entry.employeeId).filter(Boolean))];
      const namesMap: Record<string, string> = {};
      
      for (const employeeId of employeeIds) {
        if (employeeId) {
          const employee = await getEmployeeById(employeeId);
          if (employee) {
            namesMap[employeeId] = `${employee.firstName} ${employee.lastName}`;
          }
        }
      }
      
      setEmployeeNames(namesMap);
    };
    
    fetchEmployeeNames();
  }, [sortedHistory]);

  return {
    userNames,
    employeeNames,
    sortedHistory,
  };
};
