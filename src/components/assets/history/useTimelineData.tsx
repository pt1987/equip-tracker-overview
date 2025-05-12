
import { useState, useEffect } from "react";
import { AssetHistoryEntry } from "@/lib/types";
import { getUserNameFromId, getEmployeeNameFromId } from "@/data/assets/history";

export const useTimelineData = (history: AssetHistoryEntry[]) => {
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [employeeNames, setEmployeeNames] = useState<Record<string, string>>({});
  const [sortedHistory, setSortedHistory] = useState<AssetHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sort history by date (newest first)
  useEffect(() => {
    if (history && history.length > 0) {
      console.log("Sorting history entries:", history.length);
      const sorted = [...history].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setSortedHistory(sorted);
    } else {
      setSortedHistory([]);
      setIsLoading(false);
    }
  }, [history]);
  
  // Fetch user names whenever sorted history changes
  useEffect(() => {
    const fetchUserNames = async () => {
      if (sortedHistory.length === 0) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        console.log("Fetching user names for history entries");
        
        const userIds = [...new Set(sortedHistory
          .filter(entry => entry.userId)
          .map(entry => entry.userId as string))];
        
        console.log("Unique user IDs found:", userIds);
        const namesMap: Record<string, string> = {};
        
        for (const userId of userIds) {
          try {
            const name = await getUserNameFromId(userId);
            namesMap[userId] = name;
            console.log(`Fetched name for user ${userId}: ${name}`);
          } catch (error) {
            console.error(`Error fetching name for user ${userId}:`, error);
            namesMap[userId] = "Unbekannt";
          }
        }
        
        setUserNames(namesMap);
      } catch (error) {
        console.error("Error fetching user names:", error);
      } finally {
        // Don't finish loading until we've also fetched employee names
        if (Object.keys(employeeNames).length > 0 || sortedHistory.filter(entry => entry.employeeId).length === 0) {
          setIsLoading(false);
        }
      }
    };
    
    fetchUserNames();
  }, [sortedHistory]);

  // Fetch employee names whenever sorted history changes
  useEffect(() => {
    const fetchEmployeeNames = async () => {
      if (sortedHistory.length === 0) {
        setIsLoading(false);
        return;
      }
      
      try {
        console.log("Fetching employee names for history entries");
        
        const employeeIds = [...new Set(sortedHistory
          .filter(entry => entry.employeeId)
          .map(entry => entry.employeeId as string))];
        
        console.log("Unique employee IDs found:", employeeIds);
        
        if (employeeIds.length === 0) {
          // If no employee IDs, we're done
          setIsLoading(false);
          return;
        }
        
        const namesMap: Record<string, string> = {};
        
        for (const employeeId of employeeIds) {
          try {
            const name = await getEmployeeNameFromId(employeeId);
            namesMap[employeeId] = name;
            console.log(`Fetched name for employee ${employeeId}: ${name}`);
          } catch (error) {
            console.error(`Error fetching employee ${employeeId}:`, error);
            namesMap[employeeId] = "Unbekannt";
          }
        }
        
        setEmployeeNames(namesMap);
        
        // Only finish loading once we've fetched user names too
        if (Object.keys(userNames).length > 0 || sortedHistory.filter(entry => entry.userId).length === 0) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching employee names:", error);
        setIsLoading(false);
      }
    };
    
    fetchEmployeeNames();
  }, [sortedHistory, userNames]);

  return {
    userNames,
    employeeNames,
    sortedHistory,
    isLoading
  };
};
