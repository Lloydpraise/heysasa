// ─── Leads & Live Transcript Integration Service ──────────────────────────────
window.leadsService = {
    /**
     * Pulls active leads from the backend view for a given business
     */
    async fetchLiveLeads(businessId) {
        if (!window.supabase) {
            console.error("[Leads Service] Supabase client is not initialized.");
            return null;
        }

        try {
            // Fetch live lead cards from your main summary view
            const { data: leads, error } = await window.supabase
                .from('v_lead_summary')
                .select('*')
                .eq('business_id', businessId)
                .order('last_seen', { ascending: false });

            if (error) throw error;

            // Map database rows to match your exact front-end UI property names
            return leads.map(lead => ({
                id: lead.id || lead.lead_id,
                name: lead.name || "Unknown Lead",
                phone: lead.phone || "",
                lead_state: lead.lead_state || "new",
                lead_type: lead.lead_type || "business",
                is_ad_lead: !!lead.is_ad_lead,
                ad_headline: lead.ad_headline || null,
                ad_body: lead.ad_body || null,
                ad_thumbnail_url: lead.ad_thumbnail_url || null,
                ad_platform: lead.ad_platform || null,
                original_ad_id: lead.original_ad_id || null,
                product_interests: Array.isArray(lead.product_interests) ? lead.product_interests : [],
                lead_quality: lead.lead_quality || "warm",
                conv_stage: lead.conv_stage || "New Lead",
                customer_intent: lead.customer_intent || "",
                next_action_plan: lead.next_action_plan || "",
                psychology: lead.psychology || "",
                trust_markers: Array.isArray(lead.trust_markers) ? lead.trust_markers : [],
                vibe_check: lead.vibe_check || "",
                context_summary: lead.context_summary || "",
                follow_up_count: lead.follow_up_count || 0,
                last_seen: lead.last_seen || new Date().toISOString(),
                unread_count: lead.unread_count || 0,
                cart_state: Array.isArray(lead.cart_state) ? lead.cart_state : [],
                is_business_chat: lead.is_business_chat !== false,
                followup: lead.followup || {
                    status: 'not_enrolled',
                    current_step: 0,
                    pending_approval: false,
                    draft: null,
                    sent_steps: [],
                    next_due: null
                },
                // Default empty transcript array; will lazy-load when row clicked
                transcript: lead.transcript || []
            }));

        } catch (err) {
            console.error("[Leads Service] Failed to load live summaries:", err.message);
            return null;
        }
    },

    /**
     * Lazy-loads real-time message history transcripts for the selected lead chat panel
     */
    async fetchChatTranscript(leadId) {
        if (!window.supabase) return [];
        try {
            const { data: messages, error } = await window.supabase
                .from('messages')
                .select('sender, message_text, created_at')
                .eq('lead_id', leadId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            return messages.map(m => ({
                sender: m.sender === 'business' || m.sender === 'user' ? 'User' : (m.sender === 'ai' ? 'AI' : m.sender),
                msg: m.message_text,
                time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
        } catch (err) {
            console.error("[Leads Service] Failed to sync message logs:", err.message);
            return [];
        }
    }
};