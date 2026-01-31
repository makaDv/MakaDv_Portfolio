// Supabase client shim - DB integration removed.
// This provides a minimal, chainable, no-op API that matches the parts
// of the supabase client used in the app. It prevents runtime throws while
// keeping call-sites working during development.

type FromQuery = {
  select: (cols?: string) => Promise<{ data: any[] | null; error: null }>; 
  order: (column: string, opts?: { ascending?: boolean }) => FromQuery;
};

type SupabaseShim = {
  from: (table: string) => FromQuery;
  auth: {
    signInWithPassword: (opts: any) => Promise<{ data: null; error: null }>;
    signUp: (opts: any) => Promise<{ data: null; error: null }>;
    signOut: () => Promise<{ error: null }>; 
    getSession: () => Promise<{ data: null; error: null }>;
  };
};

const makeFrom = (_table: string): FromQuery => {
  return {
    select: async (_cols?: string) => ({ data: [], error: null }),
    order: (_column: string, _opts?: { ascending?: boolean }) => makeFrom(_table),
  };
};

export const supabase: SupabaseShim = {
  from: (table: string) => makeFrom(table),
  auth: {
    signInWithPassword: async () => ({ data: null, error: null }),
    signUp: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: null, error: null }),
  },
};