import { createBrowserClient } from '@supabase/ssr'

// Create a Supabase client for client-side operations
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: { 
      headers: { 
        'x-application-name': 'scout-dashboard' 
      } 
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
)

// Helper function to call Edge Functions with proper auth and CORS handling
export async function callEdgeFunction<T = any>(
  functionName: string,
  body?: Record<string, unknown>,
  options?: { headers?: Record<string, string> }
): Promise<T> {
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession()
    
    // Call the Edge Function using Supabase's invoke method
    const { data, error } = await supabase.functions.invoke<T>(functionName, {
      body: body || {},
      headers: {
        Authorization: `Bearer ${session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        ...options?.headers
      }
    })

    if (error) {
      console.error(`Edge Function ${functionName} error:`, error)
      throw error
    }

    return data as T
  } catch (error) {
    console.error(`Failed to call Edge Function ${functionName}:`, error)
    throw error
  }
}

// Helper function to get auth headers
export async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession()
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  }
}

// Helper function to call RPC functions
export async function callRPC<T = any>(
  functionName: string, 
  params?: Record<string, any>
): Promise<T> {
  console.log(`Calling RPC: ${functionName}`, params);
  
  const { data, error } = await supabase.rpc(functionName, params);
  
  if (error) {
    console.error(`RPC Error (${functionName}):`, error);
    throw new Error(`Failed to call ${functionName}: ${error.message}`);
  }
  
  console.log(`RPC Success (${functionName}):`, data);
  return data;
}