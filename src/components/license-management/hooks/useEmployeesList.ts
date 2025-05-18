
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useEmployeesList = () => {
  const { data: employees, isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('id, first_name, last_name, position')
        .order('last_name');
      
      if (error) throw error;
      return data || [];
    }
  });

  return {
    employees,
    isLoading,
    error
  };
};
