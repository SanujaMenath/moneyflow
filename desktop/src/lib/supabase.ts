import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xyftktybsflvbwnppobl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5ZnRrdHlic2ZsdmJ3bnBwb2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1ODk5NTIsImV4cCI6MjA5MTE2NTk1Mn0.dI-28qa9cjaEm7PeQ7t8Ag-qCqWxAjmrQUVnXs9p9cE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);