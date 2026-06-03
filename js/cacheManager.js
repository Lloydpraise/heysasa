/**
 * Central Cache Manager for HeySasa! Dashboard
 * Handles safe, bounded LocalStorage caching for Products, Leads, Analytics, and Preferences.
 */

const CACHE_PREFIX = 'heysasa_cache_';
const MAX_ROW_LIMIT = 100; // Safety cap to prevent browser lag

export const cacheManager = {
    // Generate a unique key per business and data module
    generateKey(businessId, moduleName) {
        return `${CACHE_PREFIX}${businessId}_${moduleName}`;
    },

    // Get data from cache
    get(businessId, moduleName) {
        try {
            const key = this.generateKey(businessId, moduleName);
            const cached = localStorage.getItem(key);
            if (!cached) return null;
            
            return JSON.parse(cached);
        } catch (error) {
            console.error(`Cache read error for ${moduleName}:`, error);
            return null;
        }
    },

    // Save data to cache with automatic size limits
    set(businessId, moduleName, data) {
        try {
            const key = this.generateKey(businessId, moduleName);
            let dataToStore = data;

            // Enforce memory limits on lists (Products, Leads) to prevent device lag
            if (Array.isArray(data)) {
                if (data.length > MAX_ROW_LIMIT) {
                    dataToStore = data.slice(0, MAX_ROW_LIMIT); // Keep only the freshest 100 entries
                }
            }
            // Note: Analytics summaries are objects, so they pass through whole without bloating memory

            localStorage.setItem(key, JSON.stringify(dataToStore));
            return true;
        } catch (error) {
            console.error(`Cache write error for ${moduleName}:`, error);
            // If storage is full, wipe old cache keys to free up device memory safely
            this.clearAll();
            return false;
        }
    },

    // Force clear cache for a specific module (used when Supabase pushes updates)
    invalidate(businessId, moduleName) {
        const key = this.generateKey(businessId, moduleName);
        localStorage.removeItem(key);
    },

    // Clear all app caches safely
    clearAll() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(CACHE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    }
};