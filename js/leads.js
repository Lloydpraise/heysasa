// ─── Follow-up sequence template (11 steps) ──────────────────────────────────
const DEFAULT_SEQUENCE = [
  { step: 1,  name: 'First Impression',    type: 'product_reminder',    klt: 'Know',    delay_days: 1, desc: 'Reference exactly what they were interested in.' },
  { step: 2,  name: 'Social Proof',        type: 'social_proof',        klt: 'Know',    delay_days: 2, desc: 'Share a real customer story or testimonial.' },
  { step: 3,  name: 'Free Value',          type: 'value_tip',           klt: 'Like',    delay_days: 2, desc: 'Give one genuinely useful tip. No pitch.' },
  { step: 4,  name: 'Expert Insight',      type: 'expert_authority',    klt: 'Like',    delay_days: 3, desc: 'Position the business as the go-to expert.' },
  { step: 5,  name: 'Personalised Offer',  type: 'offer',               klt: 'Like',    delay_days: 3, desc: 'A specific offer tied to their interest.' },
  { step: 6,  name: 'New Angle',           type: 'new_angle',           klt: 'Trust',   delay_days: 3, desc: 'Approach their need from a different angle.' },
  { step: 7,  name: 'Deep Expertise',      type: 'proprietary_content', klt: 'Trust',   delay_days: 4, desc: 'Share business knowledge from the owner.' },
  { step: 8,  name: 'FOMO',               type: 'fomo',                klt: 'Trust',   delay_days: 4, desc: 'Social proof + availability signal.' },
  { step: 9,  name: 'Check In',            type: 'soft_checkin',        klt: 'Trust',   delay_days: 5, desc: 'A warm human check-in. No pitch.' },
  { step: 10, name: 'Final Offer',         type: 'final_offer',         klt: 'Convert', delay_days: 3, desc: 'Best offer. Last one.' },
  { step: 11, name: 'See You Around',      type: 'graceful_exit',       klt: 'Convert', delay_days: 4, desc: 'Warm goodbye. Door always open.' }
];

const KLT_CONFIG = {
  Know:    { color: '#64748B', bg: 'rgba(100,116,139,0.1)'  },
  Like:    { color: '#0F172A', bg: 'rgba(15,23,42,0.08)'    },
  Trust:   { color: '#374151', bg: 'rgba(55,65,81,0.1)'     },
  Convert: { color: '#166534', bg: 'rgba(22,101,52,0.1)'    }
};

const TOUCHPOINT_ICONS = {
  product_reminder:    `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 2" stroke-linecap="round"/></svg>`,
  social_proof:        `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 2l1.8 3.6 4 .6-2.9 2.8.7 4L8 11l-3.6 1.9.7-4L2.1 6.2l4-.6z" stroke-linejoin="round"/></svg>`,
  value_tip:           `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="7" r="4"/><path d="M8 11v2M6 14h4" stroke-linecap="round"/></svg>`,
  expert_authority:    `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="12" height="9" rx="1.5"/><path d="M5 14h6M8 11v3" stroke-linecap="round"/></svg>`,
  offer:               `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="12" height="9" rx="1.5"/><path d="M5 5V3.5a3 3 0 016 0V5" stroke-linecap="round"/></svg>`,
  new_angle:           `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 3l-3 3M3 13l3-3M13 3H9M13 3v4M3 13h4M3 13V9" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  proprietary_content: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="2" width="10" height="12" rx="1.5"/><path d="M5 6h6M5 9h4" stroke-linecap="round"/></svg>`,
  fomo:                `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 2v1M8 13v1M2 8h1M13 8h1M4.2 4.2l.7.7M11.1 11.1l.7.7M4.2 11.8l.7-.7M11.1 4.9l.7-.7"/><circle cx="8" cy="8" r="3"/></svg>`,
  soft_checkin:        `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 2a4 4 0 100 5.5" stroke-linecap="round"/><path d="M2 14s0-4 6-4 6 4 6 4" stroke-linecap="round"/></svg>`,
  final_offer:         `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8l3 3 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  graceful_exit:       `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 8h7M11 6l2 2-2 2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 4V3a1 1 0 00-1-1H3a1 1 0 00-1 1v10a1 1 0 001 1h5a1 1 0 001-1v-1" stroke-linecap="round"/></svg>`
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const ICON = {
  search:   `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="9" r="6"/><path d="M15 15l-3.5-3.5" stroke-linecap="round"/></svg>`,
  filter:   `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 5h14M6 10h8M9 15h2" stroke-linecap="round"/></svg>`,
  chat:     `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square-text-icon lucide-message-square-text"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/><path d="M7 11h10"/><path d="M7 15h6"/><path d="M7 7h8"/></svg>`,
  phone:    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone-outgoing-icon lucide-phone-outgoing"><path d="m16 8 6-6"/><path d="M22 8V2h-6"/><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/></svg>`,
  wa:       `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10" cy="10" r="8"/><path d="M7 11.5c.7 1.4 2 2.3 3.5 2.3 2.2 0 4-1.8 4-4s-1.8-4-4-4a4 4 0 00-3.9 3.1L5 13l3.5-.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  person:   `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10" cy="6" r="3"/><path d="M3 17s0-5 7-5 7 5 7 5" stroke-linecap="round"/></svg>`,
  check:    `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10l4 4 8-8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  x:        `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 5l10 10M15 5L5 15" stroke-linecap="round"/></svg>`,
  chevron:  `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 7l5 5 5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  send:     `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M17 3L3 9l5 2 2 5 7-14z" stroke-linejoin="round"/></svg>`,
  edit:     `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M13 3l4 4-10 10H3v-4L13 3z" stroke-linejoin="round"/></svg>`,
  refresh:  `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12a6 6 0 1010.7-3.7" stroke-linecap="round"/><path d="M15 5v4h-4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  inbox:    `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 8h14M3 8v7a2 2 0 002 2h10a2 2 0 002-2V8M3 8l2-5h10l2 5M8 12h4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  coin:     `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10" cy="10" r="7"/><path d="M10 7v6M8 9h2.5a1.5 1.5 0 010 3H8" stroke-linecap="round"/></svg>`,
  list:     `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 6h12M4 10h12M4 14h8" stroke-linecap="round"/></svg>`,
  ad:       `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="4" width="16" height="12" rx="2"/><path d="M7 13V9l3 3 3-3v4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  arrow:    `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 10h12M10 4l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  plus:     `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 4v12M4 10h12" stroke-linecap="round"/></svg>`,
  eye:      `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><ellipse cx="10" cy="10" rx="8" ry="5"/><circle cx="10" cy="10" r="2"/></svg>`,
  clock:    `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10" cy="10" r="7"/><path d="M10 6v4l2.5 2.5" stroke-linecap="round"/></svg>`,
  warn:     `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10 3L2 17h16L10 3z" stroke-linejoin="round"/><path d="M10 9v4M10 15v.5" stroke-linecap="round"/></svg>`,
  tag:      `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10.5 2H5a1 1 0 00-1 1v5.5a1 1 0 00.3.7l7.5 7.5a2 2 0 002.8 0l3-3a2 2 0 000-2.8L10.5 2z" stroke-linejoin="round"/><circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none"/></svg>`,
  cart:     `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 2h2l1.5 8h9l1.5-5H6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="17" r="1.2"/><circle cx="14" cy="17" r="1.2"/></svg>`,
  brain:    `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 10a3 3 0 013-3h4a3 3 0 013 3 3 3 0 01-3 3H8a3 3 0 01-3-3z"/><path d="M8 7V5.5a2.5 2.5 0 015 0V7M8 13v1.5a2.5 2.5 0 005 0V13M5 10H3.5a2 2 0 000 4H5M15 10h1.5a2 2 0 000 4H15M5 10H3.5a2 2 0 010-4H5M15 10h1.5a2 2 0 010-4H15" stroke-linecap="round"/></svg>`,
  spark:    `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10 2l2 6h6l-5 3.6 1.9 6L10 14l-4.9 3.6L7 11.6 2 8h6z" stroke-linejoin="round"/></svg>`,
};

// ─── Mock data ────────────────────────────────────────────────────────────────
let mockLeads = [
  {
    id: 1,
    name: "Sarah Wambui",
    phone: "+254 712 345 678",
    lead_state: "engaged",
    lead_type: "business",
    is_ad_lead: true,
    ad_headline: "Power Your Home 24/7 — Solar Backup Systems",
    ad_body: "Never lose power again. Our 5kW solar inverter + lithium battery keeps you running day and night. Installation in 4 hours.",
    ad_thumbnail_url: "https://placehold.co/60x60/1a1a1a/ffffff?text=AD",
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
    context_summary: "5kW system for home office. Blocker: installation time. Has budget.",
    follow_up_count: 2,
    last_seen: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    unread_count: 2,
    cart_state: ["Solar Inverter 5kW", "Lithium Battery 200Ah"],
    is_business_chat: true,
    followup: {
      status: 'opted_in',
      current_step: 2,
      pending_approval: true,
      draft: "Sarah, wanted to share something real — James from Lavington installed our 5kW system last month. He works from home just like you and told us it was the best investment he'd made all year. Want me to send you his full story?",
      sent_steps: [1],
      next_due: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
      sequence_started: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
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
    ad_thumbnail_url: "https://placehold.co/60x60/1a1a1a/ffffff?text=AD",
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
    context_summary: "Evaluating solar vs generator. Needs data-driven nudge.",
    follow_up_count: 1,
    last_seen: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    unread_count: 0,
    cart_state: ["Solar Inverter 3kW"],
    is_business_chat: true,
    followup: {
      status: 'opted_in',
      current_step: 1,
      pending_approval: false,
      draft: null,
      sent_steps: [],
      next_due: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
      sequence_started: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
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
    ad_thumbnail_url: "https://placehold.co/60x60/1a1a1a/ffffff?text=AD",
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
    context_summary: "Relocating to Nairobi. Needs 2BR furnished, Westlands. Budget TBD.",
    follow_up_count: 0,
    last_seen: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    unread_count: 1,
    cart_state: ["2BR Furnished — Westlands"],
    is_business_chat: true,
    followup: {
      status: 'not_enrolled',
      current_step: 0,
      pending_approval: false,
      draft: null,
      sent_steps: [],
      next_due: null,
      sequence_started: null
    },
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
    ad_headline: null, ad_body: null, ad_thumbnail_url: null, ad_platform: null, original_ad_id: null,
    product_interests: ["solar_energy", "financial_services"],
    lead_quality: "warm",
    conv_stage: "Ghosted After Quote",
    customer_intent: "Was interested in solar, went quiet after receiving quote.",
    next_action_plan: "Send a no-pressure check-in. Offer flexible payment plan.",
    psychology: "May have had budget shock. Needs softer re-entry.",
    trust_markers: ["KRA Verified"],
    vibe_check: "Was warm, then disappeared. Likely comparing prices elsewhere.",
    context_summary: "Received quote for 5kW. No response in 8 days. Price-conscious.",
    follow_up_count: 3,
    last_seen: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    unread_count: 0,
    cart_state: ["Solar Inverter 5kW"],
    is_business_chat: true,
    followup: {
      status: 'opted_in',
      current_step: 3,
      pending_approval: true,
      draft: "Kevin, quick one — we've been helping a few people with the same budget concern. We now have a 12-month payment plan where you start at KES 14,500/month. No hidden fees. Wanted you to hear about it before slots fill up this week.",
      sent_steps: [1, 2],
      next_due: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      sequence_started: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
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
    ad_body: "Never lose power again. Our 5kW solar inverter + lithium battery keeps you running day and night.",
    ad_thumbnail_url: "https://placehold.co/60x60/1a1a1a/ffffff?text=AD",
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
    context_summary: "Converted. Paid in full. Installation done. Very happy.",
    follow_up_count: 1,
    last_seen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    unread_count: 0,
    cart_state: ["Solar Inverter 5kW", "Lithium Battery 200Ah"],
    is_business_chat: true,
    followup: {
      status: 'completed',
      current_step: 11,
      pending_approval: false,
      draft: null,
      sent_steps: [1, 2, 3, 4, 5],
      next_due: null,
      sequence_started: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    },
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
    ad_headline: null, ad_body: null, ad_thumbnail_url: null, ad_platform: null, original_ad_id: null,
    product_interests: [],
    lead_quality: null,
    conv_stage: "Personal",
    customer_intent: "Appears to be a personal contact, not a business lead.",
    next_action_plan: null,
    psychology: null,
    trust_markers: [],
    vibe_check: "Casual greeting. No product interest detected.",
    context_summary: "Personal contact. Greeted casually. No buying intent.",
    follow_up_count: 0,
    last_seen: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    unread_count: 0,
    cart_state: [],
    is_business_chat: false,
    followup: { status: 'not_enrolled', current_step: 0, pending_approval: false, draft: null, sent_steps: [], next_due: null },
    transcript: [
      { sender: "Daniel", msg: "Niaje bro, uko?", time: "5 days ago" },
      { sender: "User", msg: "Poa! Uko sawa?", time: "5 days ago" }
    ]
  }
];

// ─── State ────────────────────────────────────────────────────────────────────
let leadsSearchQuery        = '';
let activeLeadStateFilter   = 'all';
let activeLeadTypeFilter    = 'all';
let activeLeadId            = null;
let sequenceExpanded        = {};
let editingFollowupId       = null;

// ─── Computed stats ───────────────────────────────────────────────────────────
function getLeadStats() {
  const business = mockLeads.filter(l => l.lead_type === 'business');
  const adLeads  = mockLeads.filter(l => l.is_ad_lead);
  const unread   = mockLeads.filter(l => l.unread_count > 0);
  const urgent   = mockLeads.filter(l => ['stalled','ghosted'].includes(l.lead_state) && l.lead_type === 'business');
  const ready    = mockLeads.filter(l => l.lead_quality === 'hot' && l.lead_state === 'engaged');
  const pending  = mockLeads.filter(l => l.followup?.pending_approval);
  return { total: mockLeads.length, business: business.length, adLeads: adLeads.length, unread: unread.length, urgent: urgent.length, ready: ready.length, pending: pending.length };
}

// ─── Filter + sort ────────────────────────────────────────────────────────────
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
      if (b.unread_count !== a.unread_count) return b.unread_count - a.unread_count;
      if (b.followup?.pending_approval !== a.followup?.pending_approval)
        return (b.followup?.pending_approval ? 1 : 0) - (a.followup?.pending_approval ? 1 : 0);
      const ap = STATE_PRIORITY[a.lead_state] ?? 9;
      const bp = STATE_PRIORITY[b.lead_state] ?? 9;
      if (ap !== bp) return ap - bp;
      return new Date(b.last_seen) - new Date(a.last_seen);
    });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

function timeUntil(iso) {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return 'overdue';
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

function stateConfig(state) {
  const map = {
    engaged:  { label: 'Engaged',  dot: '#22c55e' },
    new:      { label: 'New',      dot: '#3b82f6' },
    warm:     { label: 'Warm',     dot: '#f59e0b' },
    stalled:  { label: 'Stalled',  dot: '#f59e0b' },
    ghosted:  { label: 'Ghosted',  dot: '#94a3b8' },
    won:      { label: 'Won',      dot: '#22c55e' },
    lost:     { label: 'Lost',     dot: '#ef4444' },
    personal: { label: 'Personal', dot: '#cbd5e1' },
  };
  return map[state] || { label: state, dot: '#cbd5e1' };
}

function qualityLabel(q) {
  if (!q) return null;
  const map = { hot: 'Hot', warm: 'Warm', cold: 'Cold' };
  return map[q.toLowerCase()] || null;
}

function formatInterest(tag) {
  return tag.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// ─── Follow-up helpers ────────────────────────────────────────────────────────
function getFollowupRowLabel(lead) {
  const fu = lead.followup;
  if (!fu || lead.lead_type === 'personal') return null;
  switch (fu.status) {
    case 'not_enrolled':
      if (lead.follow_up_count === 0 && lead.lead_state !== 'won')
        return { icon: 'chat', text: 'Enroll in sequence', color: '#94a3b8', urgent: false };
      return null;
    case 'consent_sent':
      return { icon: 'clock', text: 'Awaiting consent', color: '#94a3b8', urgent: false };
    case 'opted_out':
      return { icon: 'x', text: 'Opted out', color: '#94a3b8', urgent: false };
    case 'completed':
      return { icon: 'check', text: 'Sequence complete', color: '#22c55e', urgent: false };
    case 'opted_in':
      if (fu.pending_approval)
        return { icon: 'inbox', text: `Follow-up ${fu.current_step} · needs review`, color: '#d97706', urgent: true };
      if (fu.next_due) {
        const overdue = new Date(fu.next_due) < new Date();
        return {
          icon: overdue ? 'warn' : 'clock',
          text: `Follow-up ${fu.current_step} · ${overdue ? 'overdue' : 'due ' + timeUntil(fu.next_due)}`,
          color: overdue ? '#ef4444' : '#94a3b8',
          urgent: overdue
        };
      }
      return { icon: 'check', text: `Follow-up ${fu.current_step} active`, color: '#22c55e', urgent: false };
    default:
      return null;
  }
}

function getCumulativeDays(stepIndex) {
  return DEFAULT_SEQUENCE.slice(0, stepIndex + 1).reduce((sum, s) => sum + s.delay_days, 0);
}

// ─── Styles ───────────────────────────────────────────────────────────────────
function injectLeadsStyles() {
  if (document.getElementById('leads-styles-v3')) return;
  const style = document.createElement('style');
  style.id = 'leads-styles-v3';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

    :root {
      --ink:      #0f172a;
      --ink-2:    #334155;
      --ink-3:    #64748b;
      --ink-4:    #94a3b8;
      --ink-5:    #cbd5e1;
      --line:     #e2e8f0;
      --bg:       #f8fafc;
      --bg-card:  #ffffff;
      --bg-hover: #f1f5f9;
      --green:    #16a34a;
      --green-bg: #f0fdf4;
      --amber:    #d97706;
      --amber-bg: #fffbeb;
      --red:      #dc2626;
      --red-bg:   #fef2f2;
      --blue:     #2563eb;
      --blue-bg:  #eff6ff;
      --r-card:   12px;
      --r-btn:    8px;
      --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
      --shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
      --shadow-lg: 0 20px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06);
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .lv3-wrap {
      display: flex;
      height: 100%;
      overflow: hidden;
      font-family: 'DM Sans', sans-serif;
      background: var(--bg);
      color: var(--ink);
    }

    /* ── SVG icon util ─────────────────────────── */
    .ic { display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .ic svg { display: block; }

    /* ── Left panel ─────────────────────────────── */
    .lv3-list-panel {
      width: 340px;
      min-width: 280px;
      max-width: 340px;
      display: flex;
      flex-direction: column;
      background: var(--bg-card);
      overflow: hidden;
      flex-shrink: 0;
    }

    .lv3-panel-top {
      padding: 20px 16px 0;
      flex-shrink: 0;
    }

    .lv3-panel-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .lv3-panel-title h2 {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.03em;
      color: var(--ink);
    }

    .lv3-top-actions {
      display: flex;
      gap: 6px;
    }

    /* Stat row */
    .lv3-stats {
      display: flex;
      gap: 6px;
      margin-bottom: 14px;
      overflow-x: auto;
      scrollbar-width: none;
      padding-bottom: 2px;
    }
    .lv3-stats::-webkit-scrollbar { display: none; }

    .lv3-stat {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 10px 7px;
      border-radius: var(--r-card);
      border: 1px solid var(--line);
      background: var(--bg);
      cursor: pointer;
      transition: all 0.15s;
      min-width: 58px;
    }
    .lv3-stat:hover { background: var(--bg-hover); border-color: var(--ink-5); }
    .lv3-stat.warn  { border-color: #fcd34d; background: var(--amber-bg); }
    .lv3-stat.good  { border-color: #86efac; background: var(--green-bg); }
    .lv3-stat-num   { font-size: 18px; font-weight: 700; line-height: 1; color: var(--ink); }
    .lv3-stat-num.amber { color: var(--amber); }
    .lv3-stat-num.green { color: var(--green); }
    .lv3-stat-lbl   { font-size: 9px; font-weight: 600; color: var(--ink-4); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 3px; white-space: nowrap; }

    /* Search */
    .lv3-search {
      position: relative;
      margin-bottom: 10px;
    }
    .lv3-search .ic {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--ink-4);
      width: 16px;
      height: 16px;
    }
    .lv3-search input {
      width: 100%;
      padding: 9px 12px 9px 32px;
      background: var(--bg);
      border: 1px solid var(--line);
      border-radius: var(--r-btn);
      font-size: 13px;
      font-family: inherit;
      color: var(--ink);
      outline: none;
      transition: all 0.15s;
    }
    .lv3-search input::placeholder { color: var(--ink-4); }
    .lv3-search input:focus { border-color: var(--ink-3); background: var(--bg-card); box-shadow: 0 0 0 3px rgba(15,23,42,0.06); }

    /* Filter chips */
    .lv3-filters {
      display: flex;
      gap: 4px;
      padding-bottom: 12px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .lv3-filters::-webkit-scrollbar { display: none; }
    .lv3-fc {
      flex-shrink: 0;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      color: var(--ink-3);
      background: transparent;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }
    .lv3-fc:hover { background: var(--bg-hover); color: var(--ink); }
    .lv3-fc.active { background: var(--ink); color: #fff; border-color: var(--ink); }

    /* Lead list */
    .lv3-list {
      flex: 1;
      overflow-y: auto;
      padding: 6px 8px 24px;
    }
    .lv3-list::-webkit-scrollbar { width: 4px; }
    .lv3-list::-webkit-scrollbar-thumb { background: var(--line); border-radius: 4px; }

    /* Lead row */
    .lv3-row {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 11px 10px;
      border-radius: var(--r-card);
      cursor: pointer;
      transition: background 0.12s;
      margin-bottom: 1px;
      position: relative;
    }
    .lv3-row:hover { background: var(--bg-hover); }
    .lv3-row.active { background: #f1f5f9; }
    .lv3-row.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 8px;
      bottom: 8px;
      width: 3px;
      background: var(--ink);
      border-radius: 0 2px 2px 0;
    }

    .lv3-avatar {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      flex-shrink: 0;
      background: var(--bg-hover);
      color: var(--ink-2);
      border: 1px solid var(--line);
      position: relative;
    }
    .lv3-avatar.personal { color: var(--ink-4); }

    .lv3-state-dot {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      border: 2px solid var(--bg-card);
    }

    .lv3-row-body { flex: 1; min-width: 0; }

    .lv3-row-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2px;
    }
    .lv3-row-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--ink);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }
    .lv3-row-right {
      display: flex;
      align-items: center;
      gap: 5px;
      flex-shrink: 0;
      margin-left: 6px;
    }
    .lv3-unread {
      min-width: 17px;
      height: 17px;
      border-radius: 9px;
      background: var(--ink);
      color: #fff;
      font-size: 9px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
    }
    .lv3-time {
      font-size: 10px;
      color: var(--ink-4);
      font-weight: 500;
    }
    .lv3-row-summary {
      font-size: 11.5px;
      color: var(--ink-3);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 5px;
      line-height: 1.4;
    }
    .lv3-row-meta {
      display: flex;
      align-items: center;
      gap: 5px;
      flex-wrap: wrap;
    }

    /* Tiny pills */
    .tp {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .tp-state   { background: var(--bg-hover); color: var(--ink-3); border: 1px solid var(--line); }
    .tp-hot     { background: #fef2f2; color: #dc2626; }
    .tp-warm    { background: #fffbeb; color: #d97706; }
    .tp-ad      { background: var(--bg); color: var(--ink-3); border: 1px solid var(--line); }
    .tp-product { background: #f0fdf4; color: #15803d; }

    .lv3-fu-hint {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 4px;
      font-size: 10.5px;
      font-weight: 600;
    }
    .lv3-fu-hint .ic { width: 12px; height: 12px; }

    /* ── Empty state ─────────────────────────────── */
    .lv3-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: var(--ink-4);
      text-align: center;
      gap: 8px;
    }
    .lv3-empty .ic { width: 36px; height: 36px; opacity: 0.25; }
    .lv3-empty p { font-size: 13px; font-weight: 500; }

    /* ── Right panel ────────────────────────────── */
    .lv3-detail-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: var(--bg);
      min-width: 0;
    }

    .lv3-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.lv3-placeholder-card {
  text-align: center;
  margin: auto;
  padding: 2rem;
}

    .lv3-placeholder-card .ic {
      width: 56px;
      height: 56px;
      opacity: 0.18;
      color: var(--ink-3);
    }
    .lv3-placeholder-card p {
      font-size: 16px;
      font-weight: 500;
      color: var(--ink-3);
      letter-spacing: -0.01em;
    }
    .lv3-placeholder-card .sub {
      font-size: 13px;
      color: var(--ink-4);
      font-weight: 400;
    }
    .lv3-placeholder .ic {
      display: none;
    }
    .lv3-placeholder p {
      display: none;
    }

    /* Detail content */
    .lv3-detail-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 24px 28px;
    }
    .lv3-detail-scroll::-webkit-scrollbar { width: 4px; }
    .lv3-detail-scroll::-webkit-scrollbar-thumb { background: var(--line); border-radius: 4px; }

    /* Detail header */
    .lv3-dh {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--line);
    }
    .lv3-dh-left { display: flex; align-items: center; gap: 14px; }
    .lv3-dh-avatar {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 700;
      background: var(--bg-hover);
      color: var(--ink-2);
      border: 1px solid var(--line);
      flex-shrink: 0;
    }
    .lv3-dh-name { font-size: 17px; font-weight: 700; letter-spacing: -0.02em; color: var(--ink); }
    .lv3-dh-sub { display: flex; align-items: center; gap: 7px; margin-top: 4px; }
    .lv3-dh-phone { font-size: 12px; color: var(--ink-3); font-family: 'DM Mono', monospace; }

    .lv3-dh-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; flex-wrap: wrap; justify-content: flex-end; }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: var(--r-btn);
      font-size: 12px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      border: none;
      transition: all 0.15s;
      white-space: nowrap;
      text-decoration: none;
    }
    .btn .ic { width: 14px; height: 14px; }
    .btn-sm { padding: 6px 10px; font-size: 11px; }
    .btn-sm .ic { width: 13px; height: 13px; }
    .btn-xs { padding: 4px 8px; font-size: 10px; }
    .btn-xs .ic { width: 11px; height: 11px; }

    .btn-primary { background: var(--ink); color: #fff; }
    .btn-primary:hover { background: #1e293b; transform: translateY(-1px); box-shadow: var(--shadow-sm); }
    .btn-ghost   { background: transparent; color: var(--ink-2); border: 1px solid var(--line); }
    .btn-ghost:hover { background: var(--bg-hover); }
    .btn-green   { background: var(--green); color: #fff; }
    .btn-green:hover { background: #15803d; transform: translateY(-1px); }
    .btn-theme-green   { background: var(--theme-green); color: #fff; border: 1px solid var(--theme-green-border); }
    .btn-theme-green:hover { background: var(--theme-green-dark); }
    .btn-red     { background: var(--red-bg); color: var(--red); }
    .btn-red:hover { background: #fee2e2; }
    .btn-icon {
      width: 32px;
      height: 32px;
      padding: 0;
      border-radius: var(--r-btn);
      background: transparent;
      border: 1px solid var(--line);
      color: var(--ink-2);
    }
    .btn-icon:hover { background: var(--bg-hover); }
    .btn-icon .ic { width: 15px; height: 15px; }

    /* buttons * /
    .btn-theme-green {
  background: var(--theme-green);
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-theme-green:hover {
  background: var(--theme-green-dark);
}
  .green-hl {
  background: rgba(34, 197, 94, 0.15);
  color: var(--theme-green-light);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

    /* ── Sections ───────────────────────────────── */
    .lv3-section { margin-bottom: 20px; }
    .lv3-sec-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--ink-4);
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .lv3-sec-label .ic { width: 12px; height: 12px; }

    /* Card */
    .card {
      background: var(--bg-card);
      border: 1px solid var(--line);
      border-radius: var(--r-card);
      box-shadow: var(--shadow-sm);
    }
    .card-pad { padding: 16px; }

    /* Action card */
    .action-card {
      background: var(--bg-card);
      border: 1px solid var(--line);
      border-left: 3px solid var(--ink);
      border-radius: var(--r-card);
      padding: 14px 16px;
      margin-bottom: 20px;
      box-shadow: var(--shadow-sm);
    }
    .action-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .action-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--ink-3);
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .action-label .ic { width: 12px; height: 12px; }
    .ai-badge {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.06em;
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--bg-hover);
      color: var(--ink-3);
      text-transform: uppercase;
    }
    .action-text {
      font-size: 13px;
      line-height: 1.55;
      color: var(--ink-2);
      margin-bottom: 12px;
    }
    .action-btns { display: flex; gap: 7px; flex-wrap: wrap; }

    /* Tags */
    .tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 500;
      padding: 4px 9px;
      border-radius: 6px;
      border: 1px solid var(--line);
      background: var(--bg);
      color: var(--ink-2);
    }
    .tag.green { background: var(--green-bg); border-color: #bbf7d0; color: #15803d; }
    .tag.amber { background: var(--amber-bg); border-color: #fde68a; color: #b45309; }

    /* Personal notice */
    .personal-notice {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 14px;
      background: var(--bg-hover);
      border-radius: var(--r-card);
      border: 1px solid var(--line);
      margin-bottom: 20px;
      font-size: 12px;
      color: var(--ink-3);
      line-height: 1.5;
    }
    .personal-notice .ic { width: 14px; height: 14px; flex-shrink: 0; margin-top: 1px; }

    /* Drawer open buttons (profile, followup, chat) */
    .drawer-open-row {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
    }
    .drawer-open-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 10px 14px;
      background: var(--bg-card);
      border: 1px solid var(--line);
      border-radius: var(--r-card);
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      color: var(--ink-2);
      transition: all 0.15s;
      box-shadow: var(--shadow-sm);
    }
    .drawer-open-btn:hover { background: var(--bg-hover); border-color: var(--ink-5); }
    .drawer-open-btn .ic { width: 15px; height: 15px; }
    .drawer-open-btn.highlight { background: var(--ink); color: #fff; border-color: var(--ink); }
    .drawer-open-btn.highlight:hover { background: #1e293b; }
    .drawer-open-btn.green-hl { background: var(--amber-bg); border-color: #fcd34d; color: var(--amber); }
    .drawer-open-btn.green-hl:hover { background: #fef3c7; }

    /* ── Follow-up card ──────────────────────────── */
    .fu-card {
      background: var(--bg-card);
      border: 1px solid var(--line);
      border-radius: var(--r-card);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      margin-bottom: 20px;
    }
    .fu-card-head {
      padding: 14px 16px 12px;
    }
    .fu-card-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .fu-card-title span {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--ink-4);
    }
    .fu-progress-wrap {
      margin-bottom: 12px;
    }
    .fu-progress-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .fu-progress-label { font-size: 11px; font-weight: 600; color: var(--ink-3); }
    .fu-progress-track {
      position: relative;
      height: 4px;
      background: var(--bg-hover);
      border-radius: 2px;
      overflow: visible;
    }
    .fu-progress-fill {
      position: absolute;
      top: 0; left: 0;
      height: 100%;
      background: var(--ink);
      border-radius: 2px;
      transition: width 0.3s;
    }
    .fu-progress-marker {
      position: absolute;
      top: -3px;
      width: 2px;
      height: 10px;
      background: var(--amber);
      border-radius: 1px;
    }

    /* Draft block */
    .fu-draft {
      background: var(--bg);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 10px;
    }
    .fu-draft-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--amber);
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .fu-draft-label .ic { width: 11px; height: 11px; }
    .fu-draft-text {
      font-size: 12.5px;
      color: var(--ink-2);
      line-height: 1.6;
      font-style: italic;
    }
    .fu-btns { display: flex; gap: 6px; flex-wrap: wrap; }
    .fu-edit-area {
      background: var(--bg);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 10px 12px;
      margin-bottom: 8px;
    }
    .fu-edit-area textarea {
      width: 100%;
      border: none;
      background: transparent;
      font-size: 13px;
      font-family: inherit;
      color: var(--ink);
      resize: vertical;
      outline: none;
      min-height: 80px;
      line-height: 1.6;
    }
    .fu-rewrite-area {
      background: var(--blue-bg);
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      padding: 10px 12px;
      margin-bottom: 8px;
    }
    .fu-rewrite-area input {
      width: 100%;
      border: none;
      background: transparent;
      font-size: 13px;
      font-family: inherit;
      color: var(--ink);
      outline: none;
    }
    .fu-rewrite-area input::placeholder { color: var(--ink-4); }

    /* Sequence toggle */
    .fu-seq-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      border-top: 1px solid var(--line);
      cursor: pointer;
      transition: background 0.15s;
      font-size: 11px;
      font-weight: 600;
      color: var(--ink-3);
    }
    .fu-seq-toggle:hover { background: var(--bg-hover); }
    .fu-seq-toggle .pref-link { font-size: 10px; color: var(--blue); font-weight: 600; }

    /* Sequence timeline */
    .fu-seq { padding: 14px 16px 6px; border-top: 1px solid var(--line); }
    .fu-step {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding-bottom: 14px;
      position: relative;
    }
    .fu-step:not(:last-child)::before {
      content: '';
      position: absolute;
      left: 10px;
      top: 22px;
      bottom: 0;
      width: 1px;
      background: var(--line);
    }
    .fu-step-dot {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      font-weight: 700;
      margin-top: 1px;
      position: relative;
      z-index: 1;
    }
    .dot-sent    { background: var(--green); color: #fff; }
    .dot-pending { background: var(--amber); color: #fff; box-shadow: 0 0 0 3px rgba(217,119,6,0.15); }
    .dot-next    { background: var(--bg-hover); color: var(--ink-2); border: 1.5px solid var(--ink-5); }
    .dot-future  { background: var(--bg); color: var(--ink-4); border: 1.5px solid var(--line); }
    .fu-step-body { flex: 1; }
    .fu-step-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--ink);
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 2px;
    }
    .fu-step-name.muted { color: var(--ink-4); font-weight: 500; }
    .fu-step-name .ic { width: 13px; height: 13px; flex-shrink: 0; }
    .fu-step-meta { font-size: 10px; color: var(--ink-4); font-weight: 500; }
    .fu-step-desc { font-size: 10px; color: var(--ink-3); margin-top: 1px; }
    .fu-klt {
      font-size: 8px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 1px 5px;
      border-radius: 3px;
    }

    /* Not enrolled / states */
    .fu-no-consent {
      padding: 20px 16px;
      text-align: center;
    }
    .fu-no-consent-icon { font-size: 28px; margin-bottom: 8px; }
    .fu-no-consent-text { font-size: 12px; color: var(--ink-3); margin-bottom: 14px; line-height: 1.5; }
    .fu-status-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
    }
    .fu-status-row .ic { width: 18px; height: 18px; flex-shrink: 0; }
    .fu-status-title { font-size: 12px; font-weight: 600; color: var(--ink); }
    .fu-status-sub { font-size: 11px; color: var(--ink-4); margin-top: 2px; }

    /* ── Overlays / Drawers ──────────────────────── */
    .lv3-overlay-bg {
      position: fixed;
      inset: 0;
      background: rgba(15,23,42,0.35);
      z-index: 900;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s;
      backdrop-filter: blur(3px);
    }
    .lv3-overlay-bg.open {
      opacity: 1;
      pointer-events: auto;
    }

    .lv3-drawer {
      position: fixed;
      top: 0;
      right: -520px;
      width: 460px;
      max-width: 100vw;
      height: 100%;
      background: var(--bg-card);
      border-left: 1px solid var(--line);
      box-shadow: var(--shadow-lg);
      z-index: 910;
      display: flex;
      flex-direction: column;
      transition: right 0.3s cubic-bezier(0.16,1,0.3,1);
    }
    .lv3-drawer.open { right: 0; }

    .lv3-drawer-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 20px;
      border-bottom: 1px solid var(--line);
      flex-shrink: 0;
    }
    .lv3-drawer-title {
      font-size: 15px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--ink);
    }
    .lv3-drawer-body {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }
    .lv3-drawer-body::-webkit-scrollbar { width: 4px; }
    .lv3-drawer-body::-webkit-scrollbar-thumb { background: var(--line); border-radius: 4px; }

    /* ── Profile drawer rows ─────────────────────── */
    .profile-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 10px 0;
      border-bottom: 1px solid var(--line);
      font-size: 13px;
      gap: 16px;
    }
    .profile-row:last-child { border-bottom: none; }
    .profile-key { color: var(--ink-3); font-weight: 500; flex-shrink: 0; }
    .profile-val { color: var(--ink); font-weight: 500; text-align: right; max-width: 60%; line-height: 1.4; }

    /* ── Approval drawer items ─────────────────────── */
    .approval-item {
      padding: 16px 0;
      border-bottom: 1px solid var(--line);
    }
    .approval-item:last-child { border-bottom: none; }
    .approval-item-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .approval-item-name { font-size: 13px; font-weight: 700; color: var(--ink); }
    .approval-item-meta { font-size: 10px; color: var(--ink-4); font-weight: 500; }
    .approval-item-draft {
      background: var(--bg);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 12px;
      color: var(--ink-2);
      line-height: 1.55;
      font-style: italic;
      margin-bottom: 10px;
    }

    /* ── Chat drawer ─────────────────────────────── */
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .chat-messages::-webkit-scrollbar { width: 4px; }
    .chat-messages::-webkit-scrollbar-thumb { background: var(--line); border-radius: 4px; }
    .chat-bw { display: flex; flex-direction: column; }
    .chat-bw.out { align-items: flex-end; }
    .chat-bw.in  { align-items: flex-start; }
    .chat-sender { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--ink-4); margin-bottom: 3px; padding: 0 3px; }
    .chat-bubble { max-width: 85%; padding: 9px 13px; border-radius: 12px; font-size: 12.5px; line-height: 1.5; }
    .bubble-lead { background: var(--bg-hover); color: var(--ink); border-bottom-left-radius: 3px; border: 1px solid var(--line); }
    .bubble-ai   { background: var(--ink); color: #fff; border-bottom-right-radius: 3px; }
    .bubble-user { background: #334155; color: #fff; border-bottom-right-radius: 3px; }
    .chat-time { font-size: 9px; color: var(--ink-4); font-weight: 500; margin-top: 3px; padding: 0 3px; }
    .chat-input-wrap { padding: 12px 16px 20px; border-top: 1px solid var(--line); flex-shrink: 0; background: var(--bg-card); }
    .chat-input-row { display: flex; gap: 7px; align-items: center; }
    .chat-input-row input {
      flex: 1;
      padding: 9px 14px;
      background: var(--bg);
      border: 1px solid var(--line);
      border-radius: 20px;
      font-size: 13px;
      font-family: inherit;
      color: var(--ink);
      outline: none;
      transition: all 0.15s;
    }
    .chat-input-row input:focus { border-color: var(--ink-3); background: var(--bg-card); }
    .chat-send {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--ink);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      flex-shrink: 0;
      transition: all 0.15s;
    }
    .chat-send:hover { background: #1e293b; transform: translateY(-1px); }
    .chat-send .ic { width: 15px; height: 15px; }
    .chat-reply-as {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .chat-reply-label { font-size: 10px; font-weight: 600; color: var(--ink-4); text-transform: uppercase; letter-spacing: 0.06em; }
    .chat-reply-modes { display: flex; gap: 4px; }
    .chat-reply-mode {
      font-size: 10px;
      padding: 3px 8px;
      border-radius: 5px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.12s;
      border: 1px solid transparent;
    }
    .chat-reply-mode.ai { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
    .chat-reply-mode.you { background: var(--bg-hover); color: var(--ink-2); border-color: var(--line); }

    /* ── Bought modal ────────────────────────────── */
    .lv3-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15,23,42,0.4);
      backdrop-filter: blur(6px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s;
    }
    .lv3-modal-overlay.open { opacity: 1; pointer-events: auto; }
    .lv3-modal {
      background: var(--bg-card);
      border-radius: 16px;
      padding: 24px;
      width: 100%;
      max-width: 360px;
      box-shadow: var(--shadow-lg);
      transform: translateY(8px);
      transition: transform 0.25s;
    }
    .lv3-modal-overlay.open .lv3-modal { transform: translateY(0); }
    .lv3-modal-title { font-size: 15px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 16px; color: var(--ink); }
    .lv3-modal-field { margin-bottom: 14px; }
    .lv3-modal-field label { display: block; font-size: 11px; font-weight: 600; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 5px; }
    .lv3-modal-field input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--line);
      border-radius: var(--r-btn);
      font-size: 14px;
      font-family: inherit;
      color: var(--ink);
      outline: none;
      transition: all 0.15s;
    }
    .lv3-modal-field input:focus { border-color: var(--ink-3); box-shadow: 0 0 0 3px rgba(15,23,42,0.06); }
    .lv3-modal-actions { display: flex; gap: 8px; margin-top: 4px; }

/* ── Mobile ──────────────────────────────────── */
    @media (max-width: 768px) {
      .lv3-wrap {
        position: relative;
        flex-direction: column;
      }
      .lv3-list-panel {
        width: 100%;
        max-width: 100%;
        min-width: 0;
        height: 100%;
        border-right: none;
        display: flex;
        flex-direction: column;
        transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
      }
      .lv3-list-panel.slide-left {
        transform: translateX(-100%);
        position: absolute;
        top: 0; left: 0;
        height: 100%;
        z-index: 1;
      }
      .lv3-detail-panel {
        display: none; /* Hidden by default on mobile */
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        border-radius: 0;
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: none;
        overflow-y: auto;
      }
      .lv3-detail-panel.slide-in {
        display: flex;
        flex-direction: column;
        transform: none; /* Overrides the old slide animation to use the overlay */
      }
      .lv3-detail-scroll {
        padding: 16px 14px;
      }
      .lv3-dh { flex-wrap: wrap; gap: 12px; }
      .lv3-dh-actions { width: 100%; }
      .lv3-drawer {
        width: 100%;
        max-width: 100%;
        right: -100%;
      }
      .lv3-drawer.open { right: 0; }
      .lv3-panel-top { padding: 16px 12px 0; }
      .mobile-back-btn {
        display: flex !important;
      }
    }

    .mobile-back-btn {
      display: none;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 600;
      color: var(--ink-3);
      cursor: pointer;
      padding: 12px 16px;
      border-bottom: 1px solid var(--glass-border);
      background: transparent;
    }
    .mobile-back-btn .ic { width: 14px; height: 14px; transform: rotate(180deg); }
  `;
  document.head.appendChild(style);
}

// ─── Render helpers ───────────────────────────────────────────────────────────
function ic(iconKey, size = 16) {
  return `<span class="ic" style="width:${size}px;height:${size}px">${ICON[iconKey]}</span>`;
}

function renderStatChips(stats) {
  return `
    <div class="lv3-stats">
      <div class="lv3-stat" onclick="setTypeFilter('business')">
        <div class="lv3-stat-num">${stats.business}</div>
        <div class="lv3-stat-lbl">Business</div>
      </div>
      <div class="lv3-stat" onclick="setTypeFilter('ad')">
        <div class="lv3-stat-num">${stats.adLeads}</div>
        <div class="lv3-stat-lbl">Ad leads</div>
      </div>
      <div class="lv3-stat ${stats.unread > 0 ? 'warn' : ''}" onclick="setStateFilter('engaged')">
        <div class="lv3-stat-num ${stats.unread > 0 ? 'amber' : ''}">${stats.unread}</div>
        <div class="lv3-stat-lbl">Unread</div>
      </div>
      <div class="lv3-stat warn" onclick="setStateFilter('stalled')">
        <div class="lv3-stat-num amber">${stats.urgent}</div>
        <div class="lv3-stat-lbl">Going cold</div>
      </div>
      <div class="lv3-stat ${stats.ready > 0 ? 'good' : ''}" onclick="setStateFilter('engaged')">
        <div class="lv3-stat-num ${stats.ready > 0 ? 'green' : ''}">${stats.ready}</div>
        <div class="lv3-stat-lbl">Ready</div>
      </div>
      <div class="lv3-stat ${stats.pending > 0 ? 'warn' : ''}" onclick="openApprovalDrawer()">
        <div class="lv3-stat-num ${stats.pending > 0 ? 'amber' : ''}">${stats.pending}</div>
        <div class="lv3-stat-lbl">Approvals</div>
      </div>
    </div>
  `;
}

function renderFilterTabs() {
  const states = [
    { id: 'all', label: 'All' },
    { id: 'engaged', label: 'Engaged' },
    { id: 'new', label: 'New' },
    { id: 'stalled', label: 'Cold' },
    { id: 'ghosted', label: 'Ghosted' },
    { id: 'won', label: 'Won' },
  ];
  const types = [
    { id: 'business', label: 'Business' },
    { id: 'ad', label: 'Ads' },
    { id: 'personal', label: 'Personal' },
  ];
  return `
    <div class="lv3-filters">
      ${states.map(s => `<div class="lv3-fc ${activeLeadStateFilter === s.id ? 'active' : ''}" onclick="setStateFilter('${s.id}')">${s.label}</div>`).join('')}
      <div style="width:1px;background:var(--line);margin:0 2px;flex-shrink:0;align-self:stretch"></div>
      ${types.map(t => `<div class="lv3-fc ${activeLeadTypeFilter === t.id ? 'active' : ''}" onclick="setTypeFilter('${t.id}')">${t.label}</div>`).join('')}
    </div>
  `;
}

function renderLeadRow(lead) {
  const sc    = stateConfig(lead.lead_state);
  const ql    = qualityLabel(lead.lead_quality);
  const fuRow = getFollowupRowLabel(lead);
  const isPers = lead.lead_type === 'personal';

  return `
    <div class="lv3-row ${lead.id === activeLeadId ? 'active' : ''}" onclick="openLeadDetail(${lead.id})">
      <div class="lv3-avatar ${isPers ? 'personal' : ''}">
        ${lead.name.charAt(0)}
        <span class="lv3-state-dot" style="background:${sc.dot}"></span>
      </div>
      <div class="lv3-row-body">
        <div class="lv3-row-top">
          <span class="lv3-row-name">${lead.name}</span>
          <div class="lv3-row-right">
            ${lead.unread_count > 0 ? `<span class="lv3-unread">${lead.unread_count}</span>` : ''}
            <span class="lv3-time">${timeAgo(lead.last_seen)}</span>
          </div>
        </div>
        <div class="lv3-row-summary">${lead.context_summary || lead.customer_intent || lead.phone}</div>
        <div class="lv3-row-meta">
          <span class="tp tp-state">${sc.label}</span>
          ${ql === 'Hot' ? `<span class="tp tp-hot">${ql}</span>` : ql === 'Warm' ? `<span class="tp tp-warm">${ql}</span>` : ''}
          ${lead.is_ad_lead ? `<span class="tp tp-ad">${ic('ad',10)} Ad</span>` : ''}
          ${(lead.product_interests||[]).slice(0,1).map(p => `<span class="tp tp-product">${formatInterest(p)}</span>`).join('')}
        </div>
        ${fuRow ? `
          <div class="lv3-fu-hint" style="color:${fuRow.color}">
            ${ic(fuRow.icon, 12)}
            <span>${fuRow.text}</span>
          </div>` : ''}
      </div>
    </div>
  `;
}

// ─── Follow-up card render ────────────────────────────────────────────────────
function renderPhaseBar(lead) {
  const fu        = lead.followup;
  const sentCount = fu?.sent_steps?.length || 0;
  const percent   = Math.round((sentCount / 11) * 100);
  const minPct    = Math.round((5 / 11) * 100);
  return `
    <div class="fu-progress-wrap">
      <div class="fu-progress-row">
        <span class="fu-progress-label">${sentCount} of 11 sent</span>
        <button class="btn btn-xs btn-green" onclick="openBoughtModal('${lead.id}')">
          ${ic('check',11)} Mark as bought
        </button>
      </div>
      <div class="fu-progress-track">
        <div class="fu-progress-fill" style="width:${percent}%"></div>
        <div class="fu-progress-marker" style="left:${minPct}%" title="Recommended minimum (5/11)"></div>
      </div>
    </div>
  `;
}

function renderSequenceTimeline(lead) {
  const fu        = lead.followup;
  const sentSteps = fu?.sent_steps || [];
  const curStep   = fu?.current_step || 0;

  return DEFAULT_SEQUENCE.map(step => {
    const cfg       = KLT_CONFIG[step.klt];
    const isSent    = sentSteps.includes(step.step);
    const isCurrent = step.step === curStep;
    const isNext    = step.step === curStep + 1 && !isSent;
    const days      = getCumulativeDays(step.step - 1);

    let dotCls, dotTxt, nameCls, meta;
    if (isSent) {
      dotCls = 'dot-sent'; dotTxt = `${ic('check',10)}`; nameCls = ''; meta = `Sent`;
    } else if (isCurrent && fu?.pending_approval) {
      dotCls = 'dot-pending'; dotTxt = step.step; nameCls = ''; meta = `Awaiting approval`;
    } else if (isCurrent) {
      dotCls = 'dot-next'; dotTxt = step.step; nameCls = ''; meta = fu?.next_due ? `Due ${timeUntil(fu.next_due)}` : `Scheduled`;
    } else if (isNext) {
      dotCls = 'dot-next'; dotTxt = step.step; nameCls = ''; meta = `~day ${days}`;
    } else {
      dotCls = 'dot-future'; dotTxt = step.step; nameCls = 'muted'; meta = `~day ${days}`;
    }

    return `
      <div class="fu-step">
        <div class="fu-step-dot ${dotCls}">${dotTxt}</div>
        <div class="fu-step-body">
          <div class="fu-step-name ${nameCls}">
            <span class="ic" style="width:13px;height:13px;color:var(--ink-3)">${TOUCHPOINT_ICONS[step.type]}</span>
            ${step.name}
            <span class="fu-klt" style="background:${cfg.bg};color:${cfg.color}">${step.klt}</span>
          </div>
          <div class="fu-step-meta">${meta}</div>
          ${!isSent ? `<div class="fu-step-desc">${step.desc}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function renderFollowupCard(lead) {
  const fu       = lead.followup;
  const isExp    = sequenceExpanded[lead.id] || false;
  const editing  = editingFollowupId === lead.id;
  const rewriting = editingFollowupId === `${lead.id}-rewrite`;

  if (!fu || lead.lead_type === 'personal') return '';

  if (fu.status === 'not_enrolled') {
    return `
      <div class="fu-card">
        <div class="fu-no-consent">
          <div class="fu-no-consent-icon">${ic('chat',28)}</div>
          <div class="fu-no-consent-text">
            ${lead.name.split(' ')[0]} isn't in a follow-up sequence yet.<br>
            Send a consent message to start the 11-step journey.
          </div>
          <button class="btn btn-primary" style="width:100%;justify-content:center" onclick="sendConsentMessage(${lead.id})">
            Send Consent Message
          </button>
        </div>
        <div class="fu-seq-toggle" onclick="toggleSequence(${lead.id})">
          <span>${isExp ? '↑ Hide sequence' : '↓ Preview all 11 follow-ups'}</span>
          <span class="pref-link" onclick="event.stopPropagation();navigateToPreferences('followup-materials')">Edit →</span>
        </div>
        ${isExp ? `<div class="fu-seq">${renderSequenceTimeline(lead)}</div>` : ''}
      </div>`;
  }

  if (fu.status === 'opted_out') {
    return `
      <div class="fu-card">
        <div class="fu-status-row">
          <span style="font-size:18px">🚫</span>
          <div>
            <div class="fu-status-title">${lead.name.split(' ')[0]} opted out</div>
            <div class="fu-status-sub">No automated messages will be sent.</div>
          </div>
        </div>
      </div>`;
  }

  if (fu.status === 'completed') {
    return `
      <div class="fu-card">
        <div class="fu-status-row">
          ${ic('check',18)}
          <div>
            <div class="fu-status-title">Sequence complete</div>
            <div class="fu-status-sub">All ${DEFAULT_SEQUENCE.length} follow-ups sent.</div>
          </div>
        </div>
      </div>`;
  }

  // opted_in
  const step     = DEFAULT_SEQUENCE.find(s => s.step === fu.current_step) || DEFAULT_SEQUENCE[0];
  const cfg      = KLT_CONFIG[step.klt];

  let currentBlock = '';
  if (fu.pending_approval && fu.draft) {
    currentBlock = `
      <div class="fu-draft">
        <div class="fu-draft-label">${ic('inbox',11)} Follow-up ${fu.current_step} · ${step.name} · needs review</div>
        <div class="fu-draft-text" id="fu-dt-${lead.id}">${fu.draft}</div>
      </div>
      ${editing ? `
        <div class="fu-edit-area">
          <textarea id="fu-ei-${lead.id}">${fu.draft}</textarea>
          <div class="fu-btns" style="margin-top:6px">
            <button class="btn btn-sm btn-green" onclick="saveEditedDraft(${lead.id})">${ic('check',13)} Save & Send</button>
            <button class="btn btn-sm btn-ghost" onclick="cancelEdit(${lead.id})">Cancel</button>
          </div>
        </div>
      ` : rewriting ? `
        <div class="fu-rewrite-area">
          <input id="fu-ri-${lead.id}" placeholder="e.g. 'make it shorter', 'mention the payment plan'…" />
          <div class="fu-btns" style="margin-top:8px">
            <button class="btn btn-sm btn-ghost" onclick="submitRewrite(${lead.id})">${ic('refresh',13)} Rewrite</button>
            <button class="btn btn-sm btn-ghost" onclick="cancelEdit(${lead.id})">Cancel</button>
          </div>
        </div>
      ` : `
        <div class="fu-btns">
          <button class="btn btn-sm btn-green" onclick="approveDraft(${lead.id})">${ic('check',13)} Approve</button>
          <button class="btn btn-sm btn-ghost" onclick="editDraft(${lead.id})">${ic('edit',13)} Edit</button>
          <button class="btn btn-sm btn-ghost" onclick="rewriteDraft(${lead.id})">${ic('refresh',13)} Rewrite</button>
          <button class="btn btn-sm btn-red" onclick="skipDraft(${lead.id})">${ic('x',13)}</button>
        </div>
      `}
    `;
  } else if (fu.next_due) {
    const overdue = new Date(fu.next_due) < new Date();
    currentBlock = `
      <div style="display:flex;align-items:center;gap:10px;padding:2px 0 12px;border-bottom:1px solid var(--line);margin-bottom:4px">
        <div style="width:34px;height:34px;border-radius:9px;background:${cfg.bg};display:flex;align-items:center;justify-content:center;color:${cfg.color};flex-shrink:0">
          <span class="ic" style="width:16px;height:16px">${TOUCHPOINT_ICONS[step.type]}</span>
        </div>
        <div>
          <div style="font-size:12px;font-weight:600;color:var(--ink)">Follow-up ${fu.current_step} · ${step.name}</div>
          <div style="font-size:11px;color:${overdue ? 'var(--red)' : 'var(--ink-4)'};margin-top:2px">
            ${overdue ? '⚠ Overdue' : `Due in ${timeUntil(fu.next_due)}`} · ${step.desc}
          </div>
        </div>
      </div>`;
  }

  return `
    <div class="fu-card">
      <div class="fu-card-head">
        <div class="fu-card-title">
          <span>Follow-up Sequence</span>
          <span style="color:var(--ink-4)">${fu.sent_steps.length}/${DEFAULT_SEQUENCE.length} sent</span>
        </div>
        ${renderPhaseBar(lead)}
        ${currentBlock}
      </div>
      <div class="fu-seq-toggle" onclick="toggleSequence(${lead.id})">
        <span>${isExp ? '↑ Hide timeline' : '↓ View all 11 steps'}</span>
        <span class="pref-link" onclick="event.stopPropagation();navigateToPreferences('followup-materials')">Edit →</span>
      </div>
      ${isExp ? `<div class="fu-seq">${renderSequenceTimeline(lead)}</div>` : ''}
    </div>`;
}

// ─── Detail panel ─────────────────────────────────────────────────────────────
function renderDetailPanel(lead) {
  if (!lead) {
    return `
      <div class="lv3-placeholder">
        <div class="lv3-placeholder-card">
          ${ic('person', 56)}
          <div>
            <p>Select a lead to view their profile</p>
            <div class="sub">Click any lead from the list on the left to see full details</div>
          </div>
        </div>
      </div>`;
  }

  const sc    = stateConfig(lead.lead_state);
  const ql    = qualityLabel(lead.lead_quality);
  const waUrl = `https://wa.me/${lead.phone.replace(/\D/g,'')}`;

  const fuPending = lead.followup?.pending_approval;

  return `
    <div onclick="mobileBackFromDetail(event)" class="mobile-back-btn">
      ${ic('arrow',14)} Back to leads
    </div>
    <div class="lv3-detail-scroll">
      <!-- Header -->
      <div class="lv3-dh">
        <div class="lv3-dh-left">
          <div class="lv3-dh-avatar">${lead.name.charAt(0)}</div>
          <div>
            <div class="lv3-dh-name">${lead.name}</div>
            <div class="lv3-dh-sub">
              <span class="lv3-dh-phone">${lead.phone}</span>
              <span class="tp tp-state" style="background:none;border:none;padding:0;font-size:10px;color:var(--ink-3)">
                <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${sc.dot};margin-right:3px"></span>${sc.label}
              </span>
              ${ql === 'Hot' ? `<span class="tp tp-hot">${ql}</span>` : ql === 'Warm' ? `<span class="tp tp-warm">${ql}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="lv3-dh-actions">
          <button class="btn btn-ghost btn-sm" onclick="openChatDrawer(${lead.id})">${ic('chat',14)} Chat</button>
          <a href="tel:${lead.phone.replace(/\D/g,'')}" class="btn btn-ghost btn-sm" style="text-decoration:none">${ic('phone',14)}</a>
          <a href="${waUrl}" target="_blank" class="btn btn-primary btn-sm" style="text-decoration:none">${ic('wa',14)} WhatsApp</a>
        </div>
      </div>

      ${lead.lead_type === 'personal' ? `
        <div class="personal-notice">
          ${ic('person',14)}
          <span>Personal contact — no buying intent detected. Not included in follow-up queues.</span>
        </div>` : ''}

      <!-- Drawer launchers -->
      ${lead.lead_type !== 'personal' ? `
        <div class="drawer-open-row">
          <div class="drawer-open-btn" onclick="openProfileDrawer(${lead.id})">
            ${ic('eye',15)} <span>View Profile</span>
          </div>
          <div class="drawer-open-btn ${fuPending ? 'green-hl' : ''}" onclick="openFollowupsDrawer(${lead.id})">
            ${ic('list',15)} <span>Follow-ups${fuPending ? ' ·&thinsp;1' : ''}</span>
          </div>
        </div>` : ''}

      <!-- Follow-up card (inline) -->
      ${renderFollowupCard(lead)}

      <!-- Next action -->
      ${lead.next_action_plan ? `
        <div class="action-card">
          <div class="action-card-top">
            <span class="action-label">${ic('spark',12)} Suggested next step</span>
            <span class="ai-badge">AI</span>
          </div>
          <div class="action-text">${lead.next_action_plan}</div>
          <div class="action-btns">
            <button class="btn btn-primary btn-sm" onclick="alert('Queued for AI send at optimal time.')">
              ${ic('send',13)} Queue for AI
            </button>
            <a href="${waUrl}?text=${encodeURIComponent(lead.next_action_plan)}" target="_blank" class="btn btn-ghost btn-sm" style="text-decoration:none">
              ${ic('wa',13)} Send now
            </a>
          </div>
        </div>` : ''}

    </div>
  `;
}

// ─── Profile Drawer ───────────────────────────────────────────────────────────
function openProfileDrawer(leadId) {
  const lead = mockLeads.find(l => l.id === leadId);
  if (!lead) return;
  const waUrl = `https://wa.me/${lead.phone.replace(/\D/g,'')}`;
  const rows = [
    lead.customer_intent && ['Intent', lead.customer_intent],
    lead.psychology      && ['Psychology', lead.psychology],
    lead.conv_stage      && ['Stage', lead.conv_stage],
    lead.follow_up_count !== undefined && ['Follow-ups sent', lead.follow_up_count],
    ['Last seen', timeAgo(lead.last_seen) + ' ago'],
  ].filter(Boolean);

  const cart = (lead.cart_state||[]).length > 0 ? `
    <div class="lv3-section" style="margin-top:20px">
      <div class="lv3-sec-label">${ic('cart',12)} Interested in</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">${lead.cart_state.map(i=>`<span class="tag">${i}</span>`).join('')}</div>
    </div>` : '';

  const trust = (lead.trust_markers||[]).length > 0 ? `
    <div class="lv3-section" style="margin-top:20px">
      <div class="lv3-sec-label">${ic('check',12)} Trust markers</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">${lead.trust_markers.map(m=>`<span class="tag green">${ic('check',11)} ${m}</span>`).join('')}</div>
    </div>` : '';

  const vibe = lead.vibe_check ? `
    <div class="lv3-section" style="margin-top:20px">
      <div class="lv3-sec-label">${ic('eye',12)} Vibe check</div>
      <div class="card card-pad" style="font-size:13px;color:var(--ink-2);line-height:1.6;font-style:italic">${lead.vibe_check}</div>
    </div>` : '';

  const adSection = lead.is_ad_lead ? `
    <div class="lv3-section" style="margin-top:20px">
      <div class="lv3-sec-label">${ic('ad',12)} Ad attribution</div>
      <div class="card card-pad" style="display:flex;gap:12px;align-items:flex-start">
        ${lead.ad_thumbnail_url
          ? `<img src="${lead.ad_thumbnail_url}" style="width:48px;height:48px;border-radius:8px;object-fit:cover;flex-shrink:0" alt="Ad">`
          : `<div style="width:48px;height:48px;border-radius:8px;background:var(--bg-hover);flex-shrink:0;display:flex;align-items:center;justify-content:center;color:var(--ink-4)">${ic('ad',18)}</div>`}
        <div>
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--ink-4);margin-bottom:3px">${lead.ad_platform||'Meta'}</div>
          <div style="font-size:13px;font-weight:600;color:var(--ink);margin-bottom:3px">${lead.ad_headline||'—'}</div>
          <div style="font-size:11px;color:var(--ink-3);line-height:1.4">${(lead.ad_body||'').slice(0,100)}${(lead.ad_body||'').length>100?'…':''}</div>
        </div>
      </div>
    </div>` : '';

  openDrawer('profile-drawer', `${lead.name}'s Profile`, `
    <div class="card card-pad" style="margin-bottom:0">
      ${rows.map(([k,v]) => `
        <div class="profile-row">
          <span class="profile-key">${k}</span>
          <span class="profile-val">${v}</span>
        </div>`).join('')}
    </div>
    ${cart}${trust}${vibe}${adSection}
    <div style="margin-top:20px;display:flex;gap:8px">
      <a href="${waUrl}" target="_blank" class="btn btn-primary" style="flex:1;justify-content:center;text-decoration:none">${ic('wa',14)} Open WhatsApp</a>
      <button class="btn btn-ghost" onclick="openBoughtModal('${leadId}')">
        ${ic('coin',14)} Mark bought
      </button>
    </div>
  `);
}

// ─── Follow-ups Drawer ────────────────────────────────────────────────────────
function openFollowupsDrawer(leadId) {
  const lead = mockLeads.find(l => l.id === leadId || l.id === Number(leadId));
  if (!lead) return;
  openDrawer('followups-drawer', 'Follow-up Sequence', renderFollowupsDrawerContent(lead));
}

function renderFollowupsDrawerContent(lead) {
  return `
    ${renderFollowupCard(lead)}
    <div style="margin-top:4px;padding-top:16px;border-top:1px solid var(--line)">
      <div class="lv3-sec-label" style="margin-bottom:12px">${ic('list',12)} Full Sequence Timeline</div>
      ${renderSequenceTimeline(lead)}
    </div>`;
}

// ─── Chat Drawer ──────────────────────────────────────────────────────────────
function openChatDrawer(leadId) {
  const lead = mockLeads.find(l => l.id === leadId || l.id === Number(leadId));
  if (!lead) return;
  const waUrl = `https://wa.me/${lead.phone.replace(/\D/g,'')}`;

  const bubbles = (lead.transcript||[]).map(t => {
    let wrapCls, bubCls, sender;
    if (t.sender==='AI')   { wrapCls='out'; bubCls='bubble-ai';   sender='AI'; }
    else if (t.sender==='User') { wrapCls='out'; bubCls='bubble-user'; sender='You'; }
    else { wrapCls='in'; bubCls='bubble-lead'; sender=t.sender; }
    return `
      <div class="chat-bw ${wrapCls}">
        <span class="chat-sender">${sender}</span>
        <div class="chat-bubble ${bubCls}">${t.msg}</div>
        <span class="chat-time">${t.time}</span>
      </div>`;
  }).join('');

  const el = openDrawer('chat-drawer', `Chat · ${lead.name.split(' ')[0]}`, null, true);

  // Build custom drawer layout with sticky input
  const drawer = document.getElementById('chat-drawer');
  const body   = drawer.querySelector('.lv3-drawer-body');
  body.style.display = 'flex';
  body.style.flexDirection = 'column';
  body.style.padding = '0';
  body.innerHTML = `
    <div class="chat-messages" id="chat-msgs-${lead.id}">${bubbles}</div>
    <div class="chat-input-wrap">
      <div class="chat-reply-as">
        <span class="chat-reply-label">Reply as</span>
        <div class="chat-reply-modes">
          <span class="chat-reply-mode ai">AI</span>
          <span class="chat-reply-mode you">You</span>
        </div>
      </div>
      <div class="chat-input-row">
        <input type="text" placeholder="Type a message…" onkeydown="if(event.key==='Enter')alert('Message queued')">
        <button class="chat-send" onclick="alert('Message queued')">${ic('send',15)}</button>
      </div>
      <div style="text-align:center;margin-top:10px">
        <a href="${waUrl}" target="_blank" style="font-size:11px;color:var(--blue);font-weight:600;text-decoration:none">Open in WhatsApp ↗</a>
      </div>
    </div>
  `;
  // Scroll to bottom
  setTimeout(() => {
    const msgs = document.getElementById(`chat-msgs-${lead.id}`);
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }, 50);
}

// ─── Approval Drawer ──────────────────────────────────────────────────────────
function openApprovalDrawer() {
  const pending = mockLeads.filter(l => l.followup?.pending_approval);
  const content = pending.length === 0 ? `
    <div class="lv3-empty" style="height:200px">
      ${ic('check',36)}
      <p style="font-size:14px;font-weight:700;color:var(--ink)">All clear</p>
      <p>No follow-ups waiting for approval.</p>
    </div>` : `
    ${pending.length > 0 ? `
      <div style="background:var(--amber-bg);border:1px solid #fcd34d;border-radius:8px;padding:10px 14px;margin-bottom:16px;font-size:11px;font-weight:600;color:var(--amber)">
        ${pending.length} follow-up${pending.length>1?'s':''} waiting · takes ~1 minute to review
      </div>` : ''}
    ${pending.map(lead => {
      const fu   = lead.followup;
      const step = DEFAULT_SEQUENCE.find(s => s.step === fu.current_step) || DEFAULT_SEQUENCE[0];
      const cfg  = KLT_CONFIG[step.klt];
      return `
        <div class="approval-item">
          <div class="approval-item-head">
            <div>
              <div class="approval-item-name">${lead.name}</div>
              <div style="display:flex;align-items:center;gap:5px;margin-top:3px">
                <span style="font-size:10px;font-weight:600;color:var(--ink-3)">Follow-up ${fu.current_step} · ${step.name}</span>
                <span class="fu-klt" style="background:${cfg.bg};color:${cfg.color}">${step.klt}</span>
              </div>
            </div>
            <button onclick="openLeadDetail(${lead.id});closeAllDrawers()" style="background:none;border:none;cursor:pointer;font-size:10px;font-weight:700;color:var(--blue)">View →</button>
          </div>
          <div class="approval-item-draft">${fu.draft}</div>
          <div style="display:flex;gap:6px">
            <button class="btn btn-sm btn-green" style="flex:1;justify-content:center" onclick="approveDraft(${lead.id});refreshApprovalDrawer()">
              ${ic('check',13)} Approve
            </button>
            <button class="btn btn-sm btn-ghost" onclick="openLeadDetail(${lead.id});closeAllDrawers()">Open lead</button>
            <button class="btn btn-sm btn-red" onclick="skipDraft(${lead.id});refreshApprovalDrawer()">
              ${ic('x',13)}
            </button>
          </div>
        </div>`;
    }).join('')}`;

  openDrawer('approval-drawer', 'Approval Inbox', content);
}

function refreshApprovalDrawer() {
  const drawer = document.getElementById('approval-drawer');
  if (!drawer || !drawer.classList.contains('open')) return;
  rerenderAll();
  openApprovalDrawer();
}

// ─── Generic drawer system ────────────────────────────────────────────────────
const _openDrawers = new Set();

function openDrawer(id, title, content, skipBody = false) {
  let overlay = document.getElementById('lv3-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'lv3-overlay';
    overlay.className = 'lv3-overlay-bg';
    overlay.onclick = closeAllDrawers;
    document.body.appendChild(overlay);
  }

  let drawer = document.getElementById(id);
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.id = id;
    drawer.className = 'lv3-drawer';
    drawer.innerHTML = `
      <div class="lv3-drawer-head">
        <div class="lv3-drawer-title" id="${id}-title"></div>
        <button class="btn btn-icon" onclick="closeDrawer('${id}')">${ic('x',15)}</button>
      </div>
      <div class="lv3-drawer-body" id="${id}-body"></div>
    `;
    document.body.appendChild(drawer);
  }

  document.getElementById(`${id}-title`).textContent = title;
  if (!skipBody && content !== null) {
    document.getElementById(`${id}-body`).innerHTML = content;
  }

  requestAnimationFrame(() => {
    overlay.classList.add('open');
    drawer.classList.add('open');
  });
  _openDrawers.add(id);
  return drawer;
}

function closeDrawer(id) {
  document.getElementById(id)?.classList.remove('open');
  _openDrawers.delete(id);
  if (_openDrawers.size === 0) {
    document.getElementById('lv3-overlay')?.classList.remove('open');
  }
}

function closeAllDrawers() {
  _openDrawers.forEach(id => document.getElementById(id)?.classList.remove('open'));
  _openDrawers.clear();
  document.getElementById('lv3-overlay')?.classList.remove('open');
}

// ─── Bought modal ─────────────────────────────────────────────────────────────
let activeBoughtLeadId = null;

function openBoughtModal(leadId) {
  activeBoughtLeadId = Number(leadId) || leadId;
  const lead = mockLeads.find(l => l.id === activeBoughtLeadId || l.id === Number(leadId));

  let modal = document.getElementById('lv3-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'lv3-modal-overlay';
    modal.className = 'lv3-modal-overlay';
    modal.innerHTML = `
      <div class="lv3-modal">
        <div class="lv3-modal-title">Record sale${lead ? ` · ${lead.name.split(' ')[0]}` : ''}</div>
        <div class="lv3-modal-field">
          <label>Product / service sold</label>
          <input id="modalProductInput" type="text" value="${lead?.cart_state?.[0] || ''}" />
        </div>
        <div class="lv3-modal-field">
          <label>Amount (KES)</label>
          <input id="modalAmountInput" type="number" placeholder="0" />
        </div>
        <div class="lv3-modal-actions">
          <button class="btn btn-primary" style="flex:1;justify-content:center" onclick="confirmPurchase()">
            ${ic('check',14)} Confirm sale
          </button>
          <button class="btn btn-ghost" onclick="closeBoughtModal()">Cancel</button>
        </div>
      </div>
    `;
    modal.onclick = function(e) { if (e.target === modal) closeBoughtModal(); };
    document.body.appendChild(modal);
  } else {
    document.getElementById('lv3-modal-overlay').querySelector('.lv3-modal-title').textContent = `Record sale${lead ? ` · ${lead.name.split(' ')[0]}` : ''}`;
    document.getElementById('modalProductInput').value = lead?.cart_state?.[0] || '';
    document.getElementById('modalAmountInput').value = '';
  }

  requestAnimationFrame(() => document.getElementById('lv3-modal-overlay').classList.add('open'));
}

function closeBoughtModal() {
  document.getElementById('lv3-modal-overlay')?.classList.remove('open');
  activeBoughtLeadId = null;
}

function confirmPurchase() {
  const lead = mockLeads.find(l => l.id === activeBoughtLeadId);
  if (lead) {
    lead.lead_state = 'won';
    lead.conv_stage = 'Closed';
    if (!lead.followup) lead.followup = {};
    lead.followup.active = false;
    lead.product_sold  = document.getElementById('modalProductInput').value;
    lead.deal_value    = document.getElementById('modalAmountInput').value;
    lead.purchase_date = new Date().toISOString();
    rerenderAll();
    alert(`✓ Sale recorded for ${lead.name.split(' ')[0]}!`);
  }
  closeBoughtModal();
}

// ─── Follow-up actions ────────────────────────────────────────────────────────
function approveDraft(leadId) {
  const lead = mockLeads.find(l => l.id === leadId || l.id === Number(leadId));
  if (!lead?.followup) return;
  lead.followup.pending_approval = false;
  lead.followup.sent_steps       = [...(lead.followup.sent_steps||[]), lead.followup.current_step];
  lead.followup.current_step     = lead.followup.current_step + 1;
  lead.followup.draft            = null;
  lead.followup.next_due         = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
  editingFollowupId = null;
  rerenderAll();
  alert(`✓ Follow-up sent to ${lead.name.split(' ')[0]}!`);
}

function skipDraft(leadId) {
  const lead = mockLeads.find(l => l.id === leadId || l.id === Number(leadId));
  if (!lead?.followup) return;
  lead.followup.pending_approval = false;
  lead.followup.draft            = null;
  editingFollowupId = null;
  rerenderAll();
}

function editDraft(leadId) {
  editingFollowupId = Number(leadId) || leadId;
  rerenderAll();
  setTimeout(() => {
    const ta = document.getElementById(`fu-ei-${leadId}`);
    if (ta) { ta.focus(); ta.selectionStart = ta.value.length; }
  }, 50);
}

function saveEditedDraft(leadId) {
  const ta   = document.getElementById(`fu-ei-${leadId}`);
  const lead = mockLeads.find(l => l.id === leadId || l.id === Number(leadId));
  if (!ta || !lead?.followup) return;
  lead.followup.draft = ta.value;
  approveDraft(leadId);
}

function rewriteDraft(leadId) {
  editingFollowupId = `${leadId}-rewrite`;
  rerenderAll();
  setTimeout(() => {
    const inp = document.getElementById(`fu-ri-${leadId}`);
    if (inp) inp.focus();
  }, 50);
}

function submitRewrite(leadId) {
  const inp  = document.getElementById(`fu-ri-${leadId}`);
  const lead = mockLeads.find(l => l.id === leadId || l.id === Number(leadId));
  if (!inp || !lead?.followup) return;
  const instruction = inp.value || 'make it shorter';
  lead.followup.draft = `[Rewritten: "${instruction}"] ${lead.followup.draft?.slice(0, 80)}…`;
  editingFollowupId   = null;
  rerenderAll();
}

function cancelEdit(leadId) {
  editingFollowupId = null;
  rerenderAll();
}

function sendConsentMessage(leadId) {
  const lead = mockLeads.find(l => l.id === leadId || l.id === Number(leadId));
  if (!lead?.followup) return;
  lead.followup.status       = 'consent_sent';
  lead.followup.current_step = 1;
  rerenderAll();
  alert(`✓ Consent message sent to ${lead.name.split(' ')[0]}!`);
}

function toggleSequence(leadId) {
  sequenceExpanded[leadId] = !sequenceExpanded[leadId];
  rerenderAll();
  // Refresh follow-ups drawer if open
  const fuDrawer = document.getElementById('followups-drawer');
  if (fuDrawer?.classList.contains('open')) {
    const lead = mockLeads.find(l => l.id === leadId || l.id === Number(leadId));
    if (lead) {
      const body = document.getElementById('followups-drawer-body');
      if (body) body.innerHTML = renderFollowupsDrawerContent(lead);
    }
  }
}

function navigateToPreferences(tab) {
  if (typeof PAGE_CONFIG !== 'undefined' && PAGE_CONFIG.preferences) {
    PAGE_CONFIG.preferences.render(tab);
  } else {
    alert(`Opening Preferences → Follow-up Materials`);
  }
}

// ─── Mobile navigation ────────────────────────────────────────────────────────
function mobileBackFromDetail(e) {
  if (!(e.target.classList.contains('mobile-back-btn') || e.target.closest('.mobile-back-btn'))) return;
  const listPanel   = document.querySelector('.lv3-list-panel');
  const detailPanel = document.querySelector('.lv3-detail-panel');
  listPanel?.classList.remove('slide-left');
  detailPanel?.classList.remove('slide-in');
  activeLeadId = null;
}

// ─── State mutations ──────────────────────────────────────────────────────────
function setStateFilter(s)    { activeLeadStateFilter = s; rerenderList(); }
function setTypeFilter(t)     { activeLeadTypeFilter  = t; rerenderList(); }
function handleLeadsSearch(q) { leadsSearchQuery = q;       rerenderList(); }

async function openLeadDetail(id) {
  const lead = mockLeads.find(l => l.id === id);
  if (!lead) return;

  activeLeadId = id;

  // Lazy-load live message records from the database before showing the chat panel
  if (window.leadsService) {
      console.log(`[Chat UI] Fetching live chat transcript for lead ID: ${id}`);
      lead.transcript = await window.leadsService.fetchChatTranscript(id);
  }
  
  // Refresh panels with live message data
  const detailPanel = document.getElementById('leads-detail-panel');
  if (detailPanel) detailPanel.innerHTML = renderDetailPanel(lead);

  const chatPanel = document.getElementById('leads-chat-panel');
  if (chatPanel) chatPanel.innerHTML = renderChatPanel(lead);

  // Highlight active row
  document.querySelectorAll('.lead-row').forEach(row => {
    row.classList.toggle('active', parseInt(row.getAttribute('data-id')) === id);
  });
}

// ─── Re-render helpers ────────────────────────────────────────────────────────
function rerenderList() {
  const stats    = getLeadStats();
  const filtered = getFilteredLeads();

  const statsEl  = document.getElementById('lv3-stats-el');
  const tabsEl   = document.getElementById('lv3-tabs-el');
  const listEl   = document.getElementById('lv3-list-el');
  if (statsEl) statsEl.innerHTML = renderStatChips(stats);
  if (tabsEl)  tabsEl.innerHTML  = renderFilterTabs();
  if (listEl) {
    listEl.innerHTML = filtered.length
      ? filtered.map(renderLeadRow).join('')
      : `<div class="lv3-empty">${ic('search',36)}<p>No leads match your filters</p></div>`;
  }
}

function rerenderAll() {
  const lead     = mockLeads.find(l => l.id === activeLeadId) || null;
  const detailEl = document.getElementById('lv3-detail-inner');
  if (detailEl) detailEl.innerHTML = renderDetailPanel(lead);
  rerenderList();
}

// ─── Main render ──────────────────────────────────────────────────────────────
async function renderLeadsContent() {
  injectLeadsStyles();

  const contentArea = document.getElementById('content-area');
  if (!contentArea) return;

  // Fetch active business context and load live data from database
  const businessId = window.getActiveBusinessId();
  if (businessId && window.leadsService) {
      const liveLeads = await window.leadsService.fetchLiveLeads(businessId);
      if (liveLeads) {
          mockLeads = liveLeads;
          console.log("[Leads UI] Live data records mounted successfully.");
      }
  }

// ─── Register Module ──────────────────────────────────────────────────────────
if (typeof PAGE_CONFIG !== 'undefined') {
  PAGE_CONFIG.leads = {
    title:       'Leads',
    description: 'Manage and track all your leads.',
    navId:       'nav-leads',
    render:      renderLeadsContent
  };
}

  contentArea.classList.remove('items-center','justify-center','p-4','overflow-y-auto');
  contentArea.classList.add('overflow-hidden');
  contentArea.style.padding = '0';

  const stats    = getLeadStats();
  const filtered = getFilteredLeads();

  contentArea.innerHTML = `
    <div class="lv3-wrap">

      <!-- ── Left: list panel ─────────────────── -->
      <div class="lv3-list-panel">
        <div class="lv3-panel-top">

          <!-- Title row -->
          <div class="lv3-panel-title">
            <h2>Leads</h2>
            <div class="lv3-top-actions">
              <button class="btn btn-ghost btn-sm" onclick="openApprovalDrawer()" style="${stats.pending > 0 ? 'background:var(--amber-bg);border-color:#fcd34d;color:var(--amber)' : ''}">
                ${ic('inbox',14)}
                Approvals
                ${stats.pending > 0 ? `<span style="background:var(--amber);color:#fff;border-radius:4px;padding:0 5px;font-size:9px;font-weight:700">${stats.pending}</span>` : ''}
              </button>
              <button class="btn btn-primary btn-sm" onclick="openAddLeadModal()">
                ${ic('plus',14)}
              </button>
            </div>
          </div>

          <!-- Stats -->
          <div id="lv3-stats-el">${renderStatChips(stats)}</div>

          <!-- Search -->
          <div class="lv3-search">
            <span class="ic" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);width:16px;height:16px;color:var(--ink-4)">${ICON.search}</span>
            <input type="text" placeholder="Search name, product, intent…" value="${leadsSearchQuery}" oninput="handleLeadsSearch(this.value)">
          </div>

          <!-- Filter tabs -->
          <div id="lv3-tabs-el">${renderFilterTabs()}</div>
        </div>

        <!-- List -->
        <div class="lv3-list" id="lv3-list-el">
          ${filtered.length
            ? filtered.map(renderLeadRow).join('')
            : `<div class="lv3-empty">${ic('search',36)}<p>No leads match your filters</p></div>`}
        </div>
      </div>

      <!-- ── Right: detail panel ───────────────── -->
      <div class="lv3-detail-panel" id="lv3-detail-inner">
        ${renderDetailPanel(null)}
      </div>

    </div>
  `;
}

function renderLeadsList() { renderLeadsContent(); }

// ─── Stub for add lead ────────────────────────────────────────────────────────
function openAddLeadModal() {
  alert('Add Lead — connect to your lead creation flow.');
}

// ─── Home section hooks ───────────────────────────────────────────────────────
window.heysasaLeads = {
  getPendingCount:   () => mockLeads.filter(l => l.followup?.pending_approval).length,
  getHotLeads:       () => mockLeads.filter(l => l.lead_quality === 'hot' && l.lead_state === 'engaged'),
  getUnreadCount:    () => mockLeads.filter(l => l.unread_count > 0).length,
  openApprovalInbox: openApprovalDrawer,
  openLead:          (id) => { if (typeof renderLeadsContent === 'function') { renderLeadsContent(); setTimeout(() => openLeadDetail(id), 100); } }
};

// ─── Register page config ─────────────────────────────────────────────────────
if (typeof PAGE_CONFIG !== 'undefined') {
  PAGE_CONFIG.leads = {
    title:       'Leads',
    description: 'Manage and track all your leads.',
    navId:       'nav-leads',
    render:      renderLeadsContent
  };
}