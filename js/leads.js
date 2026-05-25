// ─── Mock data reflecting the full v2 schema ───────────────────────────────
const mockLeads = [
    {
        id: 1,
        name: "Sarah Wambui",
        phone: "+254 712 345 678",
        lead_state: "engaged",
        lead_type: "business",
        is_ad_lead: true,
        ad_headline: "Power Your Home 24/7 — Solar Backup Systems",
        ad_body: "Never lose power again. Our 5kW solar inverter + lithium battery keeps you running day and night. Installation in 4 hours.",
        ad_thumbnail_url: "https://placehold.co/60x60/28A745/ffffff?text=AD",
        ad_platform: "facebook",
        original_ad_id: "fb_ad_001",
        product_interests: ["solar_energy"],
        lead_quality: "hot",
        conv_stage: "Price Inquiry",
        customer_intent: "Needs home office backup; worried about installation time.",
        next_action_plan: "Send the 'Fast-Track Installation' offer and technician schedule.",
        psychology: "Values reliability over cost. Needs reassurance on warranty.",
        trust_markers: ["KRA Verified", "Till Number Displayed"],
        vibe_check: "Polite but urgent; highly focused on technical specs and timelines.",
        context_summary: "Interested in 5kW system for home office. Key blocker is installation time. Has budget.",
        follow_up_count: 2,
        last_seen: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        unread_count: 2,
        cart_state: ["Solar Inverter 5kW", "Lithium Battery 200Ah"],
        is_business_chat: true,
        transcript: [
            { sender: "Sarah", msg: "Hi, how much is the 5kW system?", time: "10:14 AM" },
            { sender: "AI", msg: "Hi Sarah! Our 5kW system starts at KES 150,000 including the lithium battery. It's our most popular setup for home offices. Would you like to see our installation packages?", time: "10:14 AM" },
            { sender: "Sarah", msg: "Yes, but how long does it take to install? I work from home and can't afford downtime.", time: "10:17 AM" },
            { sender: "AI", msg: "Totally understand — we actually offer fast-track installations that are done in under 4 hours, usually morning to afternoon. Your internet and office stay running throughout. Want me to check available slots this week?", time: "10:17 AM" },
            { sender: "Sarah", msg: "That sounds great. What warranty do you offer?", time: "10:21 AM" },
            { sender: "User", msg: "Hi Sarah, this is James from the team. We offer a 5-year full warranty on the inverter and 3 years on the battery — one of the best in the market. I can also send you a quotation right now if you'd like to confirm the slot.", time: "10:25 AM" }
        ]
    },
    {
        id: 2,
        name: "Brian Omondi",
        phone: "+254 722 987 654",
        lead_state: "stalled",
        lead_type: "business",
        is_ad_lead: true,
        ad_headline: "Power Your Home 24/7 — Solar Backup Systems",
        ad_body: "Never lose power again. Our 5kW solar inverter + lithium battery keeps you running day and night. Installation in 4 hours.",
        ad_thumbnail_url: "https://placehold.co/60x60/28A745/ffffff?text=AD",
        ad_platform: "facebook",
        original_ad_id: "fb_ad_001",
        product_interests: ["solar_energy"],
        lead_quality: "warm",
        conv_stage: "Comparing Options",
        customer_intent: "Comparing solar vs generator. Price sensitive.",
        next_action_plan: "Send cost comparison: solar 5yr TCO vs generator 5yr TCO.",
        psychology: "Analytical. Will decide on numbers, not emotion.",
        trust_markers: ["Till Number Displayed"],
        vibe_check: "Methodical. Asks the right questions. Stalled because he's doing research.",
        context_summary: "Evaluating solar vs generator. Hasn't committed. Needs data-driven nudge.",
        follow_up_count: 1,
        last_seen: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        unread_count: 0,
        cart_state: ["Solar Inverter 3kW"],
        is_business_chat: true,
        transcript: [
            { sender: "Brian", msg: "How does your solar compare to just getting a generator?", time: "Yesterday" },
            { sender: "AI", msg: "Great question Brian. Over 5 years, solar typically costs 60% less to run than a petrol generator — no fuel costs, near-zero maintenance. Want me to put together the numbers for your specific load?", time: "Yesterday" },
            { sender: "Brian", msg: "Yes please. I'll think about it.", time: "Yesterday" }
        ]
    },
    {
        id: 3,
        name: "Amina Hassan",
        phone: "+254 733 112 233",
        lead_state: "new",
        lead_type: "business",
        is_ad_lead: true,
        ad_headline: "Rent Furnished Apartments in Westlands",
        ad_body: "1, 2 & 3 bedroom fully furnished apartments. Monthly rates from KES 45,000. All utilities included.",
        ad_thumbnail_url: "https://placehold.co/60x60/378ADD/ffffff?text=AD",
        ad_platform: "instagram",
        original_ad_id: "ig_ad_002",
        product_interests: ["real_estate"],
        lead_quality: "hot",
        conv_stage: "First Contact",
        customer_intent: "Looking for 2BR apartment, move-in next month.",
        next_action_plan: "Send 2BR unit photos and available dates. Offer viewing this week.",
        psychology: "Ready to decide. Time-sensitive — relocation context.",
        trust_markers: [],
        vibe_check: "Decisive and clear on requirements. High buying intent.",
        context_summary: "Relocating to Nairobi. Needs 2BR, furnished, Westlands area. Budget not discussed yet.",
        follow_up_count: 0,
        last_seen: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        unread_count: 1,
        cart_state: ["2BR Furnished — Westlands"],
        is_business_chat: true,
        transcript: [
            { sender: "Amina", msg: "Hi I saw your ad. Do you have 2 bedroom units available from next month?", time: "45 min ago" },
            { sender: "AI", msg: "Hi Amina! Yes, we have two 2BR units available from the 1st. Both are fully furnished with wifi, water and security included. Can I send you photos and the monthly rate?", time: "45 min ago" },
            { sender: "Amina", msg: "Yes please!", time: "43 min ago" }
        ]
    },
    {
        id: 4,
        name: "Kevin Mwangi",
        phone: "+254 700 445 566",
        lead_state: "ghosted",
        lead_type: "business",
        is_ad_lead: false,
        ad_headline: null,
        ad_body: null,
        ad_thumbnail_url: null,
        ad_platform: null,
        original_ad_id: null,
        product_interests: ["solar_energy", "financial_services"],
        lead_quality: "warm",
        conv_stage: "Ghosted After Quote",
        customer_intent: "Was interested in solar, went quiet after receiving quote.",
        next_action_plan: "Send a no-pressure check-in. Offer flexible payment plan.",
        psychology: "May have had budget shock. Needs softer re-entry.",
        trust_markers: ["KRA Verified"],
        vibe_check: "Was warm, then disappeared. Likely comparing prices elsewhere.",
        context_summary: "Received quote for 5kW system. No response in 8 days. Was price-conscious.",
        follow_up_count: 3,
        last_seen: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        unread_count: 0,
        cart_state: ["Solar Inverter 5kW"],
        is_business_chat: true,
        transcript: [
            { sender: "Kevin", msg: "Can I get a quote for the 5kW system?", time: "8 days ago" },
            { sender: "AI", msg: "Of course Kevin! Here's your quote: 5kW Inverter + 200Ah Battery + Installation = KES 165,000. We also have a 12-month payment plan starting at KES 14,500/month.", time: "8 days ago" },
            { sender: "Kevin", msg: "Ok let me think about it", time: "8 days ago" }
        ]
    },
    {
        id: 5,
        name: "Grace Njoroge",
        phone: "+254 711 334 455",
        lead_state: "won",
        lead_type: "business",
        is_ad_lead: true,
        ad_headline: "Power Your Home 24/7 — Solar Backup Systems",
        ad_body: "Never lose power again. Our 5kW solar inverter + lithium battery keeps you running day and night. Installation in 4 hours.",
        ad_thumbnail_url: "https://placehold.co/60x60/28A745/ffffff?text=AD",
        ad_platform: "facebook",
        original_ad_id: "fb_ad_001",
        product_interests: ["solar_energy"],
        lead_quality: "hot",
        conv_stage: "Closed",
        customer_intent: "Purchased 5kW system. Installation scheduled.",
        next_action_plan: "Send post-installation care guide and ask for referral.",
        psychology: "Happy customer. Good referral potential.",
        trust_markers: ["KRA Verified", "Till Number Displayed"],
        vibe_check: "Very satisfied. Mentioned friends asking about solar.",
        context_summary: "Converted. Paid in full. Installation done. Very happy with service speed.",
        follow_up_count: 1,
        last_seen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        unread_count: 0,
        cart_state: ["Solar Inverter 5kW", "Lithium Battery 200Ah"],
        is_business_chat: true,
        transcript: [
            { sender: "Grace", msg: "Hi, interested in the solar system from your ad", time: "4 days ago" },
            { sender: "AI", msg: "Hi Grace! Great to hear from you. Which system size are you looking at?", time: "4 days ago" },
            { sender: "Grace", msg: "The 5kW one. How fast can you install?", time: "4 days ago" },
            { sender: "User", msg: "Hi Grace, we can do tomorrow morning. Payment is via M-Pesa till number 123456. Want to confirm?", time: "4 days ago" },
            { sender: "Grace", msg: "Confirmed! Payment sent.", time: "4 days ago" }
        ]
    },
    {
        id: 6,
        name: "Daniel Otieno",
        phone: "+254 799 223 344",
        lead_state: "new",
        lead_type: "personal",
        is_ad_lead: false,
        ad_headline: null,
        ad_body: null,
        ad_thumbnail_url: null,
        ad_platform: null,
        original_ad_id: null,
        product_interests: [],
        lead_quality: null,
        conv_stage: "Personal",
        customer_intent: "Appears to be a personal contact, not a business lead.",
        next_action_plan: null,
        psychology: null,
        trust_markers: [],
        vibe_check: "Casual greeting. No product interest detected.",
        context_summary: "Personal contact. Greeted casually. No buying intent signals.",
        follow_up_count: 0,
        last_seen: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        unread_count: 0,
        cart_state: [],
        is_business_chat: false,
        transcript: [
            { sender: "Daniel", msg: "Niaje bro, uko?", time: "5 days ago" },
            { sender: "User", msg: "Poa! Uko sawa?", time: "5 days ago" }
        ]
    }
];

// ─── State ──────────────────────────────────────────────────────────────────
let leadsSearchQuery = '';
let activeLeadStateFilter = 'all';
let activeLeadTypeFilter = 'all';
let activeLeadId = null;
let chatOpen = false;

// ─── Computed stats ──────────────────────────────────────────────────────────
function getLeadStats() {
    const business = mockLeads.filter(l => l.lead_type === 'business');
    const adLeads  = mockLeads.filter(l => l.is_ad_lead);
    const unread   = mockLeads.filter(l => l.unread_count > 0);
    const urgent   = mockLeads.filter(l => ['stalled','ghosted'].includes(l.lead_state) && l.lead_type === 'business');
    const ready    = mockLeads.filter(l => l.lead_quality === 'hot' && l.lead_state === 'engaged');
    return { total: mockLeads.length, business: business.length, adLeads: adLeads.length, unread: unread.length, urgent: urgent.length, ready: ready.length };
}

// ─── Filter + sort ───────────────────────────────────────────────────────────
const STATE_PRIORITY = { engaged: 0, new: 1, warm: 2, stalled: 3, ghosted: 4, won: 5, lost: 6, personal: 7 };

function getFilteredLeads() {
    return mockLeads
        .filter(lead => {
            const q = leadsSearchQuery.toLowerCase();
            const matchesSearch = !q ||
                lead.name.toLowerCase().includes(q) ||
                lead.phone.includes(q) ||
                (lead.customer_intent || '').toLowerCase().includes(q) ||
                (lead.ad_headline || '').toLowerCase().includes(q) ||
                (lead.product_interests || []).some(p => p.includes(q));

            const matchesState = activeLeadStateFilter === 'all' || lead.lead_state === activeLeadStateFilter;
            const matchesType  = activeLeadTypeFilter  === 'all' || lead.lead_type  === activeLeadTypeFilter ||
                (activeLeadTypeFilter === 'ad' && lead.is_ad_lead);

            return matchesSearch && matchesState && matchesType;
        })
        .sort((a, b) => {
            // Unread first
            if (b.unread_count !== a.unread_count) return b.unread_count - a.unread_count;
            // Then by urgency state
            const ap = STATE_PRIORITY[a.lead_state] ?? 9;
            const bp = STATE_PRIORITY[b.lead_state] ?? 9;
            if (ap !== bp) return ap - bp;
            // Then recency
            return new Date(b.last_seen) - new Date(a.last_seen);
        });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function timeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
}

function stateConfig(state) {
    const map = {
        engaged:  { label: 'Engaged',  cls: 'state-engaged'  },
        new:      { label: 'New',      cls: 'state-new'      },
        warm:     { label: 'Warm',     cls: 'state-warm'     },
        stalled:  { label: 'Stalled',  cls: 'state-stalled'  },
        ghosted:  { label: 'Ghosted',  cls: 'state-ghosted'  },
        won:      { label: 'Won',      cls: 'state-won'      },
        lost:     { label: 'Lost',     cls: 'state-lost'     },
        personal: { label: 'Personal', cls: 'state-personal' },
    };
    return map[state] || { label: state, cls: 'state-new' };
}

function qualityConfig(q) {
    if (!q) return null;
    const map = {
        hot:  { label: 'Hot',  cls: 'quality-hot'  },
        warm: { label: 'Warm', cls: 'quality-warm' },
        cold: { label: 'Cold', cls: 'quality-cold' },
    };
    return map[q.toLowerCase()] || null;
}

function formatInterest(tag) {
    return tag.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function platformIcon(platform) {
    if (platform === 'instagram') return 'ti-brand-instagram';
    if (platform === 'facebook')  return 'ti-brand-facebook';
    return 'ti-brand-meta';
}

// ─── Inject styles ───────────────────────────────────────────────────────────
function injectLeadsStyles() {
    if (document.getElementById('leads-styles')) return;
    const style = document.createElement('style');
    style.id = 'leads-styles';
    style.textContent = `
        /* Main Layout */
        .leads-wrap { display: flex; height: 100%; overflow: hidden; background: transparent; }
        .leads-panel { width: 380px; min-width: 340px; flex-shrink: 0; display: flex; flex-direction: column; background: rgba(255,255,255,0.4); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-right: 1px solid rgba(255,255,255,0.6); border-radius: 2rem 0 0 2rem; z-index: 10; }
        .leads-panel-header { padding: 24px 20px 10px; flex-shrink: 0; }
        
        /* Glass Stat Chips */
        .leads-stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
        .stat-chip { background: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.9); border-radius: 14px; padding: 12px 10px 10px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.01); text-align: center; }
        .stat-chip:hover { background: rgba(255,255,255,0.9); transform: translateY(-1px); box-shadow: 0 6px 15px rgba(0,0,0,0.03); }
        .stat-chip.active { background: rgba(255,255,255,0.95); border-color: #28A745; box-shadow: 0 4px 15px rgba(40,167,69,0.1); }
        .stat-chip .stat-num { font-size: 24px; font-weight: 800; color: #0F172A; line-height: 1; }
        .stat-chip .stat-lbl { font-size: 10px; color: #64748B; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; font-weight: 700; }
        .stat-chip.urgent .stat-num { color: #FF8C00; }
        .stat-chip.ready-chip .stat-num  { color: #28A745; }
        
        /* Search Bar */
        .leads-search { position: relative; margin-bottom: 16px; }
        .leads-search input { width: 100%; padding: 12px 14px 12px 40px; background: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.9); border-radius: 14px; font-size: 13px; color: #0F172A; outline: none; box-sizing: border-box; transition: all 0.2s; box-shadow: inset 0 2px 4px rgba(0,0,0,0.01); }
        .leads-search input::placeholder { color: #94A3B8; }
        .leads-search input:focus { border-color: #28A745; background: rgba(255,255,255,0.9); box-shadow: 0 0 0 3px rgba(40,167,69,0.1); }
        .leads-search .s-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94A3B8; font-size: 18px; }
        
        /* Filter Tabs */
        .filter-tabs { display: flex; gap: 6px; padding: 0 0 10px; overflow-x: auto; scrollbar-width: none; }
        .filter-tabs::-webkit-scrollbar { display: none; }
        .ftab { padding: 6px 12px; border-radius: 10px; font-size: 11px; font-weight: 600; color: #64748B; background: transparent; border: 1px solid transparent; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
        .ftab:hover { background: rgba(255,255,255,0.5); color: #0F172A; }
        .ftab.active { background: rgba(255,255,255,0.8); color: #0F172A; border-color: rgba(255,255,255,0.9); box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
        
        /* Leads List */
        .leads-list { flex: 1; overflow-y: auto; padding: 0 12px 20px; }
        .lead-row { display: flex; align-items: flex-start; gap: 12px; padding: 14px 12px; border-radius: 16px; cursor: pointer; transition: all 0.2s; margin-bottom: 6px; position: relative; border: 1px solid transparent; background: transparent; }
        .lead-row:hover { background: rgba(255,255,255,0.5); }
        .lead-row.active { background: rgba(255,255,255,0.8); border-color: rgba(255,255,255,0.9); box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
        
        /* Avatars */
        .lead-avatar { width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .avatar-business { background: rgba(40,167,69,0.1); color: #28A745; border: 1px solid rgba(40,167,69,0.2); }
        .avatar-personal { background: rgba(15,23,42,0.05); color: #64748B; border: 1px solid rgba(15,23,42,0.1); }
        
        /* Row Content */
        .lead-row-body { flex: 1; min-width: 0; }
        .lead-row-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
        .lead-name { font-size: 14px; font-weight: 700; color: #0F172A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .lead-time { font-size: 10px; color: #94A3B8; font-weight: 500; flex-shrink: 0; }
        .lead-preview { font-size: 12px; color: #64748B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 6px; font-weight: 400; }
        .lead-tags { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        
        /* Pills & Badges */
        .state-pill { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 8px; border-radius: 6px; }
        .state-engaged  { background: rgba(40,167,69,0.1); color: #28A745; }
        .state-new      { background: rgba(55,138,221,0.1); color: #378ADD; }
        .state-warm     { background: rgba(255,140,0,0.1); color: #FF8C00; }
        .state-stalled  { background: rgba(255,140,0,0.1); color: #FF8C00; }
        .state-ghosted  { background: rgba(15,23,42,0.05); color: #64748B; }
        .state-won      { background: #28A745; color: #fff; }
        .state-lost     { background: rgba(239,68,68,0.1); color: #EF4444; }
        .state-personal { background: rgba(15,23,42,0.05); color: #94A3B8; }
        
        .quality-pill   { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 8px; border-radius: 6px; }
        .quality-hot    { background: rgba(239,68,68,0.1); color: #EF4444; }
        .quality-warm   { background: rgba(255,140,0,0.1); color: #FF8C00; }
        .quality-cold   { background: rgba(55,138,221,0.1); color: #378ADD; }
        
        .ad-badge { display: flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 8px; border-radius: 6px; background: rgba(15,23,42,0.05); color: #0F172A; }
        .unread-badge { min-width: 18px; height: 18px; border-radius: 9px; background: #EF4444; color: #fff; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; padding: 0 5px; box-shadow: 0 2px 5px rgba(239,68,68,0.3); }

        /* Detail Panel */
        .detail-panel { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: transparent; z-index: 5; }
        .detail-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #94A3B8; gap: 16px; padding: 24px; }
        .detail-empty i { font-size: 64px; color: rgba(15,23,42,0.1); }
        .detail-empty p { font-size: 18px; font-weight: 600; color: #64748B; }
        .detail-main { flex: 1; overflow-y: auto; padding: 32px 40px; }
        
        /* Detail Header */
        .detail-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid rgba(15,23,42,0.05); }
        .detail-identity { display: flex; align-items: center; gap: 16px; }
        .detail-avatar { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; flex-shrink: 0; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .detail-header-actions { display: flex; gap: 10px; }
        
        /* Buttons */
        .btn-action { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 18px; border-radius: 12px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; border: none; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
        .btn-primary { background: #28A745; color: #fff; box-shadow: 0 4px 15px rgba(40,167,69,0.2); }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(40,167,69,0.3); }
        .btn-secondary { background: rgba(255,255,255,0.8); color: #0F172A; border: 1px solid rgba(255,255,255,0.9); }
        .btn-secondary:hover { background: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }

        /* Premium Glass Cards (Next Action & Ads) */
        .glass-card { background: rgba(255,255,255,0.7); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.9); box-shadow: 0 4px 20px rgba(0,0,0,0.02); border-radius: 1.25rem; padding: 20px; margin-bottom: 24px; }
        
        .action-card { border-left: 4px solid #28A745; }
        .action-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .action-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #28A745; display: flex; align-items: center; gap: 6px; }
        .ai-badge { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 8px; border-radius: 6px; background: rgba(40,167,69,0.1); color: #28A745; display: flex; align-items: center; gap: 4px; }
        .action-text { font-size: 14px; color: #0F172A; font-weight: 500; margin-bottom: 16px; line-height: 1.6; }
        .action-btns { display: flex; gap: 10px; }
        .btn-execute { flex: 1; padding: 12px; border-radius: 12px; background: #0F172A; color: #fff; font-size: 13px; font-weight: 700; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; }
        .btn-execute:hover { background: #1E293B; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(15,23,42,0.15); }
        .btn-wa { padding: 12px 20px; border-radius: 12px; background: rgba(40,167,69,0.1); color: #28A745; font-size: 13px; font-weight: 700; border: 1px solid rgba(40,167,69,0.2); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; text-decoration: none; }
        .btn-wa:hover { background: rgba(40,167,69,0.2); }

        .ad-card { border-left: 4px solid #0F172A; display: flex; gap: 16px; align-items: flex-start; }
        .ad-thumb { width: 64px; height: 64px; border-radius: 12px; object-fit: cover; flex-shrink: 0; border: 1px solid rgba(15,23,42,0.05); }
        .ad-thumb-placeholder { width: 64px; height: 64px; border-radius: 12px; flex-shrink: 0; background: rgba(15,23,42,0.05); display: flex; align-items: center; justify-content: center; }
        .ad-info-top { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
        .ad-platform-badge { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 8px; border-radius: 6px; background: rgba(15,23,42,0.05); color: #0F172A; display: flex; align-items: center; gap: 4px; }
        .ad-headline-text { font-size: 14px; font-weight: 700; color: #0F172A; line-height: 1.4; margin-bottom: 4px; }
        .ad-body-text { font-size: 12px; color: #64748B; line-height: 1.5; }

        /* Section blocks */
        .detail-section { margin-bottom: 24px; }
        .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #64748B; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
        .info-block { background: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.9); border-radius: 16px; padding: 16px 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.01); }
        .info-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding: 8px 0; border-bottom: 1px solid rgba(15,23,42,0.05); font-size: 13px; }
        .info-row:last-child { border-bottom: none; padding-bottom: 0; }
        .info-row:first-child { padding-top: 0; }
        .info-key { color: #64748B; font-weight: 600; flex-shrink: 0; }
        .info-val { color: #0F172A; font-weight: 500; text-align: right; }
        
        /* Detail Tags */
        .tags-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .interest-tag { font-size: 11px; padding: 4px 10px; border-radius: 8px; background: rgba(40,167,69,0.1); color: #28A745; font-weight: 600; }
        .trust-tag { font-size: 11px; padding: 4px 10px; border-radius: 8px; background: rgba(15,23,42,0.05); color: #0F172A; font-weight: 600; }
        .cart-tag { font-size: 11px; padding: 4px 10px; border-radius: 8px; background: #fff; color: #0F172A; border: 1px solid rgba(15,23,42,0.1); font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        
        .vibe-block { background: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.9); border-radius: 16px; padding: 16px 20px; font-size: 13px; color: #64748B; line-height: 1.6; font-style: italic; display: flex; gap: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.01); }

        /* Personal Notice */
        .personal-notice { background: rgba(15,23,42,0.02); border: 1px solid rgba(15,23,42,0.05); border-radius: 12px; padding: 14px 16px; margin-bottom: 24px; font-size: 12px; color: #64748B; display: flex; gap: 10px; align-items: flex-start; line-height: 1.5; }

        /* Chat Panel */
        .chat-panel { width: 360px; min-width: 320px; flex-shrink: 0; background: rgba(255,255,255,0.4); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-left: 1px solid rgba(255,255,255,0.6); display: flex; flex-direction: column; transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s; overflow: hidden; z-index: 20; border-radius: 0 2rem 2rem 0; }
        .chat-panel.hidden { width: 0; min-width: 0; border-left: none; }
        .chat-panel-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 20px 16px; border-bottom: 1px solid rgba(15,23,42,0.05); flex-shrink: 0; background: rgba(255,255,255,0.5); }
        .chat-panel-title { font-size: 14px; font-weight: 800; color: #0F172A; display: flex; align-items: center; gap: 8px; }
        
        .chat-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
        .chat-bubble-wrap { display: flex; flex-direction: column; }
        .chat-bubble-wrap.out { align-items: flex-end; }
        .chat-bubble-wrap.in  { align-items: flex-start; }
        .chat-sender-label { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #94A3B8; margin-bottom: 4px; padding: 0 4px; }
        .chat-bubble { max-width: 85%; padding: 12px 16px; border-radius: 16px; font-size: 13px; line-height: 1.5; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        
        /* Chat bubble colors updated to premium theme */
        .bubble-lead  { background: rgba(255,255,255,0.9); color: #0F172A; border-bottom-left-radius: 4px; border: 1px solid rgba(255,255,255,1); }
        .bubble-ai    { background: #28A745; color: #fff; border-bottom-right-radius: 4px; }
        .bubble-user  { background: #0F172A; color: #fff; border-bottom-right-radius: 4px; }
        
        .chat-time { font-size: 9px; color: #94A3B8; font-weight: 600; margin-top: 4px; padding: 0 4px; }
        
        .chat-input-area { padding: 16px 20px 24px; border-top: 1px solid rgba(15,23,42,0.05); flex-shrink: 0; background: rgba(255,255,255,0.5); }
        .chat-input-row { display: flex; gap: 10px; align-items: center; }
        .chat-input-row input { flex: 1; padding: 12px 16px; background: rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.9); border-radius: 24px; font-size: 13px; outline: none; box-shadow: inset 0 2px 4px rgba(0,0,0,0.01); color: #0F172A; transition: all 0.2s; }
        .chat-input-row input:focus { border-color: #28A745; background: #fff; box-shadow: 0 0 0 3px rgba(40,167,69,0.1); }
        .chat-send-btn { width: 40px; height: 40px; border-radius: 50%; background: #28A745; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; transition: all 0.2s; box-shadow: 0 4px 10px rgba(40,167,69,0.2); }
        .chat-send-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 15px rgba(40,167,69,0.3); }

        /* Empty state */
        .empty-list { text-align: center; padding: 60px 20px; color: #94A3B8; }
        .empty-list i { font-size: 40px; display: block; margin-bottom: 12px; color: rgba(15,23,42,0.1); }
        .empty-list p { font-size: 14px; font-weight: 500; }

        /* Scrollbars */
        .leads-list::-webkit-scrollbar,
        .detail-main::-webkit-scrollbar,
        .chat-messages::-webkit-scrollbar { width: 6px; }
        .leads-list::-webkit-scrollbar-track,
        .detail-main::-webkit-scrollbar-track,
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .leads-list::-webkit-scrollbar-thumb,
        .detail-main::-webkit-scrollbar-thumb,
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.1); border-radius: 10px; }
        .leads-list::-webkit-scrollbar-thumb:hover,
        .detail-main::-webkit-scrollbar-thumb:hover,
        .chat-messages::-webkit-scrollbar-thumb:hover { background: rgba(15,23,42,0.2); }
    `;
    document.head.appendChild(style);
}

// ─── Render: stat chips ───────────────────────────────────────────────────────
function renderStatChips(stats) {
    return `
        <div class="leads-stats-row">
            <div class="stat-chip" onclick="setTypeFilter('business')" title="Filter to business leads">
                <div class="stat-num">${stats.business}</div>
                <div class="stat-lbl">Business</div>
            </div>
            <div class="stat-chip" onclick="setTypeFilter('ad')" title="Leads from paid ads">
                <div class="stat-num">${stats.adLeads}</div>
                <div class="stat-lbl">Ad leads</div>
            </div>
            <div class="stat-chip ${stats.unread > 0 ? 'urgent' : ''}" onclick="setStateFilter('engaged')" title="Unread messages waiting">
                <div class="stat-num">${stats.unread}</div>
                <div class="stat-lbl">Unread</div>
            </div>
            <div class="stat-chip urgent" onclick="setStateFilter('stalled')" title="Leads going cold">
                <div class="stat-num">${stats.urgent}</div>
                <div class="stat-lbl">Going cold</div>
            </div>
            <div class="stat-chip ready-chip" onclick="setStateFilter('engaged')" title="High quality, actively engaged">
                <div class="stat-num">${stats.ready}</div>
                <div class="stat-lbl">Ready to close</div>
            </div>
            <div class="stat-chip" onclick="setTypeFilter('all');setStateFilter('all')" title="All contacts">
                <div class="stat-num">${stats.total}</div>
                <div class="stat-lbl">Total</div>
            </div>
        </div>
    `;
}

// ─── Render: filter tabs ─────────────────────────────────────────────────────
function renderFilterTabs() {
    const states = [
        { id: 'all',      label: 'All' },
        { id: 'engaged',  label: 'Engaged' },
        { id: 'new',      label: 'New' },
        { id: 'stalled',  label: 'Going cold' },
        { id: 'ghosted',  label: 'Ghosted' },
        { id: 'won',      label: 'Won' },
    ];
    const types = [
        { id: 'all',      label: 'All types' },
        { id: 'business', label: 'Business only' },
        { id: 'ad',       label: 'Ad leads' },
        { id: 'personal', label: 'Personal' },
    ];
    return `
        <div class="filter-tabs">
            ${states.map(s => `<div class="ftab ${activeLeadStateFilter === s.id ? 'active' : ''}" onclick="setStateFilter('${s.id}')">${s.label}</div>`).join('')}
            <div style="width:1px;background:rgba(15,23,42,0.05);margin:0 4px;flex-shrink:0"></div>
            ${types.map(t => `<div class="ftab ${activeLeadTypeFilter === t.id ? 'active' : ''}" onclick="setTypeFilter('${t.id}')">${t.label}</div>`).join('')}
        </div>
    `;
}

// ─── Render: single lead row ─────────────────────────────────────────────────
function renderLeadRow(lead) {
    const sc = stateConfig(lead.lead_state);
    const qc = qualityConfig(lead.lead_quality);
    const avatarCls = lead.lead_type === 'personal' ? 'avatar-personal' : 'avatar-business';
    const isActive  = lead.id === activeLeadId;

    return `
        <div class="lead-row ${isActive ? 'active' : ''}" onclick="openLeadDetail(${lead.id})">
            <div class="lead-avatar ${avatarCls}">${lead.name.charAt(0)}</div>
            <div class="lead-row-body">
                <div class="lead-row-top">
                    <span class="lead-name">${lead.name}</span>
                    <div style="display:flex;align-items:center;gap:6px">
                        ${lead.unread_count > 0 ? `<span class="unread-badge">${lead.unread_count}</span>` : ''}
                        <span class="lead-time">${timeAgo(lead.last_seen)}</span>
                    </div>
                </div>
                <div class="lead-preview">${lead.context_summary || lead.customer_intent || lead.phone}</div>
                <div class="lead-tags">
                    <span class="state-pill ${sc.cls}">${sc.label}</span>
                    ${qc ? `<span class="quality-pill ${qc.cls}">${qc.label}</span>` : ''}
                    ${lead.is_ad_lead ? `<span class="ad-badge"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>Ad</span>` : ''}
                    ${(lead.product_interests || []).slice(0,1).map(p => `<span style="font-size:9px;padding:3px 8px;border-radius:6px;background:rgba(40,167,69,0.1);color:#28A745;font-weight:700;text-transform:uppercase;letter-spacing:0.08em">${formatInterest(p)}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

// ─── Render: detail panel ────────────────────────────────────────────────────
function renderDetailPanel(lead) {
    if (!lead) {
        return `
            <div class="detail-empty">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-16 h-16 opacity-30"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                <p>Select a lead to view their complete profile</p>
            </div>
        `;
    }

    const sc = stateConfig(lead.lead_state);
    const qc = qualityConfig(lead.lead_quality);
    const avatarCls = lead.lead_type === 'personal' ? 'avatar-personal' : 'avatar-business';
    const waUrl = `https://wa.me/${lead.phone.replace(/\D/g,'')}`;

    const personalNotice = lead.lead_type === 'personal' ? `
        <div class="personal-notice">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>This contact is classified as a <strong>personal contact</strong> — no buying intent detected. They won't appear in business lead reports or AI follow-up queues.</span>
        </div>` : '';

    const adCard = lead.is_ad_lead ? `
        <div class="detail-section">
            <div class="section-title"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg> Attribution</div>
            <div class="glass-card ad-card">
                ${lead.ad_thumbnail_url
                    ? `<img src="${lead.ad_thumbnail_url}" class="ad-thumb" alt="Ad creative">`
                    : `<div class="ad-thumb-placeholder"><svg class="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>`
                }
                <div style="flex:1;min-width:0">
                    <div class="ad-info-top">
                        <span class="ad-platform-badge">
                            ${lead.ad_platform || 'Meta'}
                        </span>
                    </div>
                    <div class="ad-headline-text">${lead.ad_headline || '—'}</div>
                    <div class="ad-body-text">${(lead.ad_body || '').slice(0, 100)}${(lead.ad_body || '').length > 100 ? '…' : ''}</div>
                </div>
            </div>
        </div>` : '';

    const actionCard = lead.next_action_plan ? `
        <div class="glass-card action-card">
            <div class="action-card-top">
                <span class="action-label"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> Suggested Next Step</span>
                <span class="ai-badge"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg> AI</span>
            </div>
            <div class="action-text">${lead.next_action_plan}</div>
            <div class="action-btns">
                <button class="btn-execute" onclick="alert('Action queued — the Follow-up AI will send this at the optimal time.')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    Queue for AI
                </button>
                <a href="${waUrl}?text=${encodeURIComponent(lead.next_action_plan)}" target="_blank" class="btn-wa">
                    Send now
                </a>
            </div>
        </div>` : '';

    const interests = (lead.product_interests || []).length > 0 ? `
        <div class="detail-section">
            <div class="section-title">Product interest</div>
            <div class="tags-row">
                ${lead.product_interests.map(p => `<span class="interest-tag">${formatInterest(p)}</span>`).join('')}
            </div>
        </div>` : '';

    const cartItems = (lead.cart_state || []).length > 0 ? `
        <div class="detail-section">
            <div class="section-title">Interested in</div>
            <div class="tags-row">
                ${lead.cart_state.map(item => `<span class="cart-tag">${item}</span>`).join('')}
            </div>
        </div>` : '';

    const trustItems = (lead.trust_markers || []).length > 0 ? `
        <div class="detail-section">
            <div class="section-title">Trust markers shown</div>
            <div class="tags-row">
                ${lead.trust_markers.map(m => `<span class="trust-tag"><svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>${m}</span>`).join('')}
            </div>
        </div>` : '';

    const intelBlock = (lead.customer_intent || lead.psychology) ? `
        <div class="detail-section">
            <div class="section-title">Customer Intelligence</div>
            <div class="info-block">
                ${lead.customer_intent ? `<div class="info-row"><span class="info-key">Intent</span><span class="info-val" style="text-align:left;max-width:65%">${lead.customer_intent}</span></div>` : ''}
                ${lead.psychology ? `<div class="info-row"><span class="info-key">Psychology</span><span class="info-val" style="text-align:left;max-width:65%">${lead.psychology}</span></div>` : ''}
                <div class="info-row"><span class="info-key">Stage</span><span class="info-val">${lead.conv_stage || '—'}</span></div>
                <div class="info-row"><span class="info-key">Follow-ups</span><span class="info-val">${lead.follow_up_count || 0}</span></div>
                <div class="info-row"><span class="info-key">Last seen</span><span class="info-val">${timeAgo(lead.last_seen)}</span></div>
            </div>
        </div>` : '';

    const vibeBlock = lead.vibe_check ? `
        <div class="detail-section">
            <div class="section-title">Vibe Check</div>
            <div class="vibe-block">
                <svg class="w-5 h-5 flex-shrink-0 text-slate-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                <span>${lead.vibe_check}</span>
            </div>
        </div>` : '';

    return `
        <div class="detail-main">
            <div class="detail-header">
                <div class="detail-identity">
                    <div class="detail-avatar ${avatarCls}">${lead.name.charAt(0)}</div>
                    <div>
                        <div style="font-size:18px;font-weight:800;color:#0F172A;letter-spacing:-0.02em;">${lead.name}</div>
                        <div style="font-size:13px;color:#64748B;display:flex;align-items:center;gap:10px;margin-top:4px;font-weight:500;">
                            <span>${lead.phone}</span>
                            <span class="state-pill ${sc.cls}">${sc.label}</span>
                            ${qc ? `<span class="quality-pill ${qc.cls}">${qc.label}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="detail-header-actions">
                    <button class="btn-action btn-secondary" onclick="toggleChatPanel()">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                        Chat
                        ${lead.unread_count > 0 ? `<span class="unread-badge">${lead.unread_count}</span>` : ''}
                    </button>
                    <a href="${waUrl}" target="_blank" class="btn-action btn-primary" style="text-decoration:none">
                        Open
                    </a>
                </div>
            </div>

            ${personalNotice}
            ${actionCard}
            ${adCard}
            ${interests}
            ${cartItems}
            ${intelBlock}
            ${trustItems}
            ${vibeBlock}
        </div>
    `;
}

// ─── Render: chat panel ───────────────────────────────────────────────────────
function renderChatPanel(lead) {
    if (!lead || !chatOpen) return `<div class="chat-panel hidden"></div>`;

    const bubbles = (lead.transcript || []).map(t => {
        let wrapCls, bubbleCls, senderLabel;
        if (t.sender === 'AI') {
            wrapCls = 'out'; bubbleCls = 'bubble-ai'; senderLabel = 'AI Assistant';
        } else if (t.sender === 'User') {
            wrapCls = 'out'; bubbleCls = 'bubble-user'; senderLabel = 'You';
        } else {
            wrapCls = 'in'; bubbleCls = 'bubble-lead'; senderLabel = t.sender;
        }
        return `
            <div class="chat-bubble-wrap ${wrapCls}">
                <span class="chat-sender-label">${senderLabel}</span>
                <div class="chat-bubble ${bubbleCls}">${t.msg}</div>
                <span class="chat-time">${t.time}</span>
            </div>
        `;
    }).join('');

    const waUrl = `https://wa.me/${lead.phone.replace(/\D/g,'')}`;

    return `
        <div class="chat-panel">
            <div class="chat-panel-header">
                <div class="chat-panel-title">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
                    Chat — ${lead.name.split(' ')[0]}
                </div>
                <button onclick="toggleChatPanel()" style="background:none;border:none;cursor:pointer;color:#94A3B8;display:flex;align-items:center;transition:color 0.2s" onmouseover="this.style.color='#0F172A'" onmouseout="this.style.color='#94A3B8'">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div class="chat-messages" id="chat-messages-scroll">
                ${bubbles}
            </div>
            <div class="chat-input-area">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
                    <span style="font-size:10px;color:#94A3B8;font-weight:700;text-transform:uppercase;letter-spacing:0.08em">Reply As</span>
                    <div style="display:flex;gap:6px">
                        <span style="font-size:10px;padding:3px 8px;border-radius:6px;background:rgba(40,167,69,0.1);color:#28A745;font-weight:700;cursor:pointer">AI</span>
                        <span style="font-size:10px;padding:3px 8px;border-radius:6px;background:rgba(15,23,42,0.1);color:#0F172A;font-weight:700;cursor:pointer">You</span>
                    </div>
                </div>
                <div class="chat-input-row">
                    <input type="text" placeholder="Type a message…" id="chat-input-box" onkeydown="if(event.key==='Enter')alert('Message queued')">
                    <button class="chat-send-btn" onclick="alert('Message queued')" aria-label="Send message">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    </button>
                </div>
                <div style="text-align:center;margin-top:12px">
                    <a href="${waUrl}" target="_blank" style="font-size:12px;color:#28A745;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:6px">
                        Open in WhatsApp
                    </a>
                </div>
            </div>
        </div>
    `;
}

// ─── State mutations ──────────────────────────────────────────────────────────
function setStateFilter(s) {
    activeLeadStateFilter = s;
    rerenderList();
}
function setTypeFilter(t) {
    activeLeadTypeFilter = t;
    rerenderList();
}
function handleLeadsSearch(query) {
    leadsSearchQuery = query;
    rerenderList();
}

function openLeadDetail(id) {
    activeLeadId = id;
    chatOpen = false;
    rerenderAll();
    setTimeout(() => {
        const el = document.getElementById('chat-messages-scroll');
        if (el) el.scrollTop = el.scrollHeight;
    }, 50);
}

function toggleChatPanel() {
    chatOpen = !chatOpen;
    rerenderAll();
    setTimeout(() => {
        const el = document.getElementById('chat-messages-scroll');
        if (el) el.scrollTop = el.scrollHeight;
    }, 50);
}

// ─── Re-render helpers ────────────────────────────────────────────────────────
function rerenderList() {
    const stats = getLeadStats();
    const statsEl = document.getElementById('leads-stats-container');
    const tabsEl  = document.getElementById('leads-filter-tabs');
    const listEl  = document.getElementById('leads-list-inner');
    if (statsEl) statsEl.innerHTML = renderStatChips(stats);
    if (tabsEl)  tabsEl.innerHTML  = renderFilterTabs();
    if (listEl)  {
        const filtered = getFilteredLeads();
        listEl.innerHTML = filtered.length
            ? filtered.map(renderLeadRow).join('')
            : `<div class="empty-list"><svg class="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg><p>No leads match your filters</p></div>`;
    }
}

function rerenderAll() {
    const lead     = mockLeads.find(l => l.id === activeLeadId) || null;
    const detailEl = document.getElementById('leads-detail-panel');
    const chatEl   = document.getElementById('leads-chat-panel');
    if (detailEl) detailEl.innerHTML = renderDetailPanel(lead);
    if (chatEl)   chatEl.outerHTML   = renderChatPanel(lead);
    rerenderList();
}

// ─── Main render ──────────────────────────────────────────────────────────────
function renderLeadsContent() {
    injectLeadsStyles();

    const contentArea = document.getElementById('content-area');
    contentArea.classList.remove('items-center', 'justify-center', 'p-4', 'overflow-y-auto');
    contentArea.classList.add('overflow-hidden');
    contentArea.style.padding = '0';

    const stats    = getLeadStats();
    const filtered = getFilteredLeads();

    contentArea.innerHTML = `
        <div class="leads-wrap">

            <div class="leads-panel">
                <div class="leads-panel-header">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
                        <span style="font-size:18px;font-weight:800;color:#0F172A;letter-spacing:-0.02em;">Leads</span>
                        <button onclick="openAddLeadModal()" style="display:flex;align-items:center;gap:6px;padding:8px 16px;background:#28A745;color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 10px rgba(40,167,69,0.2);transition:all 0.2s;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='none'">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Add lead
                        </button>
                    </div>
                    <div id="leads-stats-container">${renderStatChips(stats)}</div>
                    <div class="leads-search">
                        <svg class="w-5 h-5 s-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input type="text" placeholder="Search by name, product, intent…" value="${leadsSearchQuery}" oninput="handleLeadsSearch(this.value)">
                    </div>
                    <div id="leads-filter-tabs">${renderFilterTabs()}</div>
                </div>
                <div class="leads-list" id="leads-list-inner">
                    ${filtered.length
                        ? filtered.map(renderLeadRow).join('')
                        : `<div class="empty-list"><svg class="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg><p>No leads match your filters</p></div>`
                    }
                </div>
            </div>

            <div class="detail-panel" id="leads-detail-panel">
                ${renderDetailPanel(null)}
            </div>

            <div id="leads-chat-panel">
                ${renderChatPanel(null)}
            </div>

        </div>
    `;
}

function renderLeadsList() { renderLeadsContent(); }

// ─── Register page config ─────────────────────────────────────────────────────
if (typeof PAGE_CONFIG !== 'undefined') {
    PAGE_CONFIG.leads = {
        title:       'Leads',
        description: 'Manage and track all your leads.',
        navId:       'nav-leads',
        render:      renderLeadsContent
    };
}

// ============================================================================
// CHAT DRAWER PATCH (Slide-out panel for leads)
// ============================================================================

function injectChatDrawer() {
    if (document.getElementById('chat-drawer-container')) return;
    
    // 1. Inject the HTML
    const container = document.createElement('div');
    container.id = 'chat-drawer-container';
    container.innerHTML = `
        <div id="chat-drawer-overlay" class="drawer-overlay" onclick="closeChatDrawer()"></div>
        <div id="leads-chat-drawer" class="leads-chat-drawer">
            <div class="p-4 border-b border-white/60 flex justify-between items-center bg-white/40">
                <div>
                    <h3 id="drawer-lead-name" class="font-bold text-[#0F172A] text-sm tracking-wide">Loading...</h3>
                    <p id="drawer-lead-phone" class="text-[10px] text-[#64748B] font-semibold uppercase mt-0.5">...</p>
                </div>
                <button onclick="closeChatDrawer()" class="w-8 h-8 flex items-center justify-center bg-white rounded-full text-slate-400 hover:text-red-500 hover:scale-105 shadow-sm transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            <div id="drawer-chat-messages" class="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-slate-50/30">
                </div>
            
            <div class="p-4 border-t border-white/60 bg-white/40 backdrop-blur-md">
                <div class="flex gap-2 items-center">
                    <input type="text" placeholder="Send manual message..." class="flex-1 px-4 py-2.5 rounded-xl text-xs bg-white border border-white/90 focus:border-[#28A745] outline-none shadow-inner text-[#0F172A] transition-colors">
                    <button class="w-10 h-10 rounded-xl bg-[#28A745] text-white flex items-center justify-center hover:scale-[1.05] active:scale-95 shadow-lg shadow-[#28A745]/20 transition-all">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(container);
    
    // 2. Inject the CSS
    const style = document.createElement('style');
    style.textContent = `
        .leads-chat-drawer { position: fixed; top: 0; right: -450px; width: 400px; max-width: 90vw; height: 100vh; background: rgba(248,250,252,0.7); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); box-shadow: -10px 0 40px rgba(0,0,0,0.08); z-index: 1000; transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; border-left: 1px solid rgba(255,255,255,0.9); }
        .leads-chat-drawer.open { right: 0; }
        .drawer-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.2); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); z-index: 999; opacity: 0; pointer-events: none; transition: opacity 0.4s ease; }
        .drawer-overlay.open { opacity: 1; pointer-events: auto; }
        #drawer-chat-messages::-webkit-scrollbar { width: 5px; }
        #drawer-chat-messages::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.1); border-radius: 10px; }
    `;
    document.head.appendChild(style);
}

// 3. Drawer Controls
window.openChatDrawer = (leadId) => {
    injectChatDrawer();
    
    // Mock DB fetch (replace with actual fetch from messages table)
    const lead = mockLeads.find(l => l.id === leadId) || { name: "Unknown Lead", phone: "N/A" };
    
    document.getElementById('drawer-lead-name').textContent = lead.name;
    document.getElementById('drawer-lead-phone').textContent = lead.phone;
    
    const messagesContainer = document.getElementById('drawer-chat-messages');
    messagesContainer.innerHTML = `
        <div class="text-center text-[10px] font-bold tracking-wider uppercase text-[#94A3B8] my-2">Chat History Pulled</div>
        
        <div class="self-start max-w-[85%] animate-in slide-in-from-left-2 duration-300">
            <span class="text-[9px] font-extrabold uppercase tracking-wide text-[#94A3B8] ml-1">HeySasa AI</span>
            <div class="bg-white border border-white/60 p-3 rounded-2xl rounded-tl-sm text-[13px] leading-relaxed text-[#0F172A] shadow-sm mt-1">
                Hello ${lead.name.split(' ')[0]}! I saw you were looking at our latest offers. How can I assist?
            </div>
            <span class="text-[9px] text-[#94A3B8] font-semibold mt-1 px-1 block">10:02 AM</span>
        </div>
        
        <div class="self-end max-w-[85%] flex flex-col items-end animate-in slide-in-from-right-2 duration-300">
            <span class="text-[9px] font-extrabold uppercase tracking-wide text-[#94A3B8] mr-1">Lead</span>
            <div class="bg-[#0F172A] text-white p-3 rounded-2xl rounded-tr-sm text-[13px] leading-relaxed shadow-md mt-1 border border-slate-700">
                Yes, can I get the pricing list?
            </div>
            <span class="text-[9px] text-[#94A3B8] font-semibold mt-1 px-1 block">10:05 AM</span>
        </div>
    `;
    
    // Trigger animations
    requestAnimationFrame(() => {
        document.getElementById('chat-drawer-overlay').classList.add('open');
        document.getElementById('leads-chat-drawer').classList.add('open');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
};

window.closeChatDrawer = () => {
    document.getElementById('chat-drawer-overlay').classList.remove('open');
    document.getElementById('leads-chat-drawer').classList.remove('open');
};