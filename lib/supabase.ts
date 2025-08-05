import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL\!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY\!;

if (\!supabaseUrl || \!supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
    },
  },
  db: {
    schema: 'scout',
  },
});

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

export default supabase;
EOF < /dev/null