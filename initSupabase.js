// ==========================================
// SUPABASE INITIALIZATION
// ==========================================
// Centralized Supabase configuration and initialization
// This file initializes the Supabase client globally
// Other files should import/use supabaseClient.js for all API calls

// Supabase credentials (ensure these are in your environment or config)
const SUPABASE_URL = 'https://xgtnbxdxbbywvzrttixf.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhndG5ieGR4YmJ5d3Z6cnR0aXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0Nzg5NTAsImV4cCI6MjA3MjA1NDk1MH0.YGk0vFyIJEiSpu5phzV04Mh4lrHBlfYLFtPP_afFtMQ'; // Replace with your Supabase anon key

// 2. Use a private variable to store the instance to avoid overwriting the library
let _supabaseInstance = null;

try {
    // Check if the CDN library is loaded
    if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
        _supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✓ Supabase client instance created successfully');
    } else {
        console.error('✗ Supabase library (CDN) not detected. Check your <script> tags.');
    }
} catch (error) {
    console.error('✗ Supabase initialization failed:', error);
}

// 3. The accessor function used by auth.js
if (typeof window.getSupabase !== 'function') {
    window.getSupabase = () => {
        if (!_supabaseInstance) {
            console.error('Supabase client is not initialized. check initSupabase.js');
            return null;
        }
        return _supabaseInstance;
    };
}