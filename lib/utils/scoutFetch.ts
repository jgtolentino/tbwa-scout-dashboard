import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Unified fetch wrapper for Scout v5 Edge Functions with JWT authentication
 * @param fn - Edge function name
 * @param payload - Request payload
 * @returns Promise with response data
 */
export async function scoutFetch(fn: string, payload?: any) {
  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
    }

    // Build the URL
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, '');
    const url = `${baseUrl}/functions/v1/${fn}`;

    // Make the request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'x-client-info': 'scout-v5'
      },
      body: JSON.stringify(payload || {})
    });

    // Handle errors
    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        message: `HTTP ${response.status}: ${response.statusText}` 
      }));
      throw new Error(error.message || error.error || 'API request failed');
    }

    // Return parsed response
    return await response.json();
  } catch (error) {
    console.error(`Scout fetch error for ${fn}:`, error);
    throw error;
  }
}

/**
 * Helper to check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

/**
 * Helper to get current user
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}