// ==========================================
// SUPABASE INITIALIZATION (UPDATED)
// ==========================================

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
window.supabaseInitDiagnostics = { status: 'pending', message: null, detail: null };

function _createSupabaseClient() {
    try {
        // Check if the global UMD script is loaded
        if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
            _supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

            // Expose the created client under a stable name used across the app.
            // IMPORTANT: do NOT overwrite the library object at `window.supabase` —
            // some pages rely on the original library being present for diagnostics
            // or future createClient calls. Only bind the client instance to
            // `window.supabaseClient` (and keep getSupabase() as the canonical accessor).
            window.supabaseClient = _supabaseInstance;
            
            window.supabaseInitDiagnostics = {
                status: 'initialized',
                message: 'Supabase client created successfully',
                detail: { url: SUPABASE_URL }
            };
            console.log('✓ Supabase client instance created and bound globally.');
            return _supabaseInstance;
        }
        
        // If window.supabase was already replaced by an instance earlier
        if (_supabaseInstance) {
            return _supabaseInstance;
        }

        window.supabaseInitDiagnostics = {
            status: 'missing_library',
            message: 'Supabase CDN library not detected or createClient not available',
            detail: {
                supabaseType: typeof window.supabase,
                rawValue: window.supabase,
            }
        };
        return null;
    } catch (error) {
        window.supabaseInitDiagnostics = {
            status: 'init_failed',
            message: 'Supabase initialization threw an exception',
            detail: error
        };
        console.error('✗ Supabase initialization failed:', error);
        return null;
    }
}

// Attempt initialization immediately.
_createSupabaseClient();

// Global accessor used by all other JS files
window.getSupabase = () => {
    if (_supabaseInstance) return _supabaseInstance;
    return _createSupabaseClient();
};

window.waitForSupabase = async function (timeoutMs = 2000, intervalMs = 100) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        const client = window.getSupabase();
        if (client) return client;
        await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
    console.error('[Supabase] waitForSupabase timed out.', window.supabaseInitDiagnostics);
    return null;
};