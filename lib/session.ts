import { getSupabaseClient } from './supabase-client';

export async function getSession() {
  const supabase = getSupabaseClient();

  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
      console.error('Session error details:', JSON.stringify(error));
      return null;
    }

    if (!session) {
      console.log('No session found in getSession');
      return null;
    }

    // Check if session is valid and not expired
    if (session && session.expires_at) {
      const expiresAt = new Date(session.expires_at * 1000);
      const now = new Date();

      if (expiresAt <= now) {
        console.log('Session expired, refreshing...');
        const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
        return refreshedSession;
      }
    }

    console.log('Session found, user:', session.user?.email);
    return session;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    throw new Error('Auth session missing!');
  }

  return session;
}

export async function refreshSession() {
  const supabase = getSupabaseClient();

  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();

    if (error) {
      // AuthSessionMissingError는 로그인하지 않은 정상 상황
      if (error.message !== 'Auth session missing!') {
        console.error('Error refreshing session:', error);
      }
      return null;
    }

    return session;
  } catch (error: any) {
    // AuthSessionMissingError는 로그인하지 않은 정상 상황
    if (error?.message !== 'Auth session missing!') {
      console.error('Refresh error:', error);
    }
    return null;
  }
}