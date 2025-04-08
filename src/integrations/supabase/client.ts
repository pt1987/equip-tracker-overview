
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tpqthwdwghwgqimxguki.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwcXRod2R3Z2h3Z3FpbXhndWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTEyODEsImV4cCI6MjA1ODM4NzI4MX0.VMnAJkmooVq_UWCAXVhZp04pbIWA2nDbFIgvG-wqRpo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
