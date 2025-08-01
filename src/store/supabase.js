import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = "https://ogaktuqoqomifmucsyqy.supabase.co";
const SUPABASE_KEY =
  " eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nYWt0dXFvcW9taWZtdWNzeXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTU3NTQsImV4cCI6MjA2ODQzMTc1NH0.mbaVusnCj8CRrxp__wrkAjH59KivytxTtiZKiNd8Xic";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
