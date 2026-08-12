// VisionAssist Guardian Portal - Supabase Client Setup
const SUPABASE_URL = "https://your-supabase-url.supabase.co"; // Will load from window or localStorage if available
const SUPABASE_ANON_KEY = "your-anon-key";

// Initialize Supabase Client if script is loaded via CDN
let supabaseClient = null;

function getSupabase() {
  if (supabaseClient) return supabaseClient;
  
  const savedUrl = localStorage.getItem('vg_supabase_url') || SUPABASE_URL;
  const savedKey = localStorage.getItem('vg_supabase_key') || SUPABASE_ANON_KEY;

  if (window.supabase && typeof window.supabase.createClient === 'function') {
    supabaseClient = window.supabase.createClient(savedUrl, savedKey);
    return supabaseClient;
  }
  
  console.warn("Supabase library not loaded on window.");
  return null;
}

// Utility helper to check demo mode status
function isDemoMode() {
  const mode = localStorage.getItem('vg_demo_mode');
  return mode === null ? true : mode === 'true'; // Default to Demo Mode for seamless presentation
}

function setDemoMode(active) {
  localStorage.setItem('vg_demo_mode', active ? 'true' : 'false');
  window.location.reload();
}
