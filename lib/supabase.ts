import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL

// SSR을 사용한 브라우저 클라이언트
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    redirectTo: siteUrl || 'http://localhost:3000'
  }
})

// Database types (will be updated based on your schema)
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  timezone: string;
  language: string;
  notify_email: boolean;
  notify_breach: boolean;
  notify_product: boolean;
  two_factor_enabled: boolean;
  dark_mode: boolean;
  created_at: string;
  updated_at: string;
}

export interface Domain {
  id: string;
  user_id: string;
  domain: string;
  monitoring_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_hash: string;
  last_used?: string;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}