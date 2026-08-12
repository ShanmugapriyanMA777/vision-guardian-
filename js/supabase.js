// VisionAssist Guardian Portal - Supabase Client Setup
const SUPABASE_URL = "https://ryunlxxgmfwfnjcpovwg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5dW5seHhnbWZ3Zm5qY3BvdndnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMzc2NjAsImV4cCI6MjA5OTYxMzY2MH0.gfT7cgf67KBEP1zYlWzHgS14369fgbS46ipHpL4eyjE";

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
  return mode === 'true'; // Default to FALSE to connect to live Supabase backend
}

function setDemoMode(active) {
  localStorage.setItem('vg_demo_mode', active ? 'true' : 'false');
  window.location.reload();
}
