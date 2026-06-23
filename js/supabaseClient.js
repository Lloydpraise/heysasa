// =========================================================================
// 1. GLOBAL CONTEXT DECLARATIONS (TOP LAYER)
// =========================================================================

/**
 * Universally retrieves the active 8-character business identifier.
 * Use this across any module to get the current business context.
 * @returns {string|null} The short business_id or null if not onboarded
 */
window.getActiveBusinessId = () => {
    // Most modules use `business_id` in localStorage; older helper used `sb_business_id`.
    // Read `business_id` first for compatibility, then fall back to the legacy key.
    const id = localStorage.getItem('business_id') || localStorage.getItem('sb_business_id');
    if (!id) {
        console.warn('[Context Warning] Active business_id requested but none found in storage.');
    }
    return id;
};

// =========================================================================
// 2. CENTRALIZED API WRAPPER (METHODS LAYER)
// =========================================================================
window.supabaseAPI = {
    db: {
        /**
         * Fetches a single row by its standard database UUID column 'id'
         */
        fetchOne: async (tableName, id) => {
            const client = window.getSupabase();
            if (!client) {
                return { success: false, error: new Error("Supabase client not initialized") };
            }

            try {
                const { data, error } = await client
                    .from(tableName)
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                return { success: true, data: data };
            } catch (err) {
                console.error(`Error fetching from ${tableName} by UUID:`, err);
                return { success: false, error: err };
            }
        },

        /**
         * Fetches a single row by matching the short 8-character string 'business_id' column
         */
        fetchOneByShortId: async (tableName, shortId) => {
            const client = window.getSupabase();
            if (!client) {
                return { success: false, error: new Error("Supabase client not initialized") };
            }

            try {
                const { data, error } = await client
                    .from(tableName)
                    .select('*')
                    .eq('business_id', shortId)
                    .maybeSingle();

                if (error) throw error;
                return { success: true, data: data };
            } catch (err) {
                console.error(`Error fetching from ${tableName} by short ID:`, err);
                return { success: false, error: err };
            }
        }
    }
};