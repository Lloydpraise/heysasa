/**
 * get-started.js — HeySasa! New User Onboarding
 *
 * Flow:
 *   Step 1 (url)      → validate website URL
 *   Step 2 (login)    → register email + password → signUp → send OTP
 *   Step 3 (otp)      → verify OTP → mark email confirmed
 *   Step 4 (whatsapp) → call onboarding edge function → show QR → poll connection
 *
 * OTP is ONLY sent during new account registration here.
 * Returning users go through login.js instead.
 *
 * localStorage contract (matches dashboard.html boot sequence):
 *   business_id   — short business identifier
 *   session_id    — Supabase session access token
 *   user_email    — for profile.js display
 */

(function () {
    'use strict';

    // ─── State ─────────────────────────────────────────────────────────────────
    let currentEmail       = '';
    let targetWebsiteUrl   = '';
    let currentBusinessId  = null;
    let currentInstanceName = null;
    let connectionPollTimer = null;

    // ─── DOM ───────────────────────────────────────────────────────────────────
    const screens = {
        url:      document.getElementById('step-url'),
        login:    document.getElementById('step-login'),
        otp:      document.getElementById('step-otp'),
        whatsapp: document.getElementById('step-whatsapp'),
    };
    const otpBoxes = document.querySelectorAll('.otp-box');

    // ─── Navigation ────────────────────────────────────────────────────────────
    function goToStep(key) {
        Object.values(screens).forEach(s => s?.classList.remove('active'));
        screens[key]?.classList.add('active');

        const container = document.getElementById('main-container');
        if (container) {
            if (key === 'whatsapp') {
                container.classList.replace('max-w-md', 'max-w-5xl');
            } else {
                container.classList.replace('max-w-5xl', 'max-w-md');
            }
        }
    }

    function updateProgress(pct, text) {
        const bar  = document.getElementById('progress-bar');
        const label = document.getElementById('status-text');
        if (bar)   bar.style.width = pct + '%';
        if (label) label.textContent = text;
    }

    // ─── Intelligent Error Translator ─────────────────────────────────────────
    function getFriendlyErrorMessage(error) {
        if (!error) return 'Please check your email and password.';
        
        const message = error.message || String(error);
        console.error("Caught Auth System Exception:", message);

        if (message.toLowerCase().includes('cannot send') || message.toLowerCase().includes('confirmation mail')) {
            return 'Please check your email and password setup. The authentication service is temporarily throttled. Ensure "Confirm Email" is disabled in your Supabase Auth settings to test signups.';
        }
        if (message.toLowerCase().includes('already registered') || message.toLowerCase().includes('user already exists')) {
            return 'This email address is already registered. Please check your password or head over to the sign in page.';
        }
        if (message.toLowerCase().includes('signup_disabled')) {
            return 'Account creation is currently disabled on this instance. Please check your Supabase configurations.';
        }
        if (message.toLowerCase().includes('password should be')) {
            return 'Password choice rejected. Please verify it meets all strength conditions listed below.';
        }
        if (message.toLowerCase().includes('invalid credentials') || message.toLowerCase().includes('invalid token')) {
            return 'Please check your email and password credentials and try again.';
        }

        return 'Registration issue: ' + message;
    }

    function notify(msg, isError = true) {
        const toast   = document.getElementById('toast');
        const msgEl   = document.getElementById('toast-message');
        if (!toast || !msgEl) return;
        msgEl.textContent = msg;
        
        // Uses Action Orange for system alerts/errors, and Action Green for success responses
        toast.style.backgroundColor = isError ? '#FF8C00' : '#28A745';
        toast.classList.remove('translate-y-[-150%]');
        setTimeout(() => toast.classList.add('translate-y-[-150%]'), 5000);
    }

    // ─── On load: skip to dashboard if already set up ─────────────────────────
    window.addEventListener('DOMContentLoaded', async () => {
        // If they already have a business + session, skip the whole flow
        const existingBusiness = localStorage.getItem('business_id');
        const existingSession  = localStorage.getItem('session_id');
        if (existingBusiness && existingSession) {
            window.location.href = 'dashboard.html';
            return;
        }

        // Check for a live Supabase session (e.g. email link click)
        const client = window.getSupabase?.();
        if (client) {
            const { data: { session } } = await client.auth.getSession();
            if (session) {
                // They verified email via magic link — check if business exists
                const { data: biz } = await client
                    .from('businesses')
                    .select('id')
                    .eq('user_id', session.user.id)
                    .maybeSingle();

                if (biz?.id) {
                    // Already fully onboarded — send to dashboard
                    localStorage.setItem('business_id', biz.id);
                    localStorage.setItem('session_id',  session.access_token);
                    localStorage.setItem('user_email',  session.user.email);
                    window.location.href = 'dashboard.html';
                    return;
                }

                // Authenticated but no business yet — resume from whatsapp step
                currentEmail = session.user.email;
                const instanceName = localStorage.getItem('sb_instance_name');
                if (instanceName) {
                    currentInstanceName = instanceName;
                    goToStep('whatsapp');
                    updateProgress(80, 'Resuming setup…');
                    startConnectionPolling(instanceName);
                    return;
                }
            }
        }

        // Pre-fill URL from query param if coming from marketing page
        const urlParams = new URLSearchParams(window.location.search);
        const passedUrl = urlParams.get('url');
        if (passedUrl) {
            targetWebsiteUrl = decodeURIComponent(passedUrl);
            goToStep('login');
        } else {
            goToStep('url');
        }
    });

    // ─── STEP 1: URL ───────────────────────────────────────────────────────────
    const urlForm = document.getElementById('url-form');
    if (urlForm) {
        urlForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let raw = document.getElementById('client-url')?.value.trim() || '';
            if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
                raw = 'https://' + raw;
            }
            try {
                new URL(raw);
                targetWebsiteUrl = raw;
                goToStep('login');
            } catch {
                notify('Invalid URL. Try something like: yourbusiness.com');
            }
        });
    }

    // ─── Password strength indicator ───────────────────────────────────────────
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            const v = passwordInput.value;
            setRule('req-length',  v.length >= 8);
            setRule('req-number',  /[0-9]/.test(v));
            setRule('req-special', /[^A-Za-z0-9]/.test(v));
        });
    }
    function setRule(id, valid) {
        document.getElementById(id)?.classList.toggle('valid', valid);
    }

    // ─── STEP 2: Register ──────────────────────────────────────────────────────
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            currentEmail       = document.getElementById('email')?.value.trim() || '';
            const password     = passwordInput?.value || '';
            const btn          = document.getElementById('btn-login');

            if (!currentEmail) return notify('Please enter your email.');
            if (password.length < 8 || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
                return notify('Password must be 8+ chars with a number and a special character.');
            }

            if (btn) { btn.textContent = 'Creating account…'; btn.disabled = true; }

            const client = window.getSupabase?.();
            if (!client) {
                notify('Auth service unavailable. Please refresh.');
                if (btn) { btn.textContent = 'Create Account'; btn.disabled = false; }
                return;
            }

            // ── Check if email already exists — redirect to login instead ─────
            const { data: signUpData, error: signUpError } = await client.auth.signUp({
                email:    currentEmail,
                password: password,
            });

            if (signUpError) {
                if (btn) { btn.textContent = 'Create Account'; btn.disabled = false; }
                const friendlyMessage = getFriendlyErrorMessage(signUpError);
                notify(friendlyMessage);
                return;
            }

            // Supabase returns identities: [] when email already exists (confirmed)
            if (signUpData?.user?.identities?.length === 0) {
                if (btn) { btn.textContent = 'Create Account'; btn.disabled = false; }
                notify('This email is already registered. Please check your email and password or sign in instead.');
                setTimeout(() => { window.location.href = 'login.html'; }, 2000);
                return;
            }

            // ── New user confirmed — send OTP ─────────────────────────────────
            if (btn) btn.textContent = 'Sending code…';

            const { error: otpError } = await client.auth.signInWithOtp({
                email:   currentEmail,
                options: { shouldCreateUser: false }, // user already created above
            });

            if (btn) { btn.textContent = 'Create Account'; btn.disabled = false; }

            if (otpError) {
                const friendlyMessage = getFriendlyErrorMessage(otpError);
                notify(friendlyMessage);
                // Move them forward to the OTP step regardless so they can use "Resend" option safely
            } else {
                notify('Verification code sent to ' + currentEmail + '!', false);
            }

            const displayEmail = document.getElementById('display-email');
            if (displayEmail) displayEmail.textContent = currentEmail;
            goToStep('otp');
        });
    }

    // ─── STEP 3: OTP verification ──────────────────────────────────────────────
    otpBoxes.forEach((box, i) => {
        box.addEventListener('input', () => {
            box.value = box.value.replace(/\D/g, '');
            if (box.value && i < otpBoxes.length - 1) otpBoxes[i + 1].focus();
            checkAndAutoSubmit();
        });
        box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !box.value && i > 0) otpBoxes[i - 1].focus();
        });
        // Paste handler on first box
        if (i === 0) {
            box.addEventListener('paste', (e) => {
                e.preventDefault();
                const digits = (e.clipboardData || window.clipboardData)
                    .getData('text').replace(/\D/g, '').slice(0, 6);
                digits.split('').forEach((d, idx) => {
                    if (otpBoxes[idx]) otpBoxes[idx].value = d;
                });
                const next = Math.min(digits.length, otpBoxes.length - 1);
                otpBoxes[next].focus();
                checkAndAutoSubmit();
            });
        }
    });

    function checkAndAutoSubmit() {
        let token = '';
        otpBoxes.forEach(b => { token += b.value; });
        if (token.length === 6) {
            document.getElementById('otp-form')?.dispatchEvent(new Event('submit'));
        }
    }

    const otpForm = document.getElementById('otp-form');
    if (otpForm) {
        otpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('btn-verify');
            let token = '';
            otpBoxes.forEach(b => { token += b.value; });
            if (token.length < 6) return notify('Please enter the full 6-digit code.');

            if (btn) { btn.textContent = 'Verifying…'; btn.disabled = true; }

            const client = window.getSupabase?.();
            const { data, error } = await client.auth.verifyOtp({
                email: currentEmail,
                token,
                type: 'email',
            });

            if (error) {
                if (btn) { btn.textContent = 'Verify & Continue'; btn.disabled = false; }
                otpBoxes.forEach(b => { b.value = ''; });
                otpBoxes[0].focus();
                const friendlyMessage = getFriendlyErrorMessage(error);
                notify(friendlyMessage);
                return;
            }

            // Persist session token so dashboard boot can verify
            if (data?.session) {
                localStorage.setItem('session_id', data.session.access_token);
                localStorage.setItem('user_email', currentEmail);
            }

            notify('Identity verified!', false);
            // Small delay so the user sees the success message
            setTimeout(() => startOnboarding(targetWebsiteUrl), 600);
        });
    }

    // ─── Resend OTP ────────────────────────────────────────────────────────────
    window.resendOtp = async function () {
        const client = window.getSupabase?.();
        if (!client || !currentEmail) return;
        const { error } = await client.auth.signInWithOtp({
            email:   currentEmail,
            options: { shouldCreateUser: false },
        });
        const msg = error ? getFriendlyErrorMessage(error) : 'New code sent!';
        notify(msg, !!error);
    };

    // ─── STEP 4: poll for onboarded client get business_id ─────────────────────────────────────
    async function startOnboarding(websiteUrl) {
        goToStep('whatsapp');
        updateProgress(30, 'Fetching your business profile…');

        const client = window.getSupabase?.();
        if (!client) {
            notify('Service unavailable. Please refresh.');
            return;
        }

        try {
            // Get current user session to pull the auto-created business row
            const { data: { user } } = await client.auth.getUser();
            if (!user) throw new Error('User session not found.');

            const { data: biz, error: bizError } = await client
                .from('businesses')
                .select('id')
                .eq('user_id', user.id)
                .maybeSingle();

            if (bizError || !biz?.id) {
                throw new Error('Business profile creation pending. Please refresh or try again.');
            }

            const businessId   = biz.id;
            const instanceName = `heysasa_${businessId}`;

            // ── Save everything to localStorage ──────────────────────────────
            localStorage.setItem('business_id',       businessId);
            localStorage.setItem('sb_instance_name',  instanceName);

            currentBusinessId   = businessId;
            currentInstanceName = instanceName;

            updateProgress(50, 'Initializing AI setup…');

            // Invoke the orchestrator, passing the existing business ID along
            const { data, error } = await client.functions.invoke('onboarding-ochestrator', {
                body: { businessId, websiteUrl },
            });

            if (error) throw new Error(error.message || 'Edge function error');

            // Show QR code
            const qrImg = document.querySelector('#step-whatsapp img');
            if (qrImg && data.qrcode) qrImg.src = data.qrcode;

            updateProgress(80, 'Scan the QR code to connect WhatsApp');
            startConnectionPolling(instanceName);

        } catch (err) {
            console.error('[get-started] Onboarding error:', err);
            notify('Setup running in background — taking you to your dashboard.', false);
            updateProgress(100, 'Redirecting…');
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 2500);
        }
    }

    // ─── Poll for WhatsApp connection ──────────────────────────────────────────
    function startConnectionPolling(instanceName) {
        if (connectionPollTimer) clearInterval(connectionPollTimer);

        let attempts = 0;
        const MAX    = 60; // 2 min at 2s intervals

        connectionPollTimer = setInterval(async () => {
            attempts++;
            try {
                const client = window.getSupabase?.();
                if (!client) return;

                const { data, error } = await client
                    .from('businesses')
                    .select('status')
                    .eq('id', currentBusinessId)
                    .maybeSingle();

                if (!error && data?.status === 'connected') {
                    clearInterval(connectionPollTimer);
                    updateProgress(100, 'WhatsApp connected!');
                    notify('WhatsApp connected successfully!', false);
                    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
                }

                if (attempts >= MAX) {
                    clearInterval(connectionPollTimer);
                    updateProgress(100, 'Scan timeout — you can reconnect from the dashboard.');
                }
            } catch (err) {
                console.error('[get-started] Polling error:', err);
            }
        }, 2000);
    }

})();