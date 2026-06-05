// =========================================================================
// PRODUCT DATA SERVICE
// =========================================================================

window.productService = {

    /**
     * Fetch all products for a business.
     * Returns both manually-added and AI-discovered products in one query —
     * the UI separates them by the `source` field.
     *
     * @param {string} businessId
     * @returns {{ success: boolean, data: Array, error: string|null }}
     */
    fetchProducts: async (businessId) => {
        const client = window.getSupabase();
        if (!client) {
            console.error('[ProductService] Supabase client is uninitialized.');
            return { success: false, data: [], error: 'No Supabase client.' };
        }

        try {
            const { data, error } = await client
                .from('products')
                .select(`
                    id,
                    title,
                    description_short,
                    price,
                    old_price,
                    images,
                    source,
                    stock_quantity,
                    is_visible,
                    type,
                    product_type,
                    created_at
                `)
                .eq('business_id', businessId)
                .eq('is_visible', true)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Normalise rows into the flat shape the UI expects
            const normalised = (data || []).map(row => ({
                id:          row.id,
                title:       row.title                          || 'Untitled Product',
                description: row.description_short             || '',
                price:       row.price != null
                                 ? Number(row.price).toLocaleString('en-KE')
                                 : '—',
                img:         Array.isArray(row.images) && row.images.length > 0
                                 ? row.images[0]
                                 : 'https://placehold.co/400x208/f3f4f6/94a3b8?text=No+Image',
                // Tab routing: 'manual' → Added Products tab; everything else → Discovered tab
                status:      row.source === 'manual' ? 'added' : 'discovered',
                stock:       row.stock_quantity ?? 0,
                type:        row.type           || 'product',
                product_type: row.product_type  || null,
            }));

            return { success: true, data: normalised, error: null };

        } catch (err) {
            console.error('[ProductService] fetchProducts failed:', err);
            return { success: false, data: [], error: err.message };
        }
    },

    /**
     * Hard-delete a product row by its primary key.
     *
     * @param {string} productId
     * @returns {{ success: boolean, error: string|null }}
     */
    deleteProduct: async (productId) => {
        const client = window.getSupabase();
        if (!client) {
            return { success: false, error: 'No Supabase client.' };
        }

        try {
            const { error } = await client
                .from('products')
                .delete()
                .eq('id', productId);

            if (error) throw error;

            return { success: true, error: null };

        } catch (err) {
            console.error('[ProductService] deleteProduct failed:', err);
            return { success: false, error: err.message };
        }
    },
};