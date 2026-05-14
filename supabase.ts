import { createClient } from '@supabase/supabase-js';

// Using provided Supabase credentials
const supabaseUrl = 'https://bjylzveziwmocmlfyfgm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqeWx6dmV6aXdtb2NtbGZ5ZmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzQ4ODMsImV4cCI6MjA4NjExMDg4M30.mypjBbFHOMHmVE8_HFdzvxELQsDmj94oUOAIo1yD1Cs';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
