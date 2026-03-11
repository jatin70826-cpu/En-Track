import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = `https://pxgepihdhvjetsylivmz.supabase.co`;
const SUPABASE_ANON_KEY = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4Z2VwaWhkaHZqZXRzeWxpdm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyOTE0MTAsImV4cCI6MjA4Nzg2NzQxMH0.Vtqe-97hZNwOaE-sBL-8P46fVo_-x6FtZqy7n6voVTU`;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type AuthUser = {
  id: string;
  email: string;
  user_metadata?: { full_name?: string; role?: string };
};
