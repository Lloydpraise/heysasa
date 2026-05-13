// ==========================================
// AUTHENTICATION MODULE
// ==========================================
// All Supabase authentication logic
// Centralized auth functions for easy access

// Get the initialized Supabase client
const getAuthClient = () => {
    const client = window.getSupabase();
    if (!client) {
        throw new Error('Supabase client not initialized. Ensure initSupabase.js is loaded.');
    }
    return client;
};

const authManager = {
    
    // SIGN UP WITH EMAIL & PASSWORD
    // Creates a new user account with email and password
    signUpWithPassword: async (email, password) => {
        try {
            const { data, error } = await getAuthClient().auth.signUp({
                email,
                password
            });
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error };
        }
    },

    // SIGN IN WITH EMAIL & PASSWORD
    // Authenticates user with email and password credentials
    signInWithPassword: async (email, password) => {
        try {
            const { data, error } = await getAuthClient().auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error };
        }
    },

    // REQUEST OTP (Magic Link)
    // Sends a one-time password via email for passwordless login
    signInWithOtp: async (email) => {
        try {
            const { data, error } = await getAuthClient().auth.signInWithOtp({
                email
            });
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('OTP sign in error:', error);
            return { success: false, error };
        }
    },

    // VERIFY OTP
    // Verifies the one-time password token sent to user's email
    verifyOtp: async (email, token, type = 'email') => {
        try {
            const { data, error } = await getAuthClient().auth.verifyOtp({
                email,
                token,
                type
            });
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('OTP verification error:', error);
            return { success: false, error };
        }
    },

    // SIGN OUT
    // Logs out the current user and clears session
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

    // GET SESSION
    // Retrieves the current user session if available
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

    // GET CURRENT USER
    // Retrieves the authenticated user's profile information
    getUser: async () => {
        try {
            const { data, error } = await getAuthClient().auth.getUser();
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Get user error:', error);
            return { success: false, error };
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = authManager;
}
