/**
 * get-started.js — HeySasa! New User Registration Flow
 */

(function () {
    'use strict';

    let currentEmail       = '';
    let targetWebsiteUrl   = '';

    // ─── DOM ───────────────────────────────────────────────────────────────────
    const screens = {
        url:      document.getElementById('step-url'),
        login:    document.getElementById('step-login'),
        otp:      document.getElementById('step-otp'),
    };
    const otpBoxes = document.querySelectorAll('.otp-box');

    // ─── Navigation ────────────────────────────────────────────────────────────
    function goToStep(key) {
        Object.values(screens).forEach(s => s?.classList.remove('active'));
        screens[key]?.classList.add('active');
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

    function getAuth() {
        if (!window.authManager) {
            throw new Error('Authentication manager missing. Ensure auth.js is loaded.');
        }
        return window.authManager;
    }

    // ─── Boot ──────────────────────────────────────────────────────────────────
    window.addEventListener('DOMContentLoaded', async () => {
        const existingBusiness = localStorage.getItem('business_id');
        const existingSession  = localStorage.getItem('session_id');
        if (existingBusiness && existingSession && existingBusiness !== 'pending') {
            window.location.href = 'dashboard.html';
            return;
        }

        try {
            const res = await getAuth().getSession();
            if (res.success && res.data?.session) {
                localStorage.setItem('session_id', res.data.session.access_token);
                localStorage.setItem('user_email', res.data.session.user.email);
                window.location.href = 'dashboard.html';
                return;
            }
        } catch (e) {
            console.error(e);
        }

        const urlParams = new URLSearchParams(window.location.search);
        const passedUrl = urlParams.get('url');
        if (passedUrl) {
            targetWebsiteUrl = decodeURIComponent(passedUrl);
            goToStep('login');
        } else {
            goToStep('url');
        }

        // Inject "Don't have a website?" option below the URL form if element exists
        const urlFormEl = document.getElementById('url-form');
        if (urlFormEl) {
            const skipContainer = document.createElement('div');
            skipContainer.style.cssText = 'text-align:center; margin-top:16px;';
            skipContainer.innerHTML = `
                <button type="button" id="btn-skip-url" style="background:none; border:none; color:#64748B; font-size:14px; font-weight:600; text-decoration:underline; cursor:pointer;">
                    Don't have a website? Click Here
                </button>
            `;
            urlFormEl.appendChild(skipContainer);

            document.getElementById('btn-skip-url')?.addEventListener('click', () => {
                targetWebsiteUrl = 'https://heysasa.com/placeholder';
                goToStep('login');
            });
        }
    });

    // ─── STEP 1: URL Submission ───────────────────────────────────────────────
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

    // ─── STEP 2: Registration Account Creation ─────────────────────────────────
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
            // Supabase signUp on an existing confirmed email returns a fake success
            // (to prevent enumeration), so we try signInWithPassword first with a
            // dummy password just to detect "Invalid credentials" vs "Email not found".
            // Better approach: just attempt signUp and handle the duplicate case.
            const { data: signUpData, error: signUpError } = await client.auth.signUp({
                email:    currentEmail,
                password: password,
            });

            if (signUpError) {
                if (btn) { btn.textContent = 'Create Account'; btn.disabled = false; }

                // Supabase doesn't expose "already registered" directly for security,
                // but the user object will have `identities: []` if email is taken.
                if (signUpError.message?.toLowerCase().includes('already registered')) {
                    notify('This email already has an account. Use the Sign In page instead.');
                } else {
                    notify('Registration failed: ' + signUpError.message);
                }
                return;
            }

            if (signUpData?.user?.identities?.length === 0) {
                if (btn) { btn.textContent = 'Create Account'; btn.disabled = false; }
                notify('This email is already registered. Please check your email and password or sign in instead.');
                setTimeout(() => { window.location.href = 'login.html'; }, 2000);
                return;
            }

            if (btn) btn.textContent = 'Sending code…';

            const result = await getAuth().signInWithOtp(currentEmail);
            const otpError = result.error;
            const otpData = result.data;
            if (btn) { btn.textContent = 'Create Account'; btn.disabled = false; }

            if (otpError) {
                notify('Account created but could not send verification code: ' + otpError.message);
                // Still move them to OTP step — they can use "Resend"
            } else {
                notify('Verification code sent to ' + currentEmail + '!', false);
            }

            const displayEmail = document.getElementById('display-email');
            if (displayEmail) displayEmail.textContent = currentEmail;
            goToStep('otp');
        });
    }

    // ─── STEP 3: OTP Code Entry ────────────────────────────────────────────────
    otpBoxes.forEach((box, i) => {
        box.addEventListener('input', () => {
            box.value = box.value.replace(/\D/g, '');
            if (box.value && i < otpBoxes.length - 1) otpBoxes[i + 1].focus();
            checkAndAutoSubmit();
        });
        box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !box.value && i > 0) otpBoxes[i - 1].focus();
        });
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

            const res = await getAuth().verifyOtp(currentEmail, token);

            if (!res.success) {
                if (btn) { btn.textContent = 'Verify & Continue'; btn.disabled = false; }
                otpBoxes.forEach(b => { b.value = ''; });
                otpBoxes[0].focus();
                const friendlyMessage = getFriendlyErrorMessage(error);
                notify(friendlyMessage);
                return;
            }

            if (res.data?.session) {
                localStorage.setItem('session_id',  res.data.session.access_token);
                localStorage.setItem('user_email',  currentEmail);
                localStorage.setItem('business_id', 'pending'); 
            }

            // Save the chosen website context to use inside onboarding.js
            if (targetWebsiteUrl) {
                localStorage.setItem('onboarding_target_url', targetWebsiteUrl);
            }

            notify('Identity verified! Forwarding to your setup wizard…', false);
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
        });
    }

    window.resendOtp = async function () {
        const client = window.getSupabase?.();
        if (!client || !currentEmail) return;
        const { error } = await client.auth.signInWithOtp({
            email:   currentEmail,
            options: { shouldCreateUser: false },
        });
        notify(error ? 'Could not resend: ' + error.message : 'New code sent!', !!error);
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