import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for your Supabase tables
export type Project = {
  id: number;
  title: string;
  description: string;
  short_description: string;
  image?: string;
  category: string;
  status: 'active' | 'planning' | 'completed';
  featured: boolean;
  progress?: number;
  location?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  raised?: number;
  coordinator?: string;
  team_members?: string[];
  goals?: string[];
  updates?: ProjectUpdate[];
  created_at?: string;
  updated_at?: string;
};

export type ProjectUpdate = {
  id: number;
  date: string;
  title: string;
  content: string;
};

export type Volunteer = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  skills?: string[];
  availability?: string;
  experience?: string;
  location?: string;
  project_interest?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
};
