// ==========================================
// SUPABASE CLIENT API LAYER
// ==========================================
// All Supabase database and auth calls go here
// This ensures clean, organized, and centralized API management
// Import this file in your HTML and call methods from supabaseAPI

// Get the initialized Supabase client
const getClient = () => {
    const client = window.getSupabase();
    if (!client) {
        throw new Error('Supabase client not initialized. Ensure initSupabase.js is loaded.');
    }
    return client;
};

// ==========================================
// AUTHENTICATION METHODS
// ==========================================
const supabaseAPI = {
    // Sign up with email and password
    auth: {
        signUpWithPassword: async (email, password) => {
            try {
                const { data, error } = await getClient().auth.signUp({
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

        // Sign in with email and password
        signInWithPassword: async (email, password) => {
            try {
                const { data, error } = await getClient().auth.signInWithPassword({
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

        // Sign in with OTP (magic link)
        signInWithOtp: async (email) => {
            try {
                const { data, error } = await getClient().auth.signInWithOtp({
                    email
                });
                if (error) throw error;
                return { success: true, data };
            } catch (error) {
                console.error('OTP sign in error:', error);
                return { success: false, error };
            }
        },

        // Verify OTP
        verifyOtp: async (email, token, type = 'email') => {
            try {
                const { data, error } = await getClient().auth.verifyOtp({
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

        // Sign out
        signOut: async () => {
            try {
                const { error } = await getClient().auth.signOut();
                if (error) throw error;
                return { success: true };
            } catch (error) {
                console.error('Sign out error:', error);
                return { success: false, error };
            }
        },

        // Get current session
        getSession: async () => {
            try {
                const { data, error } = await getClient().auth.getSession();
                if (error) throw error;
                return { success: true, data };
            } catch (error) {
                console.error('Get session error:', error);
                return { success: false, error };
            }
        },

        // Get current user
        getUser: async () => {
            try {
                const { data, error } = await getClient().auth.getUser();
                if (error) throw error;
                return { success: true, data };
            } catch (error) {
                console.error('Get user error:', error);
                return { success: false, error };
            }
        }
    },

    // ==========================================
    // DATABASE METHODS
    // ==========================================
    db: {
        // Fetch data from a table
        fetchData: async (table, options = {}) => {
            try {
                let query = getClient().from(table).select(options.select || '*');
                
                if (options.filter) {
                    Object.entries(options.filter).forEach(([key, value]) => {
                        query = query.eq(key, value);
                    });
                }
                
                if (options.limit) query = query.limit(options.limit);
                if (options.order) query = query.order(options.order.by, { ascending: options.order.ascending });
                
                const { data, error } = await query;
                if (error) throw error;
                return { success: true, data };
            } catch (error) {
                console.error(`Fetch error (${table}):`, error);
                return { success: false, error };
            }
        },

        // Insert data into a table
        insertData: async (table, data) => {
            try {
                const { data: result, error } = await getClient()
                    .from(table)
                    .insert([data])
                    .select();
                
                if (error) throw error;
                return { success: true, data: result };
            } catch (error) {
                console.error(`Insert error (${table}):`, error);
                return { success: false, error };
            }
        },

        // Update data in a table
        updateData: async (table, id, updates) => {
            try {
                const { data, error } = await getClient()
                    .from(table)
                    .update(updates)
                    .eq('id', id)
                    .select();
                
                if (error) throw error;
                return { success: true, data };
            } catch (error) {
                console.error(`Update error (${table}):`, error);
                return { success: false, error };
            }
        },

        // Delete data from a table
        deleteData: async (table, id) => {
            try {
                const { data, error } = await getClient()
                    .from(table)
                    .delete()
                    .eq('id', id);
                
                if (error) throw error;
                return { success: true, data };
            } catch (error) {
                console.error(`Delete error (${table}):`, error);
                return { success: false, error };
            }
        },

        // Fetch a single record
        fetchOne: async (table, id) => {
            try {
                const { data, error } = await getClient()
                    .from(table)
                    .select('*')
                    .eq('id', id)
                    .single();
                
                if (error) throw error;
                return { success: true, data };
            } catch (error) {
                console.error(`Fetch one error (${table}):`, error);
                return { success: false, error };
            }
        }
    },

    // ==========================================
    // STORAGE METHODS (File uploads)
    // ==========================================
    storage: {
        // Upload a file
        uploadFile: async (bucket, path, file) => {
            try {
                const { data, error } = await getClient()
                    .storage
                    .from(bucket)
                    .upload(path, file);
                
                if (error) throw error;
                return { success: true, data };
            } catch (error) {
                console.error(`Upload error (${bucket}):`, error);
                return { success: false, error };
            }
        },

        // Delete a file
        deleteFile: async (bucket, path) => {
            try {
                const { data, error } = await getClient()
                    .storage
                    .from(bucket)
                    .remove([path]);
                
                if (error) throw error;
                return { success: true, data };
            } catch (error) {
                console.error(`Delete file error (${bucket}):`, error);
                return { success: false, error };
            }
        },

        // Get public URL for a file
        getPublicUrl: (bucket, path) => {
            try {
                const { data } = getClient()
                    .storage
                    .from(bucket)
                    .getPublicUrl(path);
                
                return { success: true, url: data.publicUrl };
            } catch (error) {
                console.error(`Get URL error (${bucket}):`, error);
                return { success: false, error };
            }
        }
    },

    // ==========================================
    // REAL-TIME SUBSCRIPTIONS
    // ==========================================
    realtime: {
        // Subscribe to changes in a table
        subscribeToTable: (table, callback) => {
            try {
                const subscription = getClient()
                    .channel(`public:${table}`)
                    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
                    .subscribe();
                
                return { success: true, subscription };
            } catch (error) {
                console.error(`Subscribe error (${table}):`, error);
                return { success: false, error };
            }
        },

        // Unsubscribe from changes
        unsubscribeFromTable: async (subscription) => {
            try {
                await getClient().removeChannel(subscription);
                return { success: true };
            } catch (error) {
                console.error('Unsubscribe error:', error);
                return { success: false, error };
            }
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = supabaseAPI;
}
