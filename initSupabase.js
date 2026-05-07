// ==========================================
// SUPABASE INITIALIZATION
// ==========================================
// Centralized Supabase configuration and initialization
// This file provides a global getter function to access the Supabase client
// The actual initialization happens in each HTML file to avoid conflicts

// Safe accessor for Supabase client (initialized in individual HTML files)
if (typeof window.getSupabase !== 'function') {
    window.getSupabase = () => window.supabase;
}