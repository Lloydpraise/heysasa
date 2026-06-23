/**
 * onboarding.js — HeySasa! New-User Setup Wizard  (v4)
 *
 * Registers as PAGE_CONFIG.overview ONLY when onboarding_complete is false.
 * If onboarding_complete is already true when this module loads,
 * it skips registration entirely — dashboard-overview.js owns the slot.
 *
 * State lives in window.onboardingData (populated by nav.js on boot).
 * This module UPDATES that object in-place and writes through to Supabase;
 * it never re-fetches from scratch unless nav.js hasn't populated yet.
 *
 * Onboarding steps:
 * 1. Load Credits          (credits_paid)
 * 2. Connect WhatsApp      (whatsapp_connected) — cleaner auto-triggers history sync
 * 3. Process Leads         (leads_total_found, auto_activated=30, slider for more)
 * 4. Configure Follow-ups  (followup_configured)
 * 5. Add Products          (products_seeded — cleaner auto-approves first 30)
 * → current_step = 6 + onboarding_complete = true → hand off to dashboard-overview.js
 *
 * v4 changes vs v3:
 * - Step 3: reads leads_total_found (pre-scan count) for slider max so it
 * renders immediately; slider starts at auto_activated_count not 0;
 * cost preview shows delta cost only (server handles idempotency).
 * - Step 3: polls sync_status while waiting so total count updates live.
 * - Step 3: handles insufficient_funds_auto stage with top-up CTA.
 * - Step 5: reads products_auto_approved_count + products_pending_approval
 * from onboarding; shows approve CTA for pending images instead of
 * a manual "Process & Add" button.
 * - processLeads() removed — cleaner handles history sync automatically.
 * - Bot build polling also handles insufficient_funds_auto stage.
 * - All slider math accounts for already-activated leads (auto + user).
 */

(function () {
    'use strict';

    // ─── Constants ─────────────────────────────────────────────────────────────
    const AUTO_ACTIVATE_COUNT = 30;
    const CLEANER_URL = window.CLEANER_SERVICE_URL || 'http://129.213.33.173:3000';

    // ─── Helpers ───────────────────────────────────────────────────────────────
    function getBusinessId() {
        const id = localStorage.getItem('business_id');
        console.log('[Onboarding] getBusinessId read:', id);
        return id;
    }

    function getSupabase() {
        return window.getSupabase?.();
    }

    // ─── Supabase write helper ─────────────────────────────────────────────────
    async function _persistUpdate(fields) {
        console.log('[Onboarding] _persistUpdate called with fields:', fields);
        const client     = getSupabase();
        const businessId = getBusinessId();
        if (!client || !businessId) {
            console.warn('[Onboarding] Persist skipped — missing client or businessId');
            return;
        }
        const { error } = await client
            .from('business_onboarding')
            .update({ ...fields, updated_at: new Date().toISOString() })
            .eq('business_id', businessId);
        if (error) {
            console.error('[Onboarding] Persist failed error:', error);
        } else {
            console.log('[Onboarding] Persist successful for fields:', fields);
        }
    }

    // ─── Advance step ──────────────────────────────────────────────────────────
    async function advanceStep(newStep) {
        console.log('[Onboarding] advanceStep called. Target newStep:', newStep);
        if (!window.onboardingData) {
            console.warn('[Onboarding] advanceStep() called without onboardingData');
            return;
        }
        const fields = { current_step: newStep };
        if (newStep > 5) {
            console.log('[Onboarding] Step > 5 detected. Marking onboarding as complete.');
            fields.onboarding_complete = true;
            await _persistUpdate(fields);
            Object.assign(window.onboardingData, fields);
            console.log('[Onboarding] Switching page view to dashboard overview.');
            window.switchPage('overview');
            return;
        }
        await _persistUpdate(fields);
        Object.assign(window.onboardingData, fields);
        console.log('[Onboarding] Current memory state updated. Re-rendering UI context.');
        _render();
    }

    // ─── Toast ─────────────────────────────────────────────────────────────────
    function showToast(message, type = 'success') {
        console.log(`[Onboarding] showToast triggered [Type: ${type}]: ${message}`);
        let toast = document.getElementById('hs-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'hs-toast';
            toast.style.cssText = `
                position:fixed;bottom:24px;right:24px;padding:14px 22px;border-radius:12px;
                font-size:14px;font-weight:600;color:#fff;
                box-shadow:0 8px 24px rgba(0,0,0,.15);
                transform:translateY(80px);opacity:0;
                transition:transform .3s cubic-bezier(.34,1.56,.64,1),opacity .3s;
                z-index:9999;
            `;
            document.body.appendChild(toast);
        }
        toast.style.background = type === 'error' ? '#EF4444' : '#0F172A';
        toast.textContent = message;
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity   = '1';
        });
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.style.transform = 'translateY(80px)';
            toast.style.opacity   = '0';
        }, 4000);
    }

    // ─── WA modal state ────────────────────────────────────────────────────────
    let _waPollTimer        = null;
    let _progressTextInterval = null;
    let _isConnectingWa     = false;
    let _instanceName       = null;

    function startProgressPhrasesLoop() {
        console.log('[Onboarding] Starting loop for automated progress loading text phrases.');
        const phrases = [
            "Analyzing business profile...",
            "Organizing internal databases...",
            "Assembling system catalog...",
            "Learning business information rules...",
            "Training AI swarm agents...",
            "Polishing operational workflows..."
        ];
        let index = 0;
        if (_progressTextInterval) clearInterval(_progressTextInterval);
        _progressTextInterval = setInterval(() => {
            index = (index + 1) % phrases.length;
            const el = document.getElementById('wa-loader-text');
            if (el) {
                console.log('[Onboarding] Switching modal progress text display to:', phrases[index]);
                el.textContent = phrases[index];
            }
        }, 4500);
    }

    // ─── WA connection polling ─────────────────────────────────────────────────
    function startBackgroundStatusPolling() {
        console.log('[Onboarding] startBackgroundStatusPolling initialized for WhatsApp status.');
        if (_waPollTimer) clearInterval(_waPollTimer);
        const client     = getSupabase();
        const businessId = getBusinessId();

        _waPollTimer = setInterval(async () => {
            try {
                const { data } = await client
                    .from('business_onboarding')
                    .select('whatsapp_connected, sync_status, leads_total_found')
                    .eq('business_id', businessId)
                    .single();

                console.log('[Onboarding] WhatsApp background status poll check returned:', data);

                if (!data) return;

                const loaderEl = document.getElementById('wa-loader-text');
                if (loaderEl && data.sync_status?.message) {
                    loaderEl.textContent = data.sync_status.message;
                }

                if (data.whatsapp_connected) {
                    console.log('[Onboarding] Pole verification success: whatsapp_connected is now TRUE.');
                    clearInterval(_waPollTimer);
                    if (_progressTextInterval) clearInterval(_progressTextInterval);

                    const textEl = document.getElementById('wa-loader-text');
                    if (textEl) textEl.textContent = 'WhatsApp Linked Successfully!';

                    Object.assign(window.onboardingData, {
                        whatsapp_connected:   true,
                        leads_total_found:    data.leads_total_found || 0,
                        sync_status:          data.sync_status
                    });

                    setTimeout(async () => {
                        window.closeWhatsAppModal?.();
                        showToast('WhatsApp Connected!');
                        await advanceStep(3);
                    }, 1500);
                }
            } catch (err) {
                console.error('[Onboarding] WhatsApp modal loop polling exception error:', err);
            }
        }, 4000);
    }

    // ─── WA modal ──────────────────────────────────────────────────────────────
    window.openWhatsAppModal = async function () {
        console.log('[Onboarding] openWhatsAppModal triggered. Connection processing state:', _isConnectingWa);
        if (_isConnectingWa) return;
        _isConnectingWa = true;

        const modal       = document.getElementById('wa-modal');
        const content     = document.getElementById('wa-modal-content');
        const loadingZone = document.getElementById('wa-loading-zone');
        const authZone    = document.getElementById('wa-auth-zone');
        const qrImg       = document.getElementById('wa-qr-img');

        if (!modal) {
            console.warn('[Onboarding] Could not find #wa-modal in DOM.');
            return;
        }

        authZone.classList.add('hidden');
        loadingZone.classList.remove('hidden');
        loadingZone.innerHTML = `
            <div class="w-8 h-8 border-4 border-slate-200 border-t-[#28A745] rounded-full animate-spin mx-auto mb-3"></div>
            <p id="wa-loader-text" class="text-sm font-bold text-slate-500 animate-pulse">Initializing...</p>
        `;

        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100', 'pointer-events-auto');
        setTimeout(() => {
            content?.classList.remove('scale-95', 'translate-y-4', 'opacity-0');
            content?.classList.add('scale-100', 'translate-y-0', 'opacity-100');
        }, 10);

        startProgressPhrasesLoop();

        try {
            const businessId = getBusinessId();
            const websiteUrl = window.onboardingData?.website_url || '';
            const payload = { action: 'create_instance', businessId, websiteUrl };
            
            console.log('[Onboarding] Dispatching create_instance payload to edge orchestrator:', payload);
            
            const response   = await fetch(
                'https://xgtnbxdxbbywvzrttixf.supabase.co/functions/v1/onboarding-ochestrator',
                {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('[Onboarding] Orchestrator instance context response received:', data);

            if (data?.qrcode) {
                _instanceName         = data.instance_name;
                window._instanceToken = data.instance_token;
                console.log(`[Onboarding] Session assigned. Instance name: ${_instanceName}, Token set successfully.`);
                
                loadingZone.classList.add('hidden');
                authZone.classList.remove('hidden');
                const qr  = data.qrcode;
                qrImg.src = qr.startsWith('data:') ? qr : `data:image/png;base64,${qr}`;
                startBackgroundStatusPolling();
            } else {
                throw new Error('No QR code returned from server.');
            }
        } catch (err) {
            console.error('[Onboarding] Orchestrator instance generation caught error:', err);
            if (_progressTextInterval) clearInterval(_progressTextInterval);
            _isConnectingWa = false;
            loadingZone.innerHTML = `
                <div class="p-4 bg-red-50 rounded-xl border border-red-100">
                    <svg class="w-8 h-8 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p class="text-xs font-bold text-red-700 mb-2">Connection Failed</p>
                    <p class="text-xs text-red-600 font-medium">${err.message}</p>
                </div>
            `;
        }
    };

    window.closeWhatsAppModal = function () {
        console.log('[Onboarding] closeWhatsAppModal executed. Resetting modal instance configuration metrics.');
        _isConnectingWa       = false;
        _instanceName         = null;
        window._instanceToken = null;
        const modal   = document.getElementById('wa-modal');
        const content = document.getElementById('wa-modal-content');
        if (_waPollTimer)         clearInterval(_waPollTimer);
        if (_progressTextInterval) clearInterval(_progressTextInterval);
        content?.classList.remove('scale-100', 'translate-y-0', 'opacity-100');
        content?.classList.add('scale-95', 'translate-y-4', 'opacity-0');
        setTimeout(() => {
            modal?.classList.remove('opacity-100', 'pointer-events-auto');
            modal?.classList.add('opacity-0', 'pointer-events-none');
        }, 200);
    };

    window.toggleMobileView = async function () {
        console.log('[Onboarding] toggleMobileView triggered.');
        const qrContainer     = document.getElementById('wa-qr-container');
        const mobileContainer = document.getElementById('wa-mobile-container');
        const toggleBtn       = document.getElementById('mobile-toggle-btn');

        if (!mobileContainer.classList.contains('hidden')) {
            mobileContainer.classList.add('hidden');
            qrContainer.classList.remove('hidden');
            toggleBtn.textContent = 'Are you using a mobile phone? Click here';
            return;
        }

        qrContainer.classList.add('hidden');
        mobileContainer.classList.remove('hidden');
        toggleBtn.textContent = 'Switch back to QR scan code';

        const existingCode = document.getElementById('wa-pairing-code');
        if (existingCode) return;

        mobileContainer.innerHTML = `
            <p class="text-[10px] font-bold text-[#0F172A] uppercase tracking-wider mb-3">Enter your WhatsApp number</p>
            <div class="flex gap-2 mb-3">
                <input id="wa-phone-input" type="tel" placeholder="+254 7XX XXX XXX"
                       class="flex-1 px-3 py-2.5 text-sm font-medium rounded-xl border border-slate-200
                              bg-white focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20"/>
                <button onclick="requestPairingCode()"
                        class="px-4 py-2.5 bg-[#0F172A] text-white text-sm font-bold rounded-xl
                               hover:bg-slate-800 transition-all whitespace-nowrap">
                    Get Code
                </button>
            </div>
            <p class="text-[10px] text-slate-400 font-medium">Include country code e.g. +254712345678</p>
        `;
    };

    window.requestPairingCode = async function () {
        const input       = document.getElementById('wa-phone-input');
        const phoneNumber = input?.value?.trim();
        console.log('[Onboarding] requestPairingCode execution input data phone number:', phoneNumber);
        
        if (!phoneNumber)  { showToast('Enter your phone number first', 'error'); return; }
        if (!_instanceName) { 
            console.warn('[Onboarding] Pairing operation blocked: _instanceName missing.');
            showToast('Session expired. Please close and retry.', 'error'); 
            return; 
        }

        const btn = document.querySelector('[onclick="requestPairingCode()"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Requesting...'; }

        try {
            const payload = {
                action:        'pair_phone',
                instanceName:  _instanceName,
                instanceToken: window._instanceToken,
                phoneNumber
            };
            console.log('[Onboarding] Sending pairing request data packet to orchestrator function:', payload);

            const response = await fetch(
                'https://xgtnbxdxbbywvzrttixf.supabase.co/functions/v1/onboarding-ochestrator',
                {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify(payload)
                }
            );
            const data = await response.json();
            console.log('[Onboarding] Pairing response packet metadata received:', data);

            if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);

            const code      = data.pairing_code;
            const container = document.getElementById('wa-mobile-container');
            container.innerHTML = `
                <p class="text-[10px] font-bold text-[#0F172A] uppercase tracking-wider mb-3">Your Pairing Code</p>
                <div id="wa-pairing-code"
                     class="text-3xl font-black text-[#0F172A] tracking-[0.3em] text-center py-4
                            bg-slate-50 rounded-xl border border-slate-200 mb-4 font-mono">
                    ${code}
                </div>
                <ol class="list-decimal list-inside text-xs text-slate-600 space-y-1.5 font-medium leading-relaxed">
                    <li>Open <b>WhatsApp</b> on your phone</li>
                    <li>Tap <b>Linked Devices → Link with phone number</b></li>
                    <li>Enter the code above</li>
                </ol>
            `;
        } catch (err) {
            console.error('[Onboarding] Phone validation pairing code generation failed error:', err);
            showToast(err.message || 'Failed to get pairing code', 'error');
            if (btn) { btn.disabled = false; btn.textContent = 'Get Code'; }
        }
    };

    // ─── Credits ───────────────────────────────────────────────────────────────
    window.initiatePayment = async function () {
        console.log('[Onboarding] initiatePayment explicitly clicked.');
        showToast('Initiating payment…');
        const client = getSupabase();
        if (client) {
            const { error } = await client.from('business_onboarding')
                .update({ credits_paid: true })
                .eq('business_id', getBusinessId());
            if (error) console.error('[Onboarding] Payment persistence DB error update failed:', error);
        }
        Object.assign(window.onboardingData, { credits_paid: true });
        showToast('Payment confirmed!');
        await advanceStep(2);
    };

    // ─── Lead pricing helper ───────────────────────────────────────────────────
    window.getLeadPrice = function () {
        const dynamicPrice = window.onboardingData?.lead_price_kes;
        const finalPrice = (typeof dynamicPrice === 'number' && dynamicPrice > 0) ? dynamicPrice : 0.75;
        console.log('[Onboarding] getLeadPrice resolved to value:', finalPrice);
        return finalPrice;
    };

    // ─── Step 3 sync_status poller ─────────────────────────────────────────────
    let _syncStatusPollTimer = null;

    function startSyncStatusPolling() {
        console.log('[Onboarding] startSyncStatusPolling function sequence kicked off.');
        if (_syncStatusPollTimer) {
            console.log('[Onboarding] Polling block bypass: sync status poller already running.');
            return;
        }
        const client     = getSupabase();
        const businessId = getBusinessId();

        _syncStatusPollTimer = setInterval(async () => {
            try {
                const { data } = await client
                    .from('business_onboarding')
                    .select(
                        'leads_total_found, leads_auto_activated_count, leads_auto_activated_at, ' +
                        'leads_user_activated_count, sync_status, current_step'
                    )
                    .eq('business_id', businessId)
                    .single();

                console.log('[Onboarding] Step 3 dynamic background synchronization poll status payload data:', data);

                if (!data) return;

                Object.assign(window.onboardingData, {
                    leads_total_found:           data.leads_total_found           || window.onboardingData.leads_total_found,
                    leads_auto_activated_count:  data.leads_auto_activated_count  || 0,
                    leads_auto_activated_at:     data.leads_auto_activated_at,
                    leads_user_activated_count:  data.leads_user_activated_count  || 0,
                    sync_status:                 data.sync_status
                });

                const sliderEl = document.getElementById('leads-slider');
                if (sliderEl && data.leads_total_found) {
                    const newMax = data.leads_total_found;
                    if (parseInt(sliderEl.max) !== newMax) {
                        console.log(`[Onboarding] Slider DOM boundary updated. Old Max: ${sliderEl.max} -> New Max: ${newMax}`);
                        sliderEl.max = newMax;
                        const foundEl = document.getElementById('leads-found-count');
                        if (foundEl) foundEl.textContent = newMax.toLocaleString();
                    }
                }

                _updateSyncStatusUI(data.sync_status);

                if (data.leads_auto_activated_count > 0) {
                    const alreadyActive = (data.leads_auto_activated_count || 0) + (data.leads_user_activated_count || 0);
                    const slider = document.getElementById('leads-slider');
                    if (slider) {
                        slider.min = alreadyActive;
                        if (parseInt(slider.value) < alreadyActive) {
                            console.log(`[Onboarding] Normalizing current slider element value position to current minimum boundary: ${alreadyActive}`);
                            slider.value = alreadyActive;
                            updateLeadSlider(alreadyActive);
                        }
                    }
                    _showAutoActivatedBadge(data.leads_auto_activated_count);
                }

                if (data.current_step > 3) {
                    console.log('[Onboarding] External automated sync lifecycle step mutation detected. Step advanced past 3. Stopping poller loops.');
                    stopSyncStatusPolling();
                    Object.assign(window.onboardingData, { current_step: data.current_step });
                    _render();
                }

            } catch (err) {
                console.error('[Onboarding] Step 3 polling instance validation process loop exception error:', err);
            }
        }, 3000);
    }

    function stopSyncStatusPolling() {
        console.log('[Onboarding] stopSyncStatusPolling triggered. Breaking interval instances.');
        if (_syncStatusPollTimer) {
            clearInterval(_syncStatusPollTimer);
            _syncStatusPollTimer = null;
        }
    }

    function _updateSyncStatusUI(syncStatus) {
        console.log('[Onboarding] _updateSyncStatusUI updating component interface view with metrics:', syncStatus);
        const msgEl = document.getElementById('leads-sync-status-msg');
        if (!msgEl || !syncStatus?.stage) return;

        const stage   = syncStatus.stage;
        const message = syncStatus.message || '';

        if (stage === 'insufficient_funds_auto') {
            console.warn('[Onboarding] Active sync processing stage execution flagged: insufficient_funds_auto.');
            msgEl.innerHTML = `
                <div class="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
                    <svg class="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p class="text-xs font-bold text-red-700">${message}</p>
                </div>
            `;
            return;
        }

        if (['history_received', 'classifying_leads', 'auto_activating'].includes(stage)) {
            msgEl.innerHTML = `
                <div class="flex items-center gap-2 text-slate-400">
                    <div class="w-3 h-3 border-2 border-slate-300 border-t-[#0F172A] rounded-full animate-spin shrink-0"></div>
                    <p class="text-xs font-medium">${message}</p>
                </div>
            `;
            return;
        }

        if (stage === 'leads_activated') {
            const total  = syncStatus.total_activated || syncStatus.auto_count || AUTO_ACTIVATE_COUNT;
            const kes    = syncStatus.charged_kes || syncStatus.last_charged_kes;
            msgEl.innerHTML = `
                <div class="flex items-center gap-2 text-[#28A745]">
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    <p class="text-xs font-bold">${total} leads activated${kes ? ` · KES ${parseFloat(kes).toFixed(2)} charged` : ''}</p>
                </div>
            `;
            return;
        }

        msgEl.innerHTML = '';
    }

    function _showAutoActivatedBadge(count) {
        const badge = document.getElementById('auto-activated-badge');
        if (!badge || badge.dataset.shown === 'true') return;
        console.log('[Onboarding] Displaying verified auto-activated tracking badge UI element.');
        badge.dataset.shown = 'true';
        badge.innerHTML = `
            <div class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-[#28A745]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                <span class="text-xs font-bold text-[#28A745]">${count} leads auto-activated</span>
                <span class="text-xs font-medium text-slate-400">· Use slider to add more</span>
            </div>
        `;
        badge.classList.remove('hidden');
    }

    // ─── Slider interaction ────────────────────────────────────────────────────
    window.updateLeadSlider = function (val) {
        const d             = window.onboardingData || {};
        const count         = parseInt(val, 10);
        const autoActivated = d.leads_auto_activated_count  || 0;
        const userActivated = d.leads_user_activated_count  || 0;
        const alreadyTotal  = autoActivated + userActivated;
        const delta         = Math.max(0, count - alreadyTotal);
        const pricePerLead  = window.getLeadPrice();
        const deltaCost     = (delta * pricePerLead).toFixed(2);

        console.log(`[Onboarding] updateLeadSlider tracking. Component slider value: ${count}, Already Activated total: ${alreadyTotal}, Computed Delta: ${delta}, Derived cost calculation output: KES ${deltaCost}`);

        const displayEl = document.getElementById('leads-selected-display');
        const costEl    = document.getElementById('leads-cost-display');
        const btn       = document.getElementById('activate-leads-btn');

        if (displayEl) displayEl.textContent = count.toLocaleString();
        if (costEl)    costEl.textContent    = delta > 0 ? deltaCost : '0.00';

        if (btn) {
            if (delta <= 0) {
                btn.disabled     = true;
                btn.textContent  = 'Already Activated';
            } else {
                btn.disabled     = false;
                btn.textContent  = `Activate ${delta.toLocaleString()} More`;
            }
        }
    };

    // ─── Lead top-up (calls cleaner /leads/activate) ───────────────────────────
    window.activateSelectedLeads = async function () {
        const slider = document.getElementById('leads-slider');
        const count  = parseInt(slider?.value || '0', 10);
        console.log('[Onboarding] activateSelectedLeads action fired. Desired boundary target slider count state:', count);
        
        if (count < 1) return;

        const d             = window.onboardingData || {};
        const autoActivated = d.leads_auto_activated_count || 0;
        const userActivated = d.leads_user_activated_count || 0;
        const alreadyTotal  = autoActivated + userActivated;
        const delta         = count - alreadyTotal;

        console.log(`[Onboarding] Execution validation constraints checking. Already active leads: ${alreadyTotal}, Attempting activation delta: ${delta}`);

        if (delta <= 0) {
            showToast(`You already have ${alreadyTotal} leads activated.`);
            return;
        }

        const btn = document.getElementById('activate-leads-btn');
        if (btn) { btn.disabled = true; btn.textContent = 'Activating...'; }
        showToast(`Activating ${delta.toLocaleString()} more leads...`);

        try {
            const businessId = getBusinessId();
            const targetEndpoint = `${CLEANER_URL}/leads/activate`;
            const reqPayload = { business_id: businessId, count };
            
            console.log(`[Onboarding] Posting target payload metrics to cleaner instance endpoint [${targetEndpoint}]:`, reqPayload);

            const response   = await fetch(targetEndpoint, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(reqPayload)
            });

            const data = await response.json();
            console.log('[Onboarding] Lead activation network request returns payload response data block:', data);

            if (!response.ok) {
                if (response.status === 402 || data.error === 'insufficient_funds') {
                    throw new Error(`Insufficient funds. You need KES ${data.required_kes?.toFixed(2) || 'more credits'}.`);
                }
                if (response.status === 400 && data.error === 'already_activated') {
                    showToast(`Already activated ${data.already_activated} leads. Slide higher to add more.`);
                    if (btn) { btn.disabled = false; btn.textContent = 'Activate'; }
                    return;
                }
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            Object.assign(window.onboardingData, {
                leads_user_activated_count: (userActivated + data.delta_activated),
                leads_processed:            data.total_activated
            });

            showToast(`${data.delta_activated.toLocaleString()} leads activated!`, 'success');
            updateLeadSlider(slider.value);

        } catch (err) {
            console.error('[Onboarding] Target endpoint batch activation sequence encountered exception failure error:', err);
            showToast(err.message || 'Failed to activate leads.', 'error');
            if (btn) { btn.disabled = false; btn.textContent = 'Activate'; }
        }
    };

    window.skipLeads = async function () {
        console.log('[Onboarding] skipLeads action step invoked.');
        stopSyncStatusPolling();
        showToast('Skipping lead activation for now.');
        Object.assign(window.onboardingData, { leads_processed: window.onboardingData?.leads_auto_activated_count || 0 });
        await advanceStep(4);
    };

    // ─── Follow-ups ────────────────────────────────────────────────────────────
    window.completeFollowUps = async function () {
        console.log('[Onboarding] completeFollowUps configuration step completed.');
        showToast('Saving follow-up preferences…');
        Object.assign(window.onboardingData, { followup_configured: true });
        await advanceStep(5);
    };

    // ─── Products (step 5) ─────────────────────────────────────────────────────
    window.approveProductImages = async function () {
        console.log('[Onboarding] approveProductImages submission process initiated.');
        const btn = document.getElementById('approve-products-btn');
        if (btn) { btn.disabled = true; btn.textContent = 'Approving...'; }
        showToast('Approving product images…');

        try {
            const businessId = getBusinessId();
            const targetEndpoint = `${CLEANER_URL}/products/approve-discovery`;
            const reqPayload = { business_id: businessId };
            
            console.log(`[Onboarding] Dispatching approval payload packet metrics to target url [${targetEndpoint}]:`, reqPayload);

            const response   = await fetch(targetEndpoint, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(reqPayload)
            });

            const data = await response.json();
            console.log('[Onboarding] Product catalog batch approval response metadata returned:', data);

            if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);

            showToast(`${data.approved_count} product images approved!`, 'success');
            Object.assign(window.onboardingData, {
                products_seeded:              true,
                products_auto_approved_count: data.total_approved,
                products_pending_approval:    0
            });
            await advanceStep(6);

        } catch (err) {
            console.error('[Onboarding] Product discovery catalog generation exception catch trace error:', err);
            showToast(err.message || 'Failed to approve images.', 'error');
            if (btn) { btn.disabled = false; btn.textContent = 'Approve Images'; }
        }
    };

    window.completeProducts = async function () {
        console.log('[Onboarding] completeProducts bypassed manual approvals.');
        showToast('Finalising product catalog…');
        Object.assign(window.onboardingData, { products_seeded: true });
        await advanceStep(6);
    };

    // ─── Bot build polling ─────────────────────────────────────────────────────
    let _botPollTimer         = null;
    let _botDotsTimer         = null;
    let _fallbackMessageTimer = null;

    window.startBotBuildPolling = function () {
        console.log('[Onboarding] startBotBuildPolling triggered loop orchestration tracking.');
        if (_botPollTimer) {
            console.log('[Onboarding] Bot pipeline engine polling hook bypass: tracker interval already active.');
            return;
        }
        const client     = getSupabase();
        const businessId = getBusinessId();
        const banner     = document.getElementById('bot-build-banner');
        if (!client || !businessId || !banner) {
            console.warn('[Onboarding] Bot build background context canvas poller initialization aborted: missing dependency components.');
            return;
        }

        let dots = 0;
        _botDotsTimer = setInterval(() => {
            const el = document.getElementById('bot-loading-dots');
            if (el) { dots = (dots + 1) % 4; el.textContent = '.'.repeat(dots); }
        }, 500);

        const fallbackMessages = [
            'Gathering historical data...',
            'Analysing your business profile...',
            'Getting the tone right...',
            'Training your model...',
            'Configuring swarm agents...'
        ];
        let msgIdx = 0;
        _fallbackMessageTimer = setInterval(() => {
            const msgEl = document.getElementById('bot-build-message');
            if (msgEl && !msgEl.dataset.workerOverridden) {
                msgEl.textContent = fallbackMessages[msgIdx];
                msgIdx = (msgIdx + 1) % fallbackMessages.length;
            }
        }, 8000);

        _botPollTimer = setInterval(async () => {
            try {
                console.log('[Onboarding] Dispatching parallel pipeline poll request for sync_status & persona_pack_status metrics.');
                const [onboardingRes, businessRes] = await Promise.all([
                    client.from('business_onboarding')
                          .select('sync_status')
                          .eq('business_id', businessId)
                          .single(),
                    client.from('businesses')
                          .select('persona_pack_status')
                          .eq('business_id', businessId)
                          .single()
                ]);

                const syncStatus    = onboardingRes.data?.sync_status;
                const personaStatus = businessRes.data?.persona_pack_status;

                console.log(`[Onboarding] Parallel bot pipeline engine status returned -> Sync Status:`, syncStatus, `Persona Pack Status:`, personaStatus);

                const msgEl = document.getElementById('bot-build-message');
                if (syncStatus?.message && msgEl && msgEl.textContent !== syncStatus.message) {
                    msgEl.textContent              = syncStatus.message;
                    msgEl.dataset.workerOverridden = 'true';
                }

                if (syncStatus?.stage === 'insufficient_funds_auto') {
                    console.warn('[Onboarding] Bot build tracking detected engine state failure anomaly context: insufficient_funds_auto.');
                    const titleEl = document.getElementById('bot-build-title');
                    if (titleEl) {
                        titleEl.innerHTML = 'Top Up Required';
                        titleEl.classList.replace('text-[#28A745]', 'text-amber-500');
                    }
                    if (msgEl) msgEl.textContent = syncStatus.message || 'Add credits to activate your leads and build your bot.';
                    banner.classList.replace('border-[#28A745]/30', 'border-amber-400/30');
                }

                if (personaStatus === 'ready') {
                    console.log('[Onboarding] Bot build tracking pipeline operation flag completed successfully with status: READY.');
                    clearInterval(_botPollTimer);
                    clearInterval(_botDotsTimer);
                    clearInterval(_fallbackMessageTimer);

                    const titleEl  = document.getElementById('bot-build-title');
                    const emojiEl  = document.getElementById('bot-build-emoji');
                    const actionEl = document.getElementById('bot-build-action');

                    if (titleEl) titleEl.innerHTML = 'Bot Build Completed Successfully!';
                    if (msgEl)   msgEl.textContent  = 'Your AI is fully trained and ready to handle leads.';
                    if (emojiEl) { emojiEl.classList.remove('animate-pulse'); emojiEl.textContent = '✅'; }
                    if (actionEl) actionEl.classList.remove('hidden');
                }

                if (personaStatus === 'insufficient_funds' || personaStatus === 'failed') {
                    console.error(`[Onboarding] Bot pipeline tracking engine reported terminal termination code error state: ${personaStatus}`);
                    clearInterval(_botPollTimer);
                    clearInterval(_botDotsTimer);
                    clearInterval(_fallbackMessageTimer);

                    const titleEl = document.getElementById('bot-build-title');
                    if (titleEl) {
                        titleEl.innerHTML = 'Bot Build Paused';
                        titleEl.classList.replace('text-[#28A745]', 'text-red-500');
                    }
                    if (msgEl) msgEl.textContent = personaStatus === 'insufficient_funds'
                        ? 'Insufficient credits. Please top up to finish building.'
                        : 'An error occurred. We will retry automatically.';
                    banner.classList.replace('border-[#28A745]/30', 'border-red-500/30');
                }

            } catch (err) {
                console.error('[Onboarding] Background engine worker bot orchestration build hook polling exception error:', err);
            }
        }, 5000);
    };

    // ─── Render ────────────────────────────────────────────────────────────────
    function _render() {
        console.log('[Onboarding] _render lifecycle function processing execution pass sequence.');
        const el = document.getElementById('content-area');
        if (!el || !window.onboardingData) {
            console.warn('[Onboarding] _render call aborted: targeting content area element canvas context target or onboardingData memory array is missing.');
            return;
        }

        el.className = 'absolute inset-0 z-10 p-4 md:p-8 overflow-y-auto custom-scrollbar flex items-start justify-center opacity-100 pointer-events-auto transition-opacity duration-700';

        const d           = window.onboardingData;
        const currentStep = d.current_step || 1;

        console.log(`[Onboarding] UI compilation mapping state parameters tracking -> Current Step: ${currentStep}, onboarding_complete state: ${d.onboarding_complete}`);

        if (d.onboarding_complete) { 
            console.log('[Onboarding] Render loop exit bypass checklist validation tracking flag: complete. Invoking dashboard view override switch.');
            window.switchPage('overview'); 
            return; 
        }

        // ── Derived lead counts ───────────────────────────────────────────────
        const totalFound    = d.leads_total_found    || 0;
        const autoActivated = d.leads_auto_activated_count  || 0;
        const userActivated = d.leads_user_activated_count  || 0;
        const alreadyTotal  = autoActivated + userActivated;
        const sliderMin     = alreadyTotal;
        const sliderMax     = Math.max(totalFound, alreadyTotal, 100);
        const sliderInit    = alreadyTotal;

        console.log(`[Onboarding] Derived component lead values compiled -> Total Found: ${totalFound}, Activated Total: ${alreadyTotal}, Slider Bound Constraints: [Min: ${sliderMin}, Max: ${sliderMax}]`);

        // ── Derived product counts ────────────────────────────────────────────
        const autoApproved  = d.products_auto_approved_count || 0;
        const pendingApproval = d.products_pending_approval  || 0;

        console.log(`[Onboarding] Derived step 5 catalog discovery count processing values compiled -> Auto Approved: ${autoApproved}, Pending Approval: ${pendingApproval}`);

        // ── Step 3 action HTML ────────────────────────────────────────────────
        const step3Action = `
            <div class="flex flex-col gap-3 w-full md:w-[320px]">

                <div class="flex justify-between items-center px-1">
                    <span class="text-xs font-bold text-slate-500">
                        Found: <span id="leads-found-count" class="text-[#0F172A] font-black">
                            ${totalFound > 0 ? totalFound.toLocaleString() : '<span class="animate-pulse">scanning...</span>'}
                        </span>
                    </span>
                    <span class="text-xs font-bold text-[#28A745]">
                        Extra cost: KES <span id="leads-cost-display">0.00</span>
                    </span>
                </div>

                <input type="range" id="leads-slider"
                       min="${sliderMin}" max="${sliderMax}" value="${sliderInit}"
                       oninput="updateLeadSlider(this.value)"
                       class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0F172A]">

                <p class="text-center text-sm font-bold text-slate-700 mt-1">
                    Activate <span id="leads-selected-display" class="text-[#0F172A] font-black text-lg">${sliderInit.toLocaleString()}</span> Leads
                </p>

                <div id="auto-activated-badge" class="${autoActivated > 0 ? '' : 'hidden'} transition-all duration-500">
                    ${autoActivated > 0 ? `
                    <div class="flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5 text-[#28A745]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span class="text-xs font-bold text-[#28A745]">${autoActivated} leads auto-activated</span>
                        <span class="text-xs font-medium text-slate-400">· Use slider to add more</span>
                    </div>` : ''}
                </div>

                <div id="leads-sync-status-msg" class="min-h-[28px] transition-all duration-300"></div>

                <div class="flex gap-2 mt-1">
                    <button id="activate-leads-btn"
                            onclick="activateSelectedLeads()"
                            ${alreadyTotal >= sliderMax ? 'disabled' : ''}
                            class="flex-1 px-8 py-3 bg-[#0F172A] text-white font-bold rounded-xl
                                   hover:bg-slate-800 transition-all shadow-lg
                                   disabled:opacity-50 disabled:cursor-not-allowed">
                        ${alreadyTotal >= sliderMax ? 'All Leads Activated' : alreadyTotal > 0 ? 'Activate More' : 'Activate'}
                    </button>
                    <button onclick="skipLeads()"
                            class="px-6 py-3 bg-slate-100 border border-slate-200 text-slate-600
                                   font-bold rounded-xl hover:bg-slate-200 transition-all">
                        Skip
                    </button>
                </div>
            </div>`;

        // ── Step 5 action HTML ────────────────────────────────────────────────
        let step5Action;
        if (autoApproved > 0) {
            step5Action = `
                <div class="flex flex-col gap-3 w-full md:w-[280px]">
                    <div class="flex items-center gap-2 p-3 bg-[#28A745]/10 border border-[#28A745]/20 rounded-xl">
                        <svg class="w-4 h-4 text-[#28A745] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                        <p class="text-xs font-bold text-[#28A745]">${autoApproved} product images sent for analysis</p>
                    </div>
                    ${pendingApproval > 0 ? `
                    <button id="approve-products-btn"
                            onclick="approveProductImages()"
                            class="w-full px-8 py-3 bg-[#0F172A] text-white font-bold rounded-xl
                                   hover:bg-slate-800 transition-all shadow-lg">
                        Approve ${pendingApproval} More Images
                    </button>` : ''}
                    <button onclick="completeProducts()"
                            class="w-full px-8 py-3 bg-slate-100 border border-slate-200 text-slate-600
                                   font-bold rounded-xl hover:bg-slate-200 transition-all">
                        ${pendingApproval > 0 ? 'Skip & Continue' : 'Continue →'}
                    </button>
                </div>`;
        } else {
            step5Action = `
                <div class="flex flex-col gap-3 w-full md:w-[280px]">
                    ${pendingApproval > 0 ? `
                    <p class="text-xs text-slate-500 font-medium px-1">
                        ${pendingApproval} product images found from your WhatsApp history.
                    </p>
                    <button id="approve-products-btn"
                            onclick="approveProductImages()"
                            class="w-full px-8 py-3.5 bg-[#0F172A] text-white font-bold rounded-xl
                                   hover:bg-slate-800 transition-all shadow-lg">
                        Approve & Add to Catalog
                    </button>` : `
                    <p class="text-xs text-slate-400 font-medium px-1">
                        No product images found automatically. You can add products manually from the Products page.
                    </p>`}
                    <button onclick="completeProducts()"
                            class="w-full px-8 py-3.5 ${pendingApproval > 0 ? 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200' : 'bg-[#0F172A] text-white hover:bg-slate-800 shadow-lg'}
                                   font-bold rounded-xl transition-all">
                        ${pendingApproval > 0 ? 'Skip for Now' : 'Continue →'}
                    </button>
                </div>`;
        }

        // ── Steps definition ──────────────────────────────────────────────────
        const steps = [
            {
                id:     1,
                isDone: !!d.credits_paid,
                title:  'Load Credits',
                desc:   'Add KES 1,000 minimum to unlock high-value AI systems.',
                icon:   `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
                action: `<button onclick="initiatePayment()" class="w-full md:w-auto px-8 py-3.5 bg-[#0F172A] text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg whitespace-nowrap">Add Credits</button>`,
            },
            {
                id:     2,
                isDone: !!d.whatsapp_connected,
                title:  'Connect WhatsApp & Train AI',
                desc:   'Link your WhatsApp. Your chat history automatically trains your AI.',
                icon:   `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>`,
                action: `<button onclick="openWhatsAppModal()" class="w-full md:w-auto px-8 py-3.5 bg-[#0F172A] text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg whitespace-nowrap">Connect WhatsApp</button>`,
            },
            {
                id:     3,
                isDone: (currentStep > 3),
                title:  'Process Leads',
                desc:   'Your first 30 leads are activated automatically. Use the slider to add more.',
                icon:   `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`,
                action: step3Action,
            },
            {
                id:     4,
                isDone: !!d.followup_configured,
                title:  'Configure Follow-ups',
                desc:   'Tell your AI how to handle automated follow-ups.',
                icon:   `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`,
                action: `<button onclick="completeFollowUps()" class="w-full md:w-auto px-8 py-3.5 bg-[#0F172A] text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg whitespace-nowrap">Set Preferences</button>`,
            },
            {
                id:     5,
                isDone: !!d.products_seeded,
                title:  'Add Your Products',
                desc:   'Seed your product catalog so your AI can accurately pitch and sell.',
                icon:   `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`,
                action: step5Action,
            },
        ];

        // ── Build step cards ──────────────────────────────────────────────────
        let stepsHTML = '';
        steps.forEach(step => {
            const isActive    = step.id === currentStep;
            const isCompleted = step.isDone || step.id < currentStep;
            const isLocked    = step.id > currentStep && !step.isDone;

            if (isActive) {
                stepsHTML += `
                    <div class="glass-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center
                                justify-between gap-6 shadow-xl border-l-4 border-l-[#0F172A] bg-white
                                transform transition-all duration-500">
                        <div class="flex items-start gap-4 flex-1">
                            <div class="w-12 h-12 bg-[#0F172A] text-white rounded-xl flex items-center
                                        justify-center shrink-0 shadow-lg shadow-slate-900/20">
                                ${step.icon}
                            </div>
                            <div>
                                <h3 class="text-xl font-black text-[#0F172A] mb-1">Step ${step.id}: ${step.title}</h3>
                                <p class="text-sm font-medium text-slate-500 max-w-lg">${step.desc}</p>
                            </div>
                        </div>
                        <div class="w-full md:w-auto">${step.action}</div>
                    </div>`;
            } else if (isCompleted) {
                stepsHTML += `
                    <div class="p-4 flex items-center gap-4 opacity-50 transform scale-95 transition-all duration-500">
                        <div class="w-8 h-8 bg-[#28A745] text-white rounded-full flex items-center justify-center shrink-0">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                        </div>
                        <h3 class="text-sm font-bold text-slate-500 line-through">Step ${step.id}: ${step.title}</h3>
                    </div>`;
            } else if (isLocked) {
                stepsHTML += `
                    <div class="p-4 flex items-center gap-4 opacity-40 transform scale-95 grayscale transition-all duration-500">
                        <div class="w-8 h-8 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center font-bold text-xs">
                            ${step.id}
                        </div>
                        <h3 class="text-sm font-bold text-slate-400">Step ${step.id}: ${step.title}</h3>
                    </div>`;
            }
        });

        const progressPct = Math.round(((currentStep - 1) / 5) * 100);

        el.innerHTML = `
            <div class="flex flex-col w-full max-w-3xl mx-auto pb-10">

                <div id="bot-build-banner"
                     class="${currentStep >= 4 ? 'flex' : 'hidden'} flex-col w-full mb-8 p-4 rounded-xl
                            border border-[#28A745]/30 bg-slate-100/80 backdrop-blur-md shadow-sm transition-all duration-700">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <span id="bot-build-emoji" class="text-2xl animate-pulse">🤖</span>
                            <div>
                                <h4 id="bot-build-title" class="text-sm font-black text-[#28A745] uppercase tracking-wider">
                                    Building your AI bot<span id="bot-loading-dots">...</span>
                                </h4>
                                <p id="bot-build-message" class="text-xs font-bold text-slate-500 mt-0.5">
                                    Organising data and preparing systems...
                                </p>
                            </div>
                        </div>
                        <div id="bot-build-action" class="hidden">
                            <button onclick="window.switchPage('playground')"
                                    class="px-5 py-2.5 bg-[#28A745] text-white text-xs font-black rounded-xl
                                           shadow-lg shadow-[#28A745]/20 hover:bg-[#218838] hover:scale-105 transition-all">
                                Try it Out! 🚀
                            </button>
                        </div>
                    </div>
                </div>

                <div class="mb-6 text-center md:text-left">
                    <h1 class="text-3xl font-black text-[#0F172A] mb-2 tracking-tight">Let's Get You Set Up</h1>
                    <p class="text-sm text-slate-500 font-medium">Complete this quick checklist (&lt; 5 mins) to launch your AI.</p>
                </div>

                <div class="mb-6 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div class="h-2 rounded-full bg-[#0F172A] transition-all duration-700"
                         style="width:${progressPct}%"></div>
                </div>
                <p class="text-xs text-slate-400 font-bold mb-8 text-right -mt-4">${currentStep - 1} of 5 complete</p>

                <div class="flex flex-col gap-3">${stepsHTML}</div>
            </div>

            <div id="wa-modal"
                 class="fixed inset-0 z-[110] flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity duration-300">
                <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onclick="closeWhatsAppModal()"></div>
                <div id="wa-modal-content"
                     class="glass-card w-full max-w-sm relative z-10 p-8 shadow-2xl border border-white/80
                            transform scale-95 translate-y-4 opacity-0 transition-all duration-300 ease-out text-center">

                    <div class="w-12 h-12 bg-[#28A745]/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <svg class="w-6 h-6 text-[#28A745]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                        </svg>
                    </div>

                    <h2 class="text-2xl font-black text-[#0F172A] mb-2 tracking-tight">Link WhatsApp</h2>

                    <div id="wa-loading-zone" class="py-6">
                        <div class="w-8 h-8 border-4 border-slate-200 border-t-[#28A745] rounded-full animate-spin mx-auto mb-3"></div>
                        <p id="wa-loader-text" class="text-sm font-bold text-slate-500 animate-pulse">Initializing...</p>
                    </div>

                    <div id="wa-auth-zone" class="hidden my-4 flex flex-col items-center justify-center">
                        <p class="text-xs text-slate-500 mb-4 font-medium">
                            Point your phone camera toward this code screen to pair instantly.
                        </p>
                        <div id="wa-qr-container" class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
                            <img id="wa-qr-img" class="w-48 h-48 mx-auto mix-blend-multiply" src="" alt="WhatsApp QR Code"/>
                        </div>
                        <div id="wa-mobile-container"
                             class="hidden text-left bg-[#0F172A]/5 border border-[#0F172A]/10 p-4 rounded-xl w-full mb-4">
                            <p class="text-[10px] font-bold text-[#0F172A] uppercase tracking-wider mb-2">Mobile Instructions</p>
                            <ol class="list-decimal list-inside text-xs text-slate-600 space-y-2 font-medium leading-relaxed">
                                <li>Open <b>WhatsApp</b></li>
                                <li>Tap <b>Linked Devices</b></li>
                                <li>Select <b>Link with phone number</b></li>
                                <li>Enter the pairing code shown above</li>
                            </ol>
                        </div>
                        <button id="mobile-toggle-btn" onclick="toggleMobileView()"
                                class="text-xs font-bold text-slate-400 hover:text-[#28A745] underline cursor-pointer mb-2">
                            Are you using a mobile phone? Click here
                        </button>
                    </div>

                    <button onclick="closeWhatsAppModal()"
                            class="w-full mt-2 py-3.5 font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-800
                                   rounded-xl transition-all border border-transparent">
                        Cancel
                    </button>
                </div>
            </div>`;

        if (currentStep === 3) {
            console.log('[Onboarding] Triggering scheduled callback hook for sync polling initialization.');
            setTimeout(() => startSyncStatusPolling(), 100);
        }
        if (currentStep >= 4) {
            console.log('[Onboarding] Triggering scheduled callback hook for bot building execution engine tracker.');
            setTimeout(() => window.startBotBuildPolling(), 100);
        }
    }

    // ─── Public entry point ────────────────────────────────────────────────────
    window._renderOnboarding = async function (businessId) {
        const activeId = businessId || getBusinessId();
        console.log('[Onboarding] window._renderOnboarding script entry invoked. Target activeId:', activeId);

        if (window.onboardingData) {
            console.log('[Onboarding] Initial state check successful: onboardingData found in memory. Proceeding directly to UI composition compilation loop.');
            _render();
            return;
        }

        let client = getSupabase();
        if (!client && typeof window.waitForSupabase === 'function') {
            console.log('[Onboarding] Supabase driver missing from memory slot context. Executing asynchronous fallback delay wait loops.');
            client = await window.waitForSupabase(2000, 100);
        }

        if (!client || !activeId) {
            console.error('[Onboarding] Instantiation process failed: No Supabase client engine link or business identifier trace key available.');
            return;
        }

        try {
            console.log('[Onboarding] Querying business onboarding records table context for ID:', activeId);
            let { data, error } = await client
                .from('business_onboarding')
                .select('*')
                .eq('business_id', activeId)
                .maybeSingle();

            if (error) console.error('[Onboarding] Query interface selection request failure exception error:', error);

            if (!data && !error) {
                console.log('[Onboarding] Target data model row entity missing from table registry. Dispatching initialization creation transaction script.');
                const { data: newRow, error: insertError } = await client
                    .from('business_onboarding')
                    .insert({ business_id: activeId, current_step: 1, onboarding_complete: false })
                    .select()
                    .single();
                if (insertError) console.error('[Onboarding] Table engine row mutation insertion trace exception error:', insertError);
                data = newRow;
            }

            if (data) {
                console.log('[Onboarding] Onboarding state initialization completely synchronized:', data);
                window.onboardingData = data;
                _render();
            } else {
                console.warn('[Onboarding] Pipeline resolution sequence abort warning: empty payload state reference returned for ID:', activeId);
            }
        } catch (err) {
            console.error('[Onboarding] Root initializer compilation loop caught critical execution engine crash trace error:', err);
            throw err;
        }
    };

})();