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
        ad_thumbnail_url: "https://placehold.co/60x60/1D9E75/ffffff?text=AD",
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
        ad_thumbnail_url: "https://placehold.co/60x60/1D9E75/ffffff?text=AD",
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
        ad_thumbnail_url: "https://placehold.co/60x60/1D9E75/ffffff?text=AD",
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
        .leads-wrap { display: flex; height: calc(100vh - 64px); overflow: hidden; background: #f7f7f5; }
        .leads-panel { width: 380px; min-width: 320px; flex-shrink: 0; display: flex; flex-direction: column; border-right: 1px solid #e8e6e0; background: #fff; }
        .leads-panel-header { padding: 20px 16px 0; flex-shrink: 0; }
        .leads-stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px; }
        .stat-chip { background: #f7f7f5; border-radius: 10px; padding: 10px 10px 8px; cursor: pointer; transition: background 0.15s; border: 1.5px solid transparent; }
        .stat-chip:hover { background: #f0efe9; }
        .stat-chip.active { background: #eaf3de; border-color: #97C459; }
        .stat-chip .stat-num { font-size: 22px; font-weight: 600; color: #1a1a18; line-height: 1; }
        .stat-chip .stat-lbl { font-size: 10px; color: #888780; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 3px; }
        .stat-chip.urgent .stat-num { color: #BA7517; }
        .stat-chip.ready-chip .stat-num  { color: #3B6D11; }
        .leads-search { position: relative; margin-bottom: 10px; }
        .leads-search input { width: 100%; padding: 9px 12px 9px 36px; background: #f7f7f5; border: 1px solid #e8e6e0; border-radius: 10px; font-size: 13px; color: #1a1a18; outline: none; box-sizing: border-box; }
        .leads-search input:focus { border-color: #97C459; background: #fff; }
        .leads-search .s-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #888780; font-size: 16px; }
        .filter-tabs { display: flex; gap: 4px; padding: 0 0 10px; overflow-x: auto; scrollbar-width: none; }
        .filter-tabs::-webkit-scrollbar { display: none; }
        .ftab { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 500; color: #888780; background: transparent; border: 1px solid transparent; cursor: pointer; white-space: nowrap; transition: all 0.15s; }
        .ftab:hover { background: #f7f7f5; color: #444441; }
        .ftab.active { background: #1a1a18; color: #fff; border-color: #1a1a18; }
        .leads-list { flex: 1; overflow-y: auto; padding: 0 8px 16px; }
        .lead-row { display: flex; align-items: flex-start; gap: 10px; padding: 10px 10px; border-radius: 10px; cursor: pointer; transition: background 0.12s; margin-bottom: 2px; position: relative; border: 1.5px solid transparent; }
        .lead-row:hover { background: #f7f7f5; }
        .lead-row.active { background: #eaf3de; border-color: #97C459; }
        .lead-avatar { width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; }
        .avatar-business { background: #eaf3de; color: #3B6D11; }
        .avatar-personal { background: #f1efe8; color: #5F5E5A; }
        .lead-row-body { flex: 1; min-width: 0; }
        .lead-row-top { display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 2px; }
        .lead-name { font-size: 13px; font-weight: 600; color: #1a1a18; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .lead-time { font-size: 10px; color: #b4b2a9; flex-shrink: 0; }
        .lead-preview { font-size: 12px; color: #888780; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px; }
        .lead-tags { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
        .state-pill { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 2px 6px; border-radius: 4px; }
        .state-engaged  { background: #eaf3de; color: #3B6D11; }
        .state-new      { background: #e6f1fb; color: #185FA5; }
        .state-warm     { background: #faeeda; color: #854F0B; }
        .state-stalled  { background: #faeeda; color: #BA7517; }
        .state-ghosted  { background: #f1efe8; color: #5F5E5A; }
        .state-won      { background: #eaf3de; color: #27500A; }
        .state-lost     { background: #fcebeb; color: #A32D2D; }
        .state-personal { background: #f1efe8; color: #888780; }
        .quality-hot    { background: #fcebeb; color: #A32D2D; }
        .quality-warm   { background: #faeeda; color: #854F0B; }
        .quality-cold   { background: #e6f1fb; color: #185FA5; }
        .quality-pill   { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 2px 6px; border-radius: 4px; }
        .ad-badge { display: flex; align-items: center; gap: 3px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 2px 6px; border-radius: 4px; background: #eeedfe; color: #534AB7; }
        .unread-dot { width: 7px; height: 7px; border-radius: 50%; background: #639922; flex-shrink: 0; margin-top: 5px; }
        .unread-badge { min-width: 16px; height: 16px; border-radius: 8px; background: #639922; color: #fff; font-size: 9px; font-weight: 700; display: flex; align-items: center; justify-content: center; padding: 0 4px; }

        /* Detail panel */
        .detail-panel { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .detail-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #b4b2a9; gap: 10px; }
        .detail-empty i { font-size: 40px; }
        .detail-empty p { font-size: 13px; }
        .detail-main { flex: 1; overflow-y: auto; padding: 24px; }
        .detail-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #e8e6e0; }
        .detail-identity { display: flex; align-items: center; gap: 14px; }
        .detail-avatar { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; flex-shrink: 0; }
        .detail-header-actions { display: flex; gap: 8px; }
        .btn-action { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1.5px solid transparent; transition: all 0.15s; }
        .btn-primary { background: #3B6D11; color: #fff; border-color: #3B6D11; }
        .btn-primary:hover { background: #27500A; }
        .btn-secondary { background: #fff; color: #444441; border-color: #e8e6e0; }
        .btn-secondary:hover { background: #f7f7f5; }

        /* Next action card */
        .action-card { background: #fffbf0; border: 1.5px solid #FAC775; border-radius: 12px; padding: 16px; margin-bottom: 20px; }
        .action-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .action-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #854F0B; display: flex; align-items: center; gap: 5px; }
        .ai-badge { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 2px 7px; border-radius: 4px; background: #faeeda; color: #854F0B; display: flex; align-items: center; gap: 3px; }
        .action-text { font-size: 13px; color: #412402; font-weight: 500; margin-bottom: 14px; line-height: 1.5; }
        .action-btns { display: flex; gap: 8px; }
        .btn-execute { flex: 1; padding: 9px; border-radius: 8px; background: #BA7517; color: #fff; font-size: 12px; font-weight: 700; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.15s; }
        .btn-execute:hover { background: #854F0B; }
        .btn-wa { padding: 9px 14px; border-radius: 8px; background: #eaf3de; color: #3B6D11; font-size: 12px; font-weight: 700; border: 1.5px solid #C0DD97; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.15s; text-decoration: none; }
        .btn-wa:hover { background: #C0DD97; }

        /* Ad attribution card */
        .ad-card { background: #eeedfe; border: 1px solid #AFA9EC; border-radius: 12px; padding: 14px; margin-bottom: 20px; display: flex; gap: 12px; align-items: flex-start; }
        .ad-thumb { width: 52px; height: 52px; border-radius: 8px; object-fit: cover; flex-shrink: 0; border: 1px solid #AFA9EC; }
        .ad-thumb-placeholder { width: 52px; height: 52px; border-radius: 8px; flex-shrink: 0; background: #CEC BF6; display: flex; align-items: center; justify-content: center; border: 1px solid #AFA9EC; }
        .ad-info-top { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
        .ad-platform-badge { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 2px 6px; border-radius: 4px; background: #CECBF6; color: #3C3489; display: flex; align-items: center; gap: 3px; }
        .ad-headline-text { font-size: 12px; font-weight: 600; color: #3C3489; line-height: 1.4; margin-bottom: 3px; }
        .ad-body-text { font-size: 11px; color: #534AB7; line-height: 1.4; }
        .ad-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #534AB7; margin-bottom: 8px; display: flex; align-items: center; gap: 4px; }

        /* Section blocks */
        .detail-section { margin-bottom: 16px; }
        .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #b4b2a9; margin-bottom: 8px; }
        .info-block { background: #f7f7f5; border-radius: 10px; padding: 12px 14px; }
        .info-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; padding: 5px 0; border-bottom: 1px solid #eeede8; font-size: 12px; }
        .info-row:last-child { border-bottom: none; }
        .info-key { color: #888780; flex-shrink: 0; }
        .info-val { color: #1a1a18; font-weight: 500; text-align: right; }
        .tags-row { display: flex; flex-wrap: wrap; gap: 5px; }
        .interest-tag { font-size: 11px; padding: 3px 8px; border-radius: 5px; background: #eaf3de; color: #3B6D11; border: 1px solid #C0DD97; font-weight: 500; }
        .trust-tag { font-size: 11px; padding: 3px 8px; border-radius: 5px; background: #e6f1fb; color: #185FA5; border: 1px solid #B5D4F4; font-weight: 500; }
        .cart-tag { font-size: 11px; padding: 3px 8px; border-radius: 5px; background: #fff; color: #444441; border: 1px solid #d3d1c7; font-weight: 500; }
        .psychology-block { background: #f7f7f5; border-radius: 10px; padding: 12px 14px; font-size: 12px; color: #444441; line-height: 1.6; }
        .vibe-block { background: #f7f7f5; border-radius: 10px; padding: 12px 14px; font-size: 12px; color: #5F5E5A; line-height: 1.6; font-style: italic; display: flex; gap: 8px; }

        /* Chat panel */
        .chat-panel { width: 340px; min-width: 300px; flex-shrink: 0; border-left: 1px solid #e8e6e0; background: #fff; display: flex; flex-direction: column; transition: width 0.25s, min-width 0.25s; overflow: hidden; }
        .chat-panel.hidden { width: 0; min-width: 0; border-left: none; }
        .chat-panel-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 14px 10px; border-bottom: 1px solid #e8e6e0; flex-shrink: 0; }
        .chat-panel-title { font-size: 12px; font-weight: 700; color: #1a1a18; display: flex; align-items: center; gap: 6px; }
        .chat-messages { flex: 1; overflow-y: auto; padding: 14px 12px; display: flex; flex-direction: column; gap: 10px; }
        .chat-bubble-wrap { display: flex; flex-direction: column; }
        .chat-bubble-wrap.out { align-items: flex-end; }
        .chat-bubble-wrap.in  { align-items: flex-start; }
        .chat-sender-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #b4b2a9; margin-bottom: 3px; padding: 0 4px; }
        .chat-bubble { max-width: 82%; padding: 9px 12px; border-radius: 14px; font-size: 12px; line-height: 1.5; }
        .bubble-lead  { background: #f0efe9; color: #1a1a18; border-bottom-left-radius: 4px; }
        .bubble-ai    { background: #BA7517; color: #fff; border-bottom-right-radius: 4px; }
        .bubble-user  { background: #3B6D11; color: #fff; border-bottom-right-radius: 4px; }
        .chat-time    { font-size: 9px; color: #b4b2a9; margin-top: 3px; padding: 0 4px; }
        .chat-input-area { padding: 10px 12px 14px; border-top: 1px solid #e8e6e0; flex-shrink: 0; }
        .chat-input-row { display: flex; gap: 8px; align-items: center; }
        .chat-input-row input { flex: 1; padding: 8px 12px; background: #f7f7f5; border: 1px solid #e8e6e0; border-radius: 20px; font-size: 12px; outline: none; }
        .chat-input-row input:focus { border-color: #97C459; background: #fff; }
        .chat-send-btn { width: 32px; height: 32px; border-radius: 50%; background: #3B6D11; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }

        /* Personal lead overlay */
        .personal-notice { background: #f7f7f5; border: 1px solid #d3d1c7; border-radius: 10px; padding: 12px 14px; margin-bottom: 16px; font-size: 12px; color: #888780; display: flex; gap: 8px; align-items: flex-start; line-height: 1.5; }

        /* Empty state */
        .empty-list { text-align: center; padding: 40px 20px; color: #b4b2a9; }
        .empty-list i { font-size: 32px; display: block; margin-bottom: 8px; }
        .empty-list p { font-size: 12px; }

        /* Scrollbars */
        .leads-list::-webkit-scrollbar,
        .detail-main::-webkit-scrollbar,
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .leads-list::-webkit-scrollbar-track,
        .detail-main::-webkit-scrollbar-track,
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .leads-list::-webkit-scrollbar-thumb,
        .detail-main::-webkit-scrollbar-thumb,
        .chat-messages::-webkit-scrollbar-thumb { background: #d3d1c7; border-radius: 2px; }
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
            <div style="width:1px;background:#e8e6e0;margin:0 2px;flex-shrink:0"></div>
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
                    <div style="display:flex;align-items:center;gap:4px">
                        ${lead.unread_count > 0 ? `<span class="unread-badge">${lead.unread_count}</span>` : ''}
                        <span class="lead-time">${timeAgo(lead.last_seen)}</span>
                    </div>
                </div>
                <div class="lead-preview">${lead.context_summary || lead.customer_intent || lead.phone}</div>
                <div class="lead-tags">
                    <span class="state-pill ${sc.cls}">${sc.label}</span>
                    ${qc ? `<span class="quality-pill ${qc.cls}">${qc.label}</span>` : ''}
                    ${lead.is_ad_lead ? `<span class="ad-badge"><i class="ti ${platformIcon(lead.ad_platform)}" style="font-size:10px" aria-hidden="true"></i>Ad</span>` : ''}
                    ${(lead.product_interests || []).slice(0,1).map(p => `<span style="font-size:9px;padding:2px 5px;border-radius:4px;background:#eaf3de;color:#3B6D11;font-weight:600">${formatInterest(p)}</span>`).join('')}
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
                <i class="ti ti-user-search" aria-hidden="true"></i>
                <p>Select a lead to see their full profile</p>
            </div>
        `;
    }

    const sc = stateConfig(lead.lead_state);
    const qc = qualityConfig(lead.lead_quality);
    const avatarCls = lead.lead_type === 'personal' ? 'avatar-personal' : 'avatar-business';
    const waUrl = `https://wa.me/${lead.phone.replace(/\D/g,'')}`;

    const personalNotice = lead.lead_type === 'personal' ? `
        <div class="personal-notice">
            <i class="ti ti-info-circle" style="font-size:16px;flex-shrink:0;margin-top:1px" aria-hidden="true"></i>
            <span>This contact is classified as a <strong>personal contact</strong> — no buying intent detected. They won't appear in business lead reports or AI follow-up queues.</span>
        </div>` : '';

    const adCard = lead.is_ad_lead ? `
        <div class="detail-section">
            <div class="section-title"><i class="ti ti-speakerphone" style="font-size:12px;vertical-align:-1px" aria-hidden="true"></i> Ad this lead came from</div>
            <div class="ad-card">
                ${lead.ad_thumbnail_url
                    ? `<img src="${lead.ad_thumbnail_url}" class="ad-thumb" alt="Ad creative">`
                    : `<div class="ad-thumb-placeholder"><i class="ti ti-photo" style="font-size:22px;color:#AFA9EC" aria-hidden="true"></i></div>`
                }
                <div style="flex:1;min-width:0">
                    <div class="ad-info-top">
                        <span class="ad-platform-badge">
                            <i class="ti ${platformIcon(lead.ad_platform)}" style="font-size:10px" aria-hidden="true"></i>
                            ${lead.ad_platform || 'Meta'}
                        </span>
                    </div>
                    <div class="ad-headline-text">${lead.ad_headline || '—'}</div>
                    <div class="ad-body-text">${(lead.ad_body || '').slice(0, 100)}${(lead.ad_body || '').length > 100 ? '…' : ''}</div>
                </div>
            </div>
        </div>` : '';

    const actionCard = lead.next_action_plan ? `
        <div class="action-card">
            <div class="action-card-top">
                <span class="action-label"><i class="ti ti-bolt" style="font-size:13px" aria-hidden="true"></i> Suggested next step</span>
                <span class="ai-badge"><i class="ti ti-sparkles" style="font-size:10px" aria-hidden="true"></i> AI</span>
            </div>
            <div class="action-text">${lead.next_action_plan}</div>
            <div class="action-btns">
                <button class="btn-execute" onclick="alert('Action queued — the Follow-up AI will send this at the optimal time.')">
                    <i class="ti ti-send" style="font-size:14px" aria-hidden="true"></i>
                    Queue for AI
                </button>
                <a href="${waUrl}?text=${encodeURIComponent(lead.next_action_plan)}" target="_blank" class="btn-wa">
                    <i class="ti ti-brand-whatsapp" style="font-size:14px" aria-hidden="true"></i>
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
                ${lead.trust_markers.map(m => `<span class="trust-tag"><i class="ti ti-shield-check" style="font-size:11px;margin-right:3px;vertical-align:-1px" aria-hidden="true"></i>${m}</span>`).join('')}
            </div>
        </div>` : '';

    const intelBlock = (lead.customer_intent || lead.psychology) ? `
        <div class="detail-section">
            <div class="section-title">Customer intelligence</div>
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
            <div class="section-title">Vibe check</div>
            <div class="vibe-block">
                <i class="ti ti-eye" style="font-size:15px;flex-shrink:0;margin-top:2px;color:#888780" aria-hidden="true"></i>
                <span>${lead.vibe_check}</span>
            </div>
        </div>` : '';

    return `
        <div class="detail-main">
            <div class="detail-header">
                <div class="detail-identity">
                    <div class="detail-avatar ${avatarCls}">${lead.name.charAt(0)}</div>
                    <div>
                        <div style="font-size:16px;font-weight:700;color:#1a1a18">${lead.name}</div>
                        <div style="font-size:12px;color:#888780;display:flex;align-items:center;gap:8px;margin-top:2px">
                            <span>${lead.phone}</span>
                            <span class="state-pill ${sc.cls}">${sc.label}</span>
                            ${qc ? `<span class="quality-pill ${qc.cls}">${qc.label}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="detail-header-actions">
                    <button class="btn-action btn-secondary" onclick="toggleChatPanel()" style="gap:5px">
                        <i class="ti ti-message-2" style="font-size:14px" aria-hidden="true"></i>
                        Chat
                        ${lead.unread_count > 0 ? `<span class="unread-badge">${lead.unread_count}</span>` : ''}
                    </button>
                    <a href="${waUrl}" target="_blank" class="btn-action btn-primary" style="text-decoration:none">
                        <i class="ti ti-brand-whatsapp" style="font-size:14px" aria-hidden="true"></i>
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
                    <i class="ti ti-message-2" style="font-size:15px" aria-hidden="true"></i>
                    Conversation — ${lead.name.split(' ')[0]}
                </div>
                <button onclick="toggleChatPanel()" style="background:none;border:none;cursor:pointer;color:#888780;font-size:18px;display:flex;align-items:center">
                    <i class="ti ti-x" aria-label="Close chat"></i>
                </button>
            </div>
            <div class="chat-messages" id="chat-messages-scroll">
                ${bubbles}
            </div>
            <div class="chat-input-area">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
                    <span style="font-size:10px;color:#888780;font-weight:600;text-transform:uppercase;letter-spacing:0.06em">Reply as</span>
                    <div style="display:flex;gap:4px">
                        <span style="font-size:10px;padding:2px 8px;border-radius:4px;background:#faeeda;color:#854F0B;font-weight:600;cursor:pointer">AI</span>
                        <span style="font-size:10px;padding:2px 8px;border-radius:4px;background:#eaf3de;color:#3B6D11;font-weight:600;cursor:pointer">You</span>
                    </div>
                </div>
                <div class="chat-input-row">
                    <input type="text" placeholder="Type a message…" id="chat-input-box" onkeydown="if(event.key==='Enter')alert('Message queued')">
                    <button class="chat-send-btn" onclick="alert('Message queued')" aria-label="Send message">
                        <i class="ti ti-send" style="font-size:14px" aria-hidden="true"></i>
                    </button>
                </div>
                <div style="text-align:center;margin-top:8px">
                    <a href="${waUrl}" target="_blank" style="font-size:11px;color:#3B6D11;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:4px">
                        <i class="ti ti-brand-whatsapp" style="font-size:13px" aria-hidden="true"></i>
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
    // Scroll chat to bottom after render
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
            : `<div class="empty-list"><i class="ti ti-search-off" aria-hidden="true"></i><p>No leads match your filters</p></div>`;
    }
}

function rerenderAll() {
    const lead     = mockLeads.find(l => l.id === activeLeadId) || null;
    const detailEl = document.getElementById('leads-detail-panel');
    const chatEl   = document.getElementById('leads-chat-panel');
    if (detailEl) detailEl.innerHTML = renderDetailPanel(lead);
    if (chatEl)   chatEl.outerHTML   = renderChatPanel(lead);
    // Re-attach chat panel reference after outerHTML swap
    rerenderList();
}

// ─── Main render ──────────────────────────────────────────────────────────────
function renderLeadsContent() {
    injectLeadsStyles();

    const contentArea = document.getElementById('content-area');
    contentArea.classList.remove('items-center', 'justify-center', 'p-4', 'overflow-y-auto');
    contentArea.classList.add('overflow-hidden');
    contentArea.style.padding = '0';
    contentArea.style.height  = 'calc(100vh - 64px)';

    const stats    = getLeadStats();
    const filtered = getFilteredLeads();

    contentArea.innerHTML = `
        <div class="leads-wrap">

            <!-- Left: lead list -->
            <div class="leads-panel">
                <div class="leads-panel-header">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
                        <span style="font-size:15px;font-weight:700;color:#1a1a18">Leads</span>
                        <button onclick="openAddLeadModal()" style="display:flex;align-items:center;gap:5px;padding:6px 12px;background:#3B6D11;color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer">
                            <i class="ti ti-plus" style="font-size:13px" aria-hidden="true"></i> Add lead
                        </button>
                    </div>
                    <div id="leads-stats-container">${renderStatChips(stats)}</div>
                    <div class="leads-search">
                        <i class="ti ti-search s-icon" aria-hidden="true"></i>
                        <input type="text" placeholder="Search by name, product, intent…" value="${leadsSearchQuery}" oninput="handleLeadsSearch(this.value)">
                    </div>
                    <div id="leads-filter-tabs">${renderFilterTabs()}</div>
                </div>
                <div class="leads-list" id="leads-list-inner">
                    ${filtered.length
                        ? filtered.map(renderLeadRow).join('')
                        : `<div class="empty-list"><i class="ti ti-search-off" aria-hidden="true"></i><p>No leads match your filters</p></div>`
                    }
                </div>
            </div>

            <!-- Middle: detail panel -->
            <div class="detail-panel" id="leads-detail-panel">
                ${renderDetailPanel(null)}
            </div>

            <!-- Right: chat panel (hidden until toggled) -->
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