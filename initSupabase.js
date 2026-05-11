// ==========================================
// SUPABASE INITIALIZATION
// ==========================================
// Centralized Supabase configuration and initialization
// This file initializes the Supabase client globally
// Other files should import/use supabaseClient.js for all API calls

// Supabase credentials (ensure these are in your environment or config)
const SUPABASE_URL = 'https://your-project.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'your-anon-key'; // Replace with your Supabase anon key

// Initialize Supabase client globally
if (typeof window.supabase === 'undefined') {
    try {
        window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✓ Supabase initialized successfully');
    } catch (error) {
        console.error('✗ Supabase initialization failed:', error);
    }
}

// Safe accessor function
if (typeof window.getSupabase !== 'function') {
    window.getSupabase = () => {
        if (!window.supabase) {
            console.error('Supabase client is not initialized');
            return null;
        }
        return window.supabase;
    };
}