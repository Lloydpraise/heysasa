// ==========================================
// SUPABASE INITIALIZATION
// ==========================================

// Helper to ensure URL is valid for the SDK by prepending https:// if missing
const formatSupabaseUrl = (url) => {
    url = url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url}`;
    }
    return url;
};

const RAW_URL = 'xgtnbxdxbbywvzrttixf.supabase.co'; 
const SUPABASE_URL = formatSupabaseUrl(RAW_URL);
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhndG5ieGR4YmJ5d3Z6cnR0aXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0Nzg5NTAsImV4cCI6MjA3MjA1NDk1MH0.YGk0vFyIJEiSpu5phzV04Mh4lrHBlfYLFtPP_afFtMQ';

let _supabaseInstance = null;

try {
    // We use the global 'supabase' object provided by the CDN to create the client
    if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
        _supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✓ Supabase client instance created successfully');
    } else {
        console.error('✗ Supabase library (CDN) not detected.');
    }
} catch (error) {
    console.error('✗ Supabase initialization failed:', error);
}

// Global accessor used by all other JS files
window.getSupabase = () => {
    if (!_supabaseInstance) {
        console.error('Supabase client is not initialized.');
        return null;
    }
    return _supabaseInstance;
};