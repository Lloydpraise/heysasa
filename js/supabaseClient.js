// ==========================================
// SUPABASE DATABASE & STORAGE API LAYER
// ==========================================
// All Supabase database and storage calls (non-auth) go here
// Authentication logic is in auth.js
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
// DATABASE METHODS
// ==========================================
const supabaseAPI = {
    db: {
        // FETCH DATA FROM TABLE
        // Retrieves data from a table with optional filtering, limiting, and ordering
        // Used in: getstarted.js (checking business connection status)
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

        // INSERT DATA INTO TABLE
        // Adds new records to a table and returns the inserted data
        // Not currently used but available for creating new records
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

        // UPDATE DATA IN TABLE
        // Modifies existing records in a table by ID
        // Not currently used but available for editing records
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

        // DELETE DATA FROM TABLE
        // Removes records from a table by ID
        // Not currently used but available for deleting records
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

        // FETCH SINGLE RECORD BY ID
        // Retrieves a specific record from a table by its ID
        // Used in: getstarted.js (checking if business WhatsApp connection is established)
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
    // STORAGE METHODS (File uploads/management)
    // ==========================================
    storage: {
        // UPLOAD FILE
        // Uploads a file to a Supabase storage bucket
        // Not currently used but available for file uploads
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

        // DELETE FILE
        // Removes a file from a Supabase storage bucket
        // Not currently used but available for file deletion
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

        // GET PUBLIC FILE URL
        // Generates a public URL for accessing a file from storage
        // Not currently used but available for sharing files
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
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = supabaseAPI;
}
