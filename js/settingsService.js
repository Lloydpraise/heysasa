import { supabase } from './supabaseClient.js'; // Adjust this path to your actual supabase client file

export const settingsService = {
  // STEP 1: Fetch all initial configurations, balance, and WhatsApp instance info
  async fetchSettings(businessId) {
    try {
      // 1. Fetch Business Profile & Rules
      const { data: business, error: busError } = await supabase
        .from('businesses')
        .select('*')
        .eq('business_id', businessId)
        .single();

      if (busError) throw busError;

      // 2. Fetch Billing Balance
      const { data: balance, error: balError } = await supabase
        .from('business_balances')
        .select('*')
        .eq('business_id', businessId)
        .single();

      // 3. Fetch WhatsApp Instance details if connected
      let instance = null;
      if (business?.evolution_instance_id) {
        const { data: instData, error: instError } = await supabase
          .from('instances')
          .select('*')
          .eq('id', business.evolution_instance_id)
          .single();
        
        if (!instError) instance = instData;
      }

      return {
        success: true,
        data: {
          business,
          balance: balance || { balance_usd: 0, lifetime_spent_usd: 0 },
          instance
        }
      };
    } catch (error) {
      console.error('Error fetching settings dashboard:', error);
      return { success: false, error: error.message };
    }
  },

  // STEP 2: Update Business Profile & Follow-up Rules
  async updateBusinessSettings(businessId, updates) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('business_id', businessId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating business settings:', error);
      return { success: false, error: error.message };
    }
  },

  // STEP 3: Content Materials CRUD Operations
  async fetchMaterials(businessId) {
    try {
      const { data, error } = await supabase
        .from('followup_materials')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching materials:', error);
      return { success: false, error: error.message };
    }
  },

  async addMaterial(materialData) {
    try {
      const { data, error } = await supabase
        .from('followup_materials')
        .insert([materialData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error adding material:', error);
      return { success: false, error: error.message };
    }
  },

  async updateMaterial(materialId, updates) {
    try {
      const { data, error } = await supabase
        .from('followup_materials')
        .update(updates)
        .eq('id', materialId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating material:', error);
      return { success: false, error: error.message };
    }
  },

  async deleteMaterial(materialId) {
    try {
      const { error } = await supabase
        .from('followup_materials')
        .delete()
        .eq('id', materialId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting material:', error);
      return { success: false, error: error.message };
    }
  },

  // STEP 4: Fetch Nudge Audit Logs
  async fetchNudgeLogs(businessId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('followup_nudge_log')
        .select(`
          *,
          contacts (
            name,
            phone
          )
        `)
        .eq('business_id', businessId)
        .order('sent_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching nudge logs:', error);
      return { success: false, error: error.message };
    }
  }
};