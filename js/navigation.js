/**
 * navigation.js — HeySasa! Navigation & Bootstrap Gateway
 */

window.PAGE_CONFIG = {};

let _currentPage          = null;
let _debounceTimer        = null;
let _onboardingFetched    = false;
let _onboardingRetryCount = 0;
const MAX_ONBOARDING_RETRIES = 5;

function _showLoader() {
    console.log('[nav] _showLoader triggered. Rendering skeleton loader components into user layout space.');
    const el = document.getElementById('content-area');
    if (!el) {
        console.warn('[nav] _showLoader aborted: targeting container element #content-area context is missing.');
        return;
    }
    
    el.className = 'w-full h-full p-4 md:p-8 overflow-y-auto custom-scrollbar absolute inset-0 z-10 opacity-100 pointer-events-auto';
    el.innerHTML = `
        <style>
            @keyframes shimmer {
                0%   { background-position: -200% 0; }
                100% { background-position:  200% 0; }
            }
            .sk {
                background: linear-gradient(90deg,#F8FAFC 25%,#E2E8F0 50%,#F8FAFC 75%);
                background-size: 200% 100%;
                animation: shimmer 2s infinite linear;
                border: 1px solid #E2E8F0;
                box-shadow: 0 1px 2px rgba(0,0,0,.05);
            }
            .sk-pill {
                background: linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%);
                background-size: 200% 100%;
                animation: shimmer 2s infinite linear;
                border-radius: 8px;
            }
        </style>
        <div style="width:100%;height:100%;display:flex;flex-direction:column;gap:24px;padding:8px;box-sizing:border-box;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <div class="sk-pill" style="width:250px;height:36px;"></div>
                <div class="sk-pill" style="width:120px;height:36px;"></div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;">
                <div class="sk" style="height:130px;border-radius:16px;"></div>
                <div class="sk" style="height:130px;border-radius:16px;"></div>
                <div class="sk" style="height:130px;border-radius:16px;"></div>
            </div>
            <div class="sk" style="flex:1;border-radius:16px;min-height:400px;"></div>
        </div>`;
}

function _renderOnboardingGate(page) {
    console.log('[nav] _renderOnboardingGate authorization check initiated for page route target:', page);
    const el = document.getElementById('content-area');
    if (!el) {
        console.warn('[nav] _renderOnboardingGate aborted: target element container canvas #content-area is missing.');
        return undefined;
    }

    const d = window.onboardingData || {};
    console.log('[nav] Onboarding gate memory context data parameters analysis:', d);

    // WHATSAPP CONNECTED PASSCARD: If WhatsApp is up, everything opens up instantly
    if (d.whatsapp_connected) {
        console.log('[nav] Onboarding validation gate bypass success: WhatsApp connection channel is flagged active.');
        return 'pass_through';
    }

    const configs = {
        analytics: {
            iconBg: '#EFF6FF', iconColor: '#3B82F6',
            icon: '<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>',
            title: 'Analytics unlock after WhatsApp connects',
            desc: 'Once your WhatsApp is linked, your AI will analyze live conversation metrics and surface your insights here.',
            step: 2,
        },
        leads: {
            iconBg: '#F0FDF4', iconColor: '#22C55E',
            icon: '<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
            title: 'Your leads populate once WhatsApp is connected',
            desc: 'Leads are pulled from your incoming WhatsApp conversations. Connect your account first to start tracking profiles.',
            step: 2,
        },
        products: {
            iconBg: '#FFFBEB', iconColor: '#F59E0B',
            icon: '<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
            title: 'Provide product info to launch matching sync',
            desc: 'Adding inventory lets your automated AI agent pitch context, display correct pricing, and confirm details dynamically.',
            step: 5,
        },
        playground: {
            iconBg: '#F5F3FF', iconColor: '#8B5CF6',
            icon: '<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
            title: 'Playground unlocks with WhatsApp data stream',
            desc: 'The conversational sandbox needs an active WhatsApp channel profile linked before simulation triggers can execute.',
            step: 2,
        }
    };

    const cfg = configs[page] || {
        iconBg: '#F1F5F9', iconColor: '#64748B', icon: '',
        title: 'Complete Setup to Unlock',
        desc: 'Finish your onboarding steps to open this page asset section.',
        step: 2,
    };

    console.log('[nav] Locking access to page section. Injecting structural lock constraint display screen config template parameters:', cfg);

    el.innerHTML =
        '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;' +
        'width:100%;height:100%;padding:48px;text-align:center;gap:20px;' +
        'background:#FFFFFF;border-radius:16px;box-sizing:border-box;border:1px dashed #E2E8F0;">' +
            '<div style="background:' + cfg.iconBg + ';color:' + cfg.iconColor + ';padding:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;">' +
                cfg.icon +
            '</div>' +
            '<h2 style="font-size:24px;font-weight:800;color:#0F172A;margin:0;max-width:500px;">' + cfg.title + '</h2>' +
            '<p style="font-size:15px;color:#475569;max-width:440px;line-height:1.6;margin:0 auto;">' + cfg.desc + '</p>' +
            '<div style="margin-top:8px;">' +
                '<button onclick="window.switchPage(\'overview\')" ' +
                    'style="padding:14px 32px;border-radius:12px;background:#0F172A;color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;box-shadow:0 4px 6px -1px rgba(0,0,0,.1);" ' +
                    'onmouseover="this.style.background=\'#1E293B\';" ' +
                    'onmouseout="this.style.background=\'#0F172A\';">' +
                    'Continue Setup &mdash; Step ' + cfg.step +
                '</button>' +
            '</div>' +
        '</div>';

    return undefined;
}

function _renderPageError(page, err) {
    console.error(`[nav] _renderPageError caught terminal operational crash logic exception for route page section: [${page}]. Core stack trace info:`, err);
    const el = document.getElementById('content-area');
    if (!el) {
        console.warn('[nav] _renderPageError aborted: element layout canvas target container context pointer #content-area is absent.');
        return;
    }
    el.innerHTML =
        '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;' +
        'width:100%;height:100%;padding:48px;text-align:center;gap:16px;box-sizing:border-box;">' +
            '<div style="background:#FEE2E2;padding:20px;border-radius:50%;">' +
                '<svg width="36" height="36" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">' +
                    '<circle cx="12" cy="12" r="10"/>' +
                    '<line x1="12" y1="8" x2="12" y2="12"/>' +
                    '<line x1="12" y1="16" x2="12.01" y2="16"/>' +
                '</svg>' +
            '</div>' +
            '<div style="font-size:22px;font-weight:700;color:#0F172A;margin-top:8px;">We hit a small snag</div>' +
            '<div style="font-size:15px;color:#64748B;max-width:340px;line-height:1.6;">' +
                'We could not load this right now. It might be a quick connection issue.' +
            '</div>' +
            '<button onclick="window.switchPage(\'' + page + '\')" ' +
                'style="margin-top:16px;padding:12px 28px;border-radius:10px;background:#FFFFFF;color:#0F172A;' +
                'font-size:14px;font-weight:600;border:1px solid #CBD5E1;cursor:pointer;">' +
                'Try Again' +
            '</button>' +
        '</div>';
}

function _renderNotRegistered(page) {
    console.warn(`[nav] _renderNotRegistered caught navigation switch target request for an unregistered or unseeded page configuration module slot view reference: [${page}].`);
    const el = document.getElementById('content-area');
    if (!el) {
        console.warn('[nav] _renderNotRegistered aborted: target container pointer layout slot element reference #content-area is absent.');
        return;
    }
    el.innerHTML =
        '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;' +
        'width:100%;height:100%;padding:48px;text-align:center;gap:16px;box-sizing:border-box;">' +
            '<div style="background:#F1F5F9;padding:20px;border-radius:50%;">' +
                '<svg width="36" height="36" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">' +
                    '<path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>' +
                '</svg>' +
            '</div>' +
            '<div style="font-size:22px;font-weight:700;color:#0F172A;margin-top:8px;">Coming Soon</div>' +
            '<div style="font-size:15px;color:#64748B;max-width:340px;line-height:1.6;">' +
                'We are polishing this feature. Check back shortly!' +
            '</div>' +
        '</div>';
}

function _enforceAuthentication() {
    const sessionToken = localStorage.getItem('session_id');
    console.log('[nav] _enforceAuthentication verifying existence metric profile status parameters for key session_id. Present token state:', !!sessionToken);
    if (!sessionToken) {
        console.warn('[nav] No session token found inside user localStorage repository layout — redirecting execution context focus back to core login gateway index.html.');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

async function _loadOnboardingStatus() {
    console.log('[nav] _loadOnboardingStatus script pass triggered. Previous execution lifecycle fetch check flag:', _onboardingFetched);
    if (_onboardingFetched) return true;

    const client = window.supabaseClient || (window.getSupabase ? window.getSupabase() : null);
    if (!client) {
        _onboardingRetryCount++;
        console.warn(`[nav] Supabase driver link connection client context absent from window instance storage repository memory layer stack slot. Triggering loop retry block count: ${_onboardingRetryCount} of ${MAX_ONBOARDING_RETRIES}`);
        if (_onboardingRetryCount <= MAX_ONBOARDING_RETRIES) {
            await new Promise(r => setTimeout(r, 200));
            return _loadOnboardingStatus();
        }
        console.error('[nav] Supabase structural initialization loop resolution failed after hitting ceiling constraint boundary parameter limits.');
        return false;
    }

    _onboardingRetryCount = 0;

    try {
        console.log('[nav] Dispatching Supabase client authentication query to verify active system user profile status schema state.');
        const { data: { user } } = await client.auth.getUser();
        console.log('[nav] User query result payload meta returned successfully:', user ? `Email: ${user.email} (ID: ${user.id})` : 'Null/Absent User context');
        if (!user) return false;

        // Ensure business record placeholder is located or set up
        console.log(`[nav] Checking business ledger tracking table registries for entry associated with user identifier trace link: ${user.id}`);
        let { data: biz } = await client.from('businesses').select('id').eq('user_id', user.id).maybeSingle();
        
        if (!biz) {
            const fallbackUrl = localStorage.getItem('onboarding_target_url') || 'https://heysasa.com/placeholder';
            console.log(`[nav] Business entity row entry absent. Triggering automated fallback database construction insertion sequence with website_url: ${fallbackUrl}`);
            const { data: newBiz } = await client.from('businesses')
                .insert({ user_id: user.id, website_url: fallbackUrl, company_name: user.email.split('@')[0], status: 'pending' })
                .select().single();
            biz = newBiz;
            console.log('[nav] Newly inserted backup structural placeholder business entry record generated data entity:', biz);
        }

        if (!biz?.id) {
            console.error('[nav] Critical validation interruption anomaly: Resolved business data entry reference object structure block is corrupted or missing tracking id.');
            return false;
        }
        
        const bId = biz.id;
        console.log('[nav] Synchronized business entity tracking token mapped to active application instance state storage registry:', bId);
        localStorage.setItem('business_id', bId);

        console.log(`[nav] Querying client table entry configuration for business_onboarding linked to business tracking key: ${bId}`);
        let result = await client.from('business_onboarding').select('*').eq('business_id', bId).maybeSingle();
        let data = result.data;
        if (result.error) console.error('[nav] Supabase selection error trace returned during validation checkout of onboarding data step entity registry:', result.error);

        if (!data && !result.error) {
            console.log('[nav] Onboarding data tracking state matrix records row entity missing from table database slot. Emitting initial row initialization transaction values.');
            const insertResult = await client.from('business_onboarding')
                .insert({ business_id: bId, current_step: 1, onboarding_complete: false })
                .select().single();
            data = insertResult.data;
            console.log('[nav] Fresh initial database record instantiation setup for onboarding status row entity complete:', data);
        }

        if (data) {
            console.log('[nav] Assigning processed workflow metrics data reference array directly to window.onboardingData globally:', data);
            window.onboardingData = data;
            _onboardingFetched = true;
            return true;
        }
        return false;
    } catch (err) {
        console.error('[nav] Status loading error caught critical thread process interruption logic crash validation sequence trace exception:', err);
        return false;
    }
}

window.switchPage = function(page) {
    console.log(`[nav] window.switchPage global trigger listener sequence mapped for page key target reference route: [${page}]`);
    if (_debounceTimer) {
        console.log('[nav] Debounce interaction shift detected. Resetting scheduling interval timeouts.');
        clearTimeout(_debounceTimer);
    }
    _debounceTimer = setTimeout(function() { 
        console.log(`[nav] Debounce execution buffer window complete. Routing internal page shift task command over to runtime compiler loop for target page view: [${page}]`);
        _runSwitch(page); 
    }, 150);
};

async function _runSwitch(page) {
    console.log(`[nav] _runSwitch processing sequence loop evaluation initiated for target page: [${page}]`);
    if (!_enforceAuthentication()) {
        console.warn('[nav] _runSwitch runtime process aborted: credential validation check failed user token profile is missing.');
        return;
    }

    const onboardingReady = await _loadOnboardingStatus();
    console.log(`[nav] Runtime synchronization status check overview for onboarding dependency database state engine metrics context: ${onboardingReady}`);
    
    if (!onboardingReady) {
        if (_onboardingRetryCount <= MAX_ONBOARDING_RETRIES) {
            console.warn(`[nav] App layer bootstrap data is still loading or unready. Deferring layout compilation render execution loop sequence back into stack queue scheduler loop for page: [${page}]`);
            setTimeout(function() { window.switchPage(page); }, 300);
        } else {
            console.error('[nav] Aborting view route resolution thread sequence. Target dependency structural mapping layer initialization hit a ceiling failure threshold.');
            _renderPageError(page, new Error('Initialization failure.'));
        }
        return;
    }

    const businessId = localStorage.getItem('business_id');
    console.log(`[nav] Executing switch layout pass sequence for active client context business identifier string code: ${businessId}`);

    console.log('[nav] Cleaning active status navigation links highlights from document layout element arrays.');
    document.querySelectorAll('[id^="nav-"]').forEach(el => el.classList.remove('active'));
    
    const config = window.PAGE_CONFIG[page];
    console.log(`[nav] Resolving mapped PAGE_CONFIG object metadata for requested router page component instance [${page}]:`, config);
    
    const navIdTargetKey = (config && config.navId) ? config.navId : ('nav-' + page);
    const navEl = document.getElementById(navIdTargetKey);
    if (navEl) {
        console.log(`[nav] Sidebar sidebar element hook match confirmed. Applying active focus toggle style classes onto DOM node identifier: #${navIdTargetKey}`);
        navEl.classList.add('active');
    } else {
        console.log(`[nav] Sidebar element element identifier hook missed or absent for targeting attribute container node: #${navIdTargetKey}`);
    }

    const titleEl = document.getElementById('section-title');
    const descEl  = document.getElementById('section-description');
    if (titleEl) {
        titleEl.textContent = (config && config.title) ? config.title : (page.charAt(0).toUpperCase() + page.slice(1));
    }
    if (descEl) {
        descEl.textContent  = (config && config.description) ? config.description : '';
    }

    _showLoader();
    _currentPage = page;

    // Overview routes directly to onboarding workflow wizard view if incomplete
    if (page === 'overview') {
        console.log('[nav] Special routing mapping exception tracking match found: processing routing logic conditions rule check for page view section: overview');
        if (!config || typeof config.render !== 'function') {
            _renderNotRegistered(page);
            return;
        }
        try { 
            console.log(`[nav] Invoking render function for overview page section config with businessId context: ${businessId}`);
            await config.render(businessId); 
        } catch (err) { 
            _renderPageError(page, err); 
        }
        return;
    }

    // EXEMPT PREFERENCES PAGE: Passes straight through to query database records
    if (page === 'preferences') {
        console.log('[nav] Special routing layout permission exception bypass mapping detected: processing bypass pass-through rule check matching target element section section: preferences');
        if (!config || typeof config.render !== 'function') {
            _renderNotRegistered(page);
            return;
        }
        try { 
            console.log(`[nav] Invoking render function for preferences page module with businessId context: ${businessId}`);
            await config.render(businessId); 
        } catch (err) { 
            _renderPageError(page, err); 
        }
        return;
    }

    // GATED DATA SECTIONS: Block leads, analytics, products, playground if whatsapp is offline
    const isComplete = window.onboardingData && window.onboardingData.onboarding_complete === true;
    console.log(`[nav] Evaluating gated asset authorization conditions rule matching boundaries. Onboarding complete metric status tracking parameter value: ${isComplete}`);
    
    if (!isComplete) {
        console.log(`[nav] Onboarding is incomplete. Evaluating access gate for page section: [${page}]`);
        const gateResult = _renderOnboardingGate(page);
        console.log(`[nav] Access gate resolution loop check logic returned response calculation output token string: ${gateResult}`);
        if (gateResult !== 'pass_through') {
            console.warn(`[nav] Route access request denied. Authorization gate script successfully intercepted navigation transition context to block view render flow for: [${page}]`);
            return; 
        }
    }

    if (!config || typeof config.render !== 'function') {
        _renderNotRegistered(page);
        return;
    }

    try {
        console.log(`[nav] Executing standard module custom compilation layout render callback stream for target asset section: [${page}] using businessId: ${businessId}`);
        await config.render(businessId);
    } catch (err) {
        _renderPageError(page, err);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    console.log('[nav] DOMContentLoaded cycle process broadcast event detected. Initializing shell system application entry gateway bootstrap operations.');
    
    if (!_enforceAuthentication()) {
        console.warn('[nav] DOMContentLoaded bootstrap flow terminated. Session identification authorization clearance validation check failed.');
        return;
    }
    
    console.log('[nav] Bootstrapping background application data metrics initialization layers.');
    await _loadOnboardingStatus();

    console.log('[nav] Attaching dynamic live element event click click interaction intercept listeners over sidebar menu navigation link button elements arrays.');
    document.querySelectorAll('[id^="nav-"]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const targetPageNameStringCode = item.id.replace('nav-', '');
            console.log(`[nav] Navigation link sidebar click action captured. Extracting target view state reference index from element element ID: #${item.id} -> Mapped component page route: [${targetPageNameStringCode}]`);
            window.switchPage(targetPageNameStringCode);
        });
    });

    console.log('[nav] Initial initialization sequence configuration routine check loop completely setup. Defaulting layout viewport mapping back onto core root home page section: overview');
    window.switchPage('overview');
});