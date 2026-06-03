import { supabase } from './supabaseClient.js';
import { cacheManager } from './cacheManager.js';

export const productService = {
  // Fetch all products for a specific business (with Caching)
  async fetchProducts(businessId) {
    try {
      // 1. Try to get data from local cache first
      const cachedData = cacheManager.get(businessId, 'products');
      if (cachedData) {
        return { success: true, data: cachedData, fromCache: true };
      }

      // 2. If no cache, pull fresh data from Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map DB fields to frontend format
      const mappedProducts = data.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description_short || p.description_long || '',
        price: p.price || 0,
        img: p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400',
        status: p.source === 'manual' ? 'added' : 'discovered',
        raw: p
      }));

      // 3. Save the fresh data to cache for next time
      cacheManager.set(businessId, 'products', mappedProducts);

      return { success: true, data: mappedProducts };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { success: false, error: error.message };
    }
  },

  // Add a new product
  async addProduct(productData) {
    try {
      const payload = {
        id: productData.id || crypto.randomUUID(),
        business_id: productData.business_id,
        title: productData.title,
        description_short: productData.description,
        price: parseFloat(productData.price),
        images: productData.img ? [productData.img] : [],
        source: productData.status === 'discovered' ? 'scraped' : 'manual',
        type: 'product',
        is_visible: true
      };

      const { data, error } = await supabase
        .from('products')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      // Invalidate cache so it pulls clean on next page load
      cacheManager.invalidate(productData.business_id, 'products');

      return { success: true, data: data };
    } catch (error) {
      console.error('Error adding product:', error);
      return { success: false, error: error.message };
    }
  },

  // Update an existing product
  async updateProduct(productId, updates) {
    try {
      const payload = {};
      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.description !== undefined) payload.description_short = updates.description;
      if (updates.price !== undefined) payload.price = parseFloat(updates.price);
      if (updates.img !== undefined) payload.images = [updates.img];
      if (updates.status !== undefined) payload.source = updates.status === 'discovered' ? 'scraped' : 'manual';

      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;

      // Invalidate cache on modification
      if (data) {
        cacheManager.invalidate(data.business_id, 'products');
      }

      return { success: true, data: data };
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete a product
  async deleteProduct(productId) {
    try {
      // Get business id before deleting to clear the correct cache
      const { data: product } = await supabase
        .from('products')
        .select('business_id')
        .eq('id', productId)
        .single();

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      if (product) {
        cacheManager.invalidate(product.business_id, 'products');
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { success: false, error: error.message };
    }
  }
};

