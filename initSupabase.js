// ==========================================
// SUPABASE INITIALIZATION
// ==========================================
// Centralized Supabase configuration and initialization
// This file should be loaded in all HTML pages before any other scripts that use Supabase

const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other modules (if using ES6 modules)
// export default supabase;