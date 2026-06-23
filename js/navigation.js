/**
 * navigation.js — HeySasa! Navigation & Bootstrap Gateway
 * (Patched Version)
 */

window.PAGE_CONFIG = {};

let _currentPage          = null;
let _debounceTimer        = null;
let _onboardingFetched    = false;
let _onboardingRetryCount = 0;
const MAX_ONBOARDING_RETRIES = 5;

function _showLoader() {
    const el = document.getElementById('content-area');
    if (!el) return;
    el.className = 'w-full h-full p-4 md:p-8 overflow-y-auto custom-scrollbar absolute inset-0 z-10 opacity-100 pointer-events-auto';
    el.innerHTML = `<div style="padding:20px;">Loading application...</div>`;
}

function _renderOnboardingGate(page) {
    const el = document.getElementById('content-area');
    if (!el) return undefined;
    const d = window.onboardingData || {};
    if (d.whatsapp_connected) return 'pass_through';
    
    el.innerHTML = '<div style="padding:48px;text-align:center;"><h2>Setup Required</h2><p>Please complete onboarding to access this page.</p></div>';
    return undefined;
}

function _renderPageError(page, err) {
    const el = document.getElementById('content-area');
    if (el) el.innerHTML = '<div style="padding:48px;text-align:center;"><h2>We hit a small snag</h2><button onclick="window.switchPage(\'' + page + '\')">Try Again</button></div>';
}

function _renderNotRegistered(page) {
    const el = document.getElementById('content-area');
    if (el) el.innerHTML = '<div style="padding:48px;text-align:center;"><h2>Coming Soon</h2></div>';
}

function _enforceAuthentication() {
    const sessionToken = localStorage.getItem('session_id');
    if (!sessionToken) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

async function _loadOnboardingStatus() {
    if (_onboardingFetched) return true;

    const client = window.supabaseClient || (window.getSupabase ? window.getSupabase() : null);
    if (!client) {
        _onboardingRetryCount++;
        if (_onboardingRetryCount <= MAX_ONBOARDING_RETRIES) {
            await new Promise(r => setTimeout(r, 200));
            return _loadOnboardingStatus();
        }
        return false;
    }

    _onboardingRetryCount = 0;

    try {
        const { data: { user } } = await client.auth.getUser();
        if (!user) return false;

        let { data: biz } = await client.from('businesses').select('id').eq('user_id', user.id).maybeSingle();
        
        if (!biz) {
            const fallbackUrl = localStorage.getItem('onboarding_target_url') || 'https://heysasa.com/placeholder';
            
            // FIX: Generate unique business_id and handle potential insert errors gracefully
            const { data: newBiz, error: insertError } = await client.from('businesses')
                .insert({ 
                    business_id: crypto.randomUUID(), 
                    user_id: user.id, 
                    website_url: fallbackUrl, 
                    name: user.email.split('@')[0], 
                    status: 'pending' 
                })
                .select()
                .maybeSingle();

            if (insertError) {
                console.error('❌ DATABASE INSERT REJECTION:', insertError.message);
                return false; // Stop the loop here
            }
            biz = newBiz;
        }

        if (!biz || !biz.id) return false;

        const bId = biz.id;
        localStorage.setItem('business_id', bId);

        let result = await client.from('business_onboarding').select('*').eq('business_id', bId).maybeSingle();
        let data = result.data;

        if (!data && !result.error) {
            const insertResult = await client.from('business_onboarding')
                .insert({ business_id: bId, current_step: 1, onboarding_complete: false })
                .select().single();
            data = insertResult.data;
        }

        if (data) {
            window.onboardingData = data;
            _onboardingFetched = true;
            return true;
        }
        return false;
    } catch (err) {
        console.error('[nav] Critical failure:', err);
        return false;
    }
}

window.switchPage = function(page) {
    if (_debounceTimer) clearTimeout(_debounceTimer);
    _debounceTimer = setTimeout(function() { _runSwitch(page); }, 150);
};

async function _runSwitch(page) {
    if (!_enforceAuthentication()) return;

    const onboardingReady = await _loadOnboardingStatus();
    if (!onboardingReady) {
        if (_onboardingRetryCount <= MAX_ONBOARDING_RETRIES) {
            setTimeout(function() { window.switchPage(page); }, 300);
        } else {
            _renderPageError(page, new Error('Initialization failure.'));
        }
        return;
    }

    const businessId = localStorage.getItem('business_id');
    const config = window.PAGE_CONFIG[page];

    _showLoader();
    _currentPage = page;

    if (page === 'overview' || page === 'preferences') {
        if (config && typeof config.render === 'function') {
            await config.render(businessId);
        } else {
            _renderNotRegistered(page);
        }
        return;
    }

    const isComplete = window.onboardingData && window.onboardingData.onboarding_complete === true;
    if (!isComplete) {
        if (_renderOnboardingGate(page) !== 'pass_through') return;
    }

    if (config && typeof config.render === 'function') {
        await config.render(businessId);
    } else {
        _renderNotRegistered(page);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    if (!_enforceAuthentication()) return;
    await _loadOnboardingStatus();
    window.switchPage('overview');
});