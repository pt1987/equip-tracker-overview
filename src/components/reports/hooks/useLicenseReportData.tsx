
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SoftwareLicense {
  id: string;
  name: string;
  license_type: string;
  expiry_date: string | null;
  total_licenses: number;
  assigned_count: number;
  cost_per_license: number;
  status: string;
  created_at?: string;
}

interface EnhancedLicense extends SoftwareLicense {
  totalCost: number;
  complianceStatus: string;
}

interface LicenseStats {
  totalCost: number;
  totalLicenses: number;
  assignedLicenses: number;
  utilizationRate: number;
}

interface ComplianceData {
  name: string;
  value: number;
  color: string;
}

export const useLicenseReportData = () => {
  // Use the same query key as LicenseManagementTable to share the cache
  const { data, isLoading, isError } = useQuery({
    queryKey: ['softwareLicenses'],
    queryFn: async () => {
      console.log("Report: Fetching software license data");
      
      const { data: licenses, error } = await supabase
        .from('software_licenses')
        .select('*')
        .order('name');
        
      if (error) {
        console.error("Error fetching software license data:", error);
        throw error;
      }
      
      console.log("Report: Fetched license data:", licenses);
      
      if (!licenses || licenses.length === 0) {
        console.log("Report: No license data returned");
        return [];
      }
      
      return licenses.map((license: SoftwareLicense): EnhancedLicense => {
        const totalCost = license.cost_per_license * license.total_licenses;
        
        let complianceStatus = license.status;
        if (!complianceStatus) {
          if (license.assigned_count > license.total_licenses) {
            complianceStatus = "overused";
          } else if (license.assigned_count < license.total_licenses * 0.8) {
            complianceStatus = "underused";
          } else {
            complianceStatus = "compliant";
          }
        }
        
        return {
          ...license,
          totalCost,
          complianceStatus
        };
      });
    },
    refetchOnWindowFocus: true,
    staleTime: 0, // Always fetch fresh data
  });

  // Calculate statistics
  const stats = React.useMemo((): LicenseStats => {
    if (!data || data.length === 0) return { totalCost: 0, totalLicenses: 0, assignedLicenses: 0, utilizationRate: 0 };
    
    const totalCost = data.reduce((sum, item) => sum + (item.cost_per_license * item.total_licenses), 0);
    const totalLicenses = data.reduce((sum, item) => sum + item.total_licenses, 0);
    const assignedLicenses = data.reduce((sum, item) => sum + item.assigned_count, 0);
    const utilizationRate = totalLicenses > 0 ? (assignedLicenses / totalLicenses) * 100 : 0;
    
    return { totalCost, totalLicenses, assignedLicenses, utilizationRate };
  }, [data]);

  const complianceData = React.useMemo((): ComplianceData[] => {
    if (!data || data.length === 0) return [];
    
    const counts = {
      compliant: 0,
      overused: 0,
      underused: 0
    };
    
    data.forEach(item => {
      if (item.complianceStatus === "compliant") counts.compliant++;
      else if (item.complianceStatus === "overused") counts.overused++;
      else if (item.complianceStatus === "underused") counts.underused++;
    });
    
    return [
      { name: "Konform", value: counts.compliant, color: "#10B981" },
      { name: "Übernutzung", value: counts.overused, color: "#EF4444" },
      { name: "Unternutzung", value: counts.underused, color: "#F59E0B" }
    ];
  }, [data]);

  return {
    data,
    isLoading,
    isError,
    stats,
    complianceData
  };
};
