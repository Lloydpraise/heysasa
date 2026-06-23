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

    function notify(msg, isError = true) {
        const toast   = document.getElementById('toast');
        const msgEl   = document.getElementById('toast-message');
        if (!toast || !msgEl) return;
        msgEl.textContent = msg;
        toast.style.backgroundColor = isError ? '#ef4444' : '#28A745';
        toast.classList.remove('translate-y-[-150%]');
        setTimeout(() => toast.classList.add('translate-y-[-150%]'), 4000);
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

            const signUpRes = await getAuth().signUpWithPassword(currentEmail, password);

            if (!signUpRes.success) {
                if (btn) { btn.textContent = 'Create Account'; btn.disabled = false; }
                if (signUpRes.error?.message?.toLowerCase().includes('already registered')) {
                    notify('This email already has an account. Use the Sign In page instead.');
                } else {
                    notify('Registration failed: ' + signUpRes.error?.message);
                }
                return;
            }

            if (signUpRes.data?.user?.identities?.length === 0) {
                if (btn) { btn.textContent = 'Create Account'; btn.disabled = false; }
                notify('This email is already registered. Please sign in instead.');
                setTimeout(() => { window.location.href = 'login.html'; }, 2000);
                return;
            }

            if (btn) btn.textContent = 'Sending code…';

            const otpRes = await getAuth().signInWithOtp(currentEmail);

            if (btn) { btn.textContent = 'Create Account'; btn.disabled = false; }

            if (!otpRes.success) {
                notify('Account created but could not send verification code: ' + otpRes.error?.message);
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
                notify('Invalid or expired code. Please try again.');
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
        if (!currentEmail) return;
        const res = await getAuth().signInWithOtp(currentEmail);
        notify(!res.success ? 'Could not resend: ' + res.error?.message : 'New code sent!', !res.success);
    };

})();