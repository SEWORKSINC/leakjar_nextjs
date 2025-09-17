import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Legacy interface kept for compatibility
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// Helper function to get current user from Supabase
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

// Helper function to verify user session
export async function verifySession(token?: string) {
  if (token) {
    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user;
  }
  
  // Get current session
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return null;
  return session.user;
}

// Helper function to sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return !error;
}

// Legacy functions for compatibility (will redirect to Supabase)
export async function hashPassword(password: string): Promise<string> {
  // Not needed with Supabase - it handles password hashing
  return password;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // Not needed with Supabase - it handles password verification
  return true;
}

export function generateToken(payload: JWTPayload): string {
  // Not needed with Supabase - it handles token generation
  console.warn('generateToken is deprecated - Supabase handles token generation');
  return '';
}

export function verifyToken(token: string): JWTPayload {
  // Not needed with Supabase - use verifySession instead
  console.warn('verifyToken is deprecated - use verifySession instead');
  return { userId: '', email: '', role: '' };
}

export async function createSession(userId: string, token: string) {
  // Not needed with Supabase - it handles session management
  console.warn('createSession is deprecated - Supabase handles session management');
  return null;
}

export async function validateSession(token: string) {
  // Redirect to Supabase verification
  const user = await verifySession(token);
  if (!user) return null;
  
  return {
    user: {
      id: user.id,
      email: user.email || '',
      role: user.role || 'USER',
    },
    token,
    userId: user.id,
  };
}