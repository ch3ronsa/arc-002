import { createClient } from '@supabase/supabase-js';

// Hardcoded for immediate fix
const supabaseUrl = "https://xwantwmkoijatvxerxuo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3YW50d21rb2lqYXR2eGVyeHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MzQ3NDAsImV4cCI6MjA4MDExMDc0MH0.05Wj97TMgi-rOPTlqm1gDO1ML6J8xjqUh-UIZhcl31s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
