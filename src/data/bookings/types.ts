
import { Json } from "@/integrations/supabase/types";

// Define the raw booking type from the database
export type RawBooking = {
  id: string;
  asset_id: string;
  employee_id: string | null;
  start_date: string;
  end_date: string;
  purpose: string | null;
  status: string;
  created_at: string;
  return_info: Json | null;
};
