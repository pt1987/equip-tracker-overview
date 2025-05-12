
import { useState, useEffect } from "react";
import { AssetHistoryEntry } from "@/lib/types";
import { getUserNameFromId } from "@/data/assets/history";
import { getEmployeeById } from "@/data/employees/fetch";

export const useTimelineData = (history: AssetHistoryEntry[]) => {
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [employeeNames, setEmployeeNames] = useState<Record<string, string>>({});
  const [sortedHistory, setSortedHistory] = useState<AssetHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sort history by date (newest first)
  useEffect(() => {
    if (history) {
      const sorted = [...history].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setSortedHistory(sorted);
    }
  }, [history]);
  
  // Fetch user names on component mount and whenever history changes
  useEffect(() => {
    const fetchUserNames = async () => {
      if (sortedHistory.length === 0) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const userIds = [...new Set(sortedHistory
          .filter(entry => entry.userId)
          .map(entry => entry.userId as string))];
        
        const namesMap: Record<string, string> = {};
        
        for (const userId of userIds) {
          try {
            const name = await getUserNameFromId(userId);
            namesMap[userId] = name;
          } catch (error) {
            console.error(`Error fetching name for user ${userId}:`, error);
            namesMap[userId] = "Unbekannt";
          }
        }
        
        setUserNames(namesMap);
      } catch (error) {
        console.error("Error fetching user names:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserNames();
  }, [sortedHistory]);

  // Fetch employee names on component mount and whenever history changes
  useEffect(() => {
    const fetchEmployeeNames = async () => {
      if (sortedHistory.length === 0) return;
      
      try {
        const employeeIds = [...new Set(sortedHistory
          .filter(entry => entry.employeeId)
          .map(entry => entry.employeeId as string))];
        
        const namesMap: Record<string, string> = {};
        
        for (const employeeId of employeeIds) {
          try {
            const employee = await getEmployeeById(employeeId);
            if (employee) {
              namesMap[employeeId] = `${employee.firstName} ${employee.lastName}`;
            } else {
              namesMap[employeeId] = "Unbekannt";
            }
          } catch (error) {
            console.error(`Error fetching employee ${employeeId}:`, error);
            namesMap[employeeId] = "Unbekannt";
          }
        }
        
        setEmployeeNames(namesMap);
      } catch (error) {
        console.error("Error fetching employee names:", error);
      }
    };
    
    fetchEmployeeNames();
  }, [sortedHistory]);

  return {
    userNames,
    employeeNames,
    sortedHistory,
    isLoading
  };
};
