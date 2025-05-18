
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface EmployeeLicense {
  id: string;
  name: string;
  licenseType: string;
  assignmentDate: string;
  expiryDate: string | null;
  notes: string | null;
}

export function useLicenseData(employeeId: string | null) {
  const [licenses, setLicenses] = useState<EmployeeLicense[]>([]);
  const [isLoadingLicenses, setIsLoadingLicenses] = useState(false);

  useEffect(() => {
    const fetchLicenses = async () => {
      if (employeeId) {
        setIsLoadingLicenses(true);
        try {
          // Query all licenses assigned to this employee
          const { data, error } = await supabase
            .from('license_assignments')
            .select(`
              id,
              assigned_at,
              notes,
              software_licenses(
                id,
                name,
                license_type,
                expiry_date
              )
            `)
            .eq('employee_id', employeeId);

          if (error) {
            throw error;
          }

          // Map the data to our interface format
          const formattedLicenses = data.map((item) => ({
            id: item.id,
            name: item.software_licenses?.name || 'Unknown License',
            licenseType: item.software_licenses?.license_type || 'Unknown Type',
            assignmentDate: item.assigned_at || '',
            expiryDate: item.software_licenses?.expiry_date || null,
            notes: item.notes
          }));

          setLicenses(formattedLicenses);
        } catch (error) {
          console.error("Error fetching license data:", error);
        } finally {
          setIsLoadingLicenses(false);
        }
      }
    };

    fetchLicenses();
  }, [employeeId]);

  return { licenses, isLoadingLicenses };
}
