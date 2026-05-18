// ==========================================
// AUTHENTICATION MODULE
// ==========================================

/**
 * Helper to ensure the Supabase client is available before making calls.
 */
const getAuthClient = () => {
    // Looks for the client initialized in initSupabase.js
    const client = window.supabaseClient || (window.getSupabase ? window.getSupabase() : null);
    
    if (!client) {
        throw new Error('Supabase client not initialized. Ensure initSupabase.js is loaded correctly.');
    }
    return client;
};

const authManager = {
    signUpWithPassword: async (email, password) => {
        try {
            const { data, error } = await getAuthClient().auth.signUp({ email, password });
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error };
        }
    },

    signInWithPassword: async (email, password) => {
        try {
            const { data, error } = await getAuthClient().auth.signInWithPassword({ email, password });
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error };
        }
    },

    signInWithOtp: async (email) => {
        try {
            const { data, error } = await getAuthClient().auth.signInWithOtp({ email });
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('OTP sign in error:', error);
            return { success: false, error };
        }
    },

    verifyOtp: async (email, token, type = 'email') => {
        try {
            const { data, error } = await getAuthClient().auth.verifyOtp({ email, token, type });
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('OTP verification error:', error);
            return { success: false, error };
        }
    },

    // Renamed from updateBusinessUrl to updateBusinessProfile to match getstarted.js
    updateBusinessProfile: async (websiteUrl) => {
        try {
            const { data, error } = await getAuthClient().auth.updateUser({
                data: { business_website: websiteUrl }
            });
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Update Profile error:', error);
            return { success: false, error };
        }
    },

    signOut: async () => {
        try {
            const { error } = await getAuthClient().auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error };
        }
    },

    getSession: async () => {
        try {
            const { data, error } = await getAuthClient().auth.getSession();
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Get session error:', error);
            return { success: false, error };
        }
    },

    getUser: async () => {
        try {
            const { data, error } = await getAuthClient().auth.getUser();
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Get user error:', error);
            return { success: false, error };
        }
    },

    savePasswordToBackend: async (email, password) => {
        try {
            const client = getAuthClient();
            
            // Get current user
            const { data: userData, error: userError } = await client.auth.getUser();
            if (userError) throw userError;
            
            const userId = userData.user.id;
            
            // Update user metadata to mark password as confirmed
            const { error: updateError } = await client.auth.updateUser({
                data: { password_confirmed: true, password_set_at: new Date().toISOString() }
            });
            
            if (updateError) throw updateError;
            
            // Also save to user_credentials table for backup validation
            const { data: credResult, error: credError } = await client
                .from('user_credentials')
                .upsert(
                    {
                        user_id: userId,
                        email: email,
                        password_confirmed: true,
                        password_set_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    },
                    { onConflict: 'user_id' }
                )
                .select();
            
            // If user_credentials table doesn't exist, just continue with metadata update
            if (credError && credError.code !== 'PGRST116') {
                console.warn('Could not save to user_credentials table:', credError);
            }
            
            console.log('Password confirmed and saved successfully');
            return { success: true, data: { userId, passwordConfirmed: true } };
        } catch (error) {
            console.error('Save password error:', error);
            return { success: false, error };
        }
    }
};

// --- CRITICAL CHANGES FOR MULTI-FILE STRUCTURE ---

// 1. Attach to window so login.js and getstarted.js can access it
window.authManager = authManager;

// 2. Keep CommonJS export for testing/node environments if necessary
if (typeof module !== 'undefined' && module.exports) {
    module.exports = authManager;
}

console.log("Auth module loaded and globally accessible.");