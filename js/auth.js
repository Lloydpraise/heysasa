// ==========================================
// AUTHENTICATION MODULE
// ==========================================

const getAuthClient = () => {
    const client = window.getSupabase();
    if (!client) {
        throw new Error('Supabase client not initialized. Ensure initSupabase.js is loaded.');
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

    updateBusinessUrl: async (websiteUrl) => {
        try {
            const { data, error } = await getAuthClient().auth.updateUser({
                data: { business_website: websiteUrl }
            });
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Update URL error:', error);
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
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = authManager;
}