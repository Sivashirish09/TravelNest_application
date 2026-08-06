import { createClient } from '@supabase/supabase-js';

// Default Supabase project credentials
const DEFAULT_SUPABASE_URL = 'https://ofoczmowxnqzyareicut.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mb2N6bW93eG5xenlhcmVpY3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5ODI0MzAsImV4cCI6MjEwMTU1ODQzMH0.z5GZVvbQUEpwDf2TW5_Nxpb7FKH9mj3EVWSGJaZT7dk';

/**
 * Retrieves the active Supabase URL and Anon Key
 * Supports runtime overrides saved in localStorage
 */
export const getActiveSupabaseConfig = () => {
  let custom = null;
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('travelnest_custom_supabase_config');
      if (saved) custom = JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading custom Supabase config:', e);
    }
  }

  const url = (custom?.url || import.meta.env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
  const anonKey = (custom?.anonKey || import.meta.env?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY).trim();

  return { url, anonKey, isCustom: Boolean(custom?.url) };
};

export const activeConfig = getActiveSupabaseConfig();

/**
 * Create and export the Supabase client instance
 */
export const supabase = createClient(activeConfig.url, activeConfig.anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'travelnest_supabase_auth',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  global: {
    headers: {
      'x-application-name': 'TravelNest-AI-Trip-Planner',
    },
  },
});

/**
 * Save custom Supabase configuration to localStorage
 */
export const saveCustomSupabaseConfig = (url, anonKey) => {
  if (!url || !anonKey) return false;
  try {
    localStorage.setItem('travelnest_custom_supabase_config', JSON.stringify({
      url: url.trim(),
      anonKey: anonKey.trim(),
      updatedAt: new Date().toISOString()
    }));
    return true;
  } catch (e) {
    console.error('Failed to save Supabase config:', e);
    return false;
  }
};

/**
 * Reset Supabase configuration back to default
 */
export const resetSupabaseConfig = () => {
  try {
    localStorage.removeItem('travelnest_custom_supabase_config');
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Perform a live health check on the active Supabase connection
 * Returns latency, status, auth capability, and database connectivity
 */
export const checkSupabaseHealth = async () => {
  const startTime = Date.now();
  const currentConfig = getActiveSupabaseConfig();

  try {
    // 1. Ping Auth endpoint
    const { data: sessionData, error: authError } = await supabase.auth.getSession();
    const latency = Date.now() - startTime;

    // 2. Check Database connectivity
    let dbStatus = 'untested';
    let dbDetails = '';
    try {
      const { data, error } = await supabase.from('profiles').select('id').limit(1);
      if (!error) {
        dbStatus = 'ready';
        dbDetails = `Connected (profiles table active)`;
      } else if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        dbStatus = 'tables_pending';
        dbDetails = `Connected to Postgres instance (run supabase-schema.sql to create tables)`;
      } else {
        dbStatus = 'connected';
        dbDetails = error.message;
      }
    } catch (e) {
      dbStatus = 'auth_only';
      dbDetails = e.message;
    }

    return {
      connected: true,
      url: currentConfig.url,
      latency: `${latency}ms`,
      authReady: !authError,
      dbStatus,
      dbDetails,
      sessionActive: Boolean(sessionData?.session),
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    return {
      connected: false,
      url: currentConfig.url,
      latency: `-${Date.now() - startTime}ms`,
      authReady: false,
      dbStatus: 'error',
      error: err.message || 'Connection failed',
      timestamp: new Date().toISOString()
    };
  }
};

export default supabase;
