/**
 * login.js — HeySasa! Login (Routed through authManager)
 */

(function () {
    'use strict';

    let otpEmail = ''; 

    // ─── DOM ───────────────────────────────────────────────────────────────────
    const screenLogin  = document.getElementById('screen-login');
    const screenOtp    = document.getElementById('screen-otp');

    const loginForm    = document.getElementById('login-form');
    const emailInput   = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const btnLogin     = document.getElementById('btn-login');
    const loginError   = document.getElementById('login-error');
    const loginErrorTxt = document.getElementById('login-error-text');

    const btnSwitchToOtp = document.getElementById('btn-switch-to-otp');
    const btnBack        = document.getElementById('btn-back');
    const btnResend      = document.getElementById('btn-resend');

    const otpForm      = document.getElementById('otp-form');
    const otpBoxes     = document.querySelectorAll('.otp-box');
    const btnVerify    = document.getElementById('btn-verify');
    const displayEmail = document.getElementById('display-email');
    const otpError     = document.getElementById('otp-error');
    const otpErrorTxt  = document.getElementById('otp-error-text');

    // ─── Helpers ───────────────────────────────────────────────────────────────
    function showScreen(name) {
        [screenLogin, screenOtp].forEach(s => {
            if (!s) return;
            s.classList.add('hidden-screen');
            s.classList.remove('visible-screen');
        });
        const target = name === 'otp' ? screenOtp : screenLogin;
        if (target) {
            target.classList.remove('hidden-screen');
            target.classList.add('visible-screen');
        }
    }

    function showLoginError(msg) {
        if (!loginError || !loginErrorTxt) return;
        loginErrorTxt.textContent = msg;
        loginError.classList.remove('hidden');
    }
    function clearLoginError() {
        if (!loginError) return;
        loginError.classList.add('hidden');
        if (loginErrorTxt) loginErrorTxt.textContent = '';
    }

    // New helper to get safe auth manager
    function getAuth() {
        if (!window.authManager) {
            throw new Error('Authentication manager missing. Ensure auth.js is loaded.');
        }
        return window.authManager;
    }

    function showOtpError(msg) {
        if (!otpError || !otpErrorTxt) return;
        otpErrorTxt.textContent = msg;
        otpError.classList.remove('hidden');
    }
    function clearOtpError() {
        if (!otpError) return;
        otpError.classList.add('hidden');
        if (otpErrorTxt) otpErrorTxt.textContent = '';
    }

    function setLoginLoading(on) {
        if (!btnLogin) return;
        btnLogin.disabled = on;
        btnLogin.textContent = on ? 'Signing in…' : 'Sign In';
    }
    function setVerifyLoading(on) {
        if (!btnVerify) return;
        btnVerify.disabled = on;
        btnVerify.textContent = on ? 'Verifying…' : 'Verify & Sign In';
    }

    function toast(msg, isError = false) {
        const t   = document.getElementById('toast');
        const txt = document.getElementById('toast-message');
        if (!t || !txt) return;
        txt.textContent = msg;
        t.style.backgroundColor = isError ? '#ef4444' : '#28A745';
        t.classList.remove('translate-y-[-150%]');
        setTimeout(() => t.classList.add('translate-y-[-150%]'), 4000);
    }

    function persistAndRedirect(session, businessId) {
        localStorage.setItem('business_id', businessId);
        localStorage.setItem('session_id',  session.access_token);
        localStorage.setItem('user_email',  session.user?.email || '');
        window.location.href = 'dashboard.html';
    }

    window.togglePasswordVisibility = function (inputId, iconId) {
        const input = document.getElementById(inputId);
        const icon  = document.getElementById(iconId);
        if (!input || !icon) return;

        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';

        icon.innerHTML = isHidden
            ? `<path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>`
            : `<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>`;
    };

    async function fetchBusinessId(userId) {
        try {
            const client = window.supabaseClient || (window.getSupabase ? window.getSupabase() : null);
            if (!client) return null;
            const { data, error } = await client
                .from('businesses')
                .select('id')
                .eq('user_id', userId)
                .maybeSingle();
            if (error) return null;
            return data?.id ?? null;
        } catch (err) {
            return null;
        }
    }

    window.addEventListener('DOMContentLoaded', async () => {
        const storedBusiness = localStorage.getItem('business_id');
        const storedSession  = localStorage.getItem('session_id');
        if (storedBusiness && storedSession) {
            window.location.href = 'dashboard.html';
            return;
        }

        try {
            const res = await getAuth().getSession();
            if (res.success && res.data?.session) {
                const businessId = await fetchBusinessId(res.data.session.user.id) || 'pending';
                persistAndRedirect(res.data.session, businessId);
            }
        } catch (e) {
            console.error(e);
        }
    });

    // ─── SCREEN 1: Password login ───────────────────────────────────────────────
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearLoginError();

        const email    = emailInput?.value.trim();
        const password = passwordInput?.value;

        if (!email)    return showLoginError('Please enter your email address.');
        if (!password) return showLoginError('Please enter your password.');

        setLoginLoading(true);

        const res = await getAuth().signInWithPassword(email, password);

        if (!res.success) {
            setLoginLoading(false);
            const msg = res.error?.message?.toLowerCase() || '';

            if (msg.includes('invalid login') || msg.includes('invalid credentials') || res.error?.status === 400) {
                showLoginError('Incorrect email or password. If you\'re new, use "Get Started" instead.');
            } else if (msg.includes('email not confirmed')) {
                showLoginError('Your email hasn\'t been verified. Check your inbox for the confirmation link, or use "Sign in with a code" below.');
            } else if (res.error?.status === 429) {
                showLoginError('Too many attempts. Please wait a moment before trying again.');
            } else {
                showLoginError('Sign-in failed: ' + res.error?.message);
            }
            return;
        }

        const session = res.data?.session;
        const user = res.data?.user;
        if (!session || !user) {
            setLoginLoading(false);
            showLoginError('Unexpected response. Please try again.');
            return;
        }

        // NO LOCKOUT: If business row doesn't exist, we send it as 'pending' so navigation.js handles it
        const businessId = await fetchBusinessId(user.id) || 'pending';
        persistAndRedirect(session, businessId);
    });

    // ─── "Sign in with a code" button ──────────────────────────────────────────
    btnSwitchToOtp?.addEventListener('click', async () => {
        clearLoginError();

        const email = emailInput?.value.trim();
        if (!email) {
            showLoginError('Enter your email address above first, then click "Sign in with a code".');
            return;
        }

        btnSwitchToOtp.disabled = true;
        btnSwitchToOtp.textContent = 'Sending code…';

        const res = await getAuth().signInWithOtp(email);

        btnSwitchToOtp.disabled = false;
        btnSwitchToOtp.textContent = 'Forgot password? Sign in with a code instead';

        if (!res.success) {
            if (res.error?.message?.toLowerCase().includes('user not found') || res.error?.status === 422) {
                showLoginError('No account found with that email. Please check the address or create an account via "Get Started".');
            } else {
                showLoginError('Could not send code: ' + res.error?.message);
            }
            return;
        }

        otpEmail = email;
        if (displayEmail) displayEmail.textContent = email;
        clearOtpError();
        otpBoxes.forEach(b => { b.value = ''; b.classList.remove('filled'); });
        showScreen('otp');
        toast('6-digit code sent to ' + email, false);
    });

    // ─── Back button ───────────────────────────────────────────────────────────
    btnBack?.addEventListener('click', () => {
        clearOtpError();
        showScreen('login');
    });

    // ─── Resend button ─────────────────────────────────────────────────────────
    btnResend?.addEventListener('click', async () => {
        if (!otpEmail) return;
        btnResend.disabled = true;
        btnResend.textContent = 'Sending…';

        const res = await getAuth().signInWithOtp(otpEmail);

        btnResend.disabled = false;
        btnResend.textContent = 'Resend Code';

        toast(!res.success ? 'Could not resend: ' + res.error?.message : 'New code sent!', !res.success);
    });

    // ─── OTP box behaviour ──────────────────────────────────────────────────────
    otpBoxes.forEach((box, i) => {
        box.addEventListener('input', () => {
            box.value = box.value.replace(/\D/g, '');
            box.classList.toggle('filled', box.value.length > 0);
            if (box.value && i < otpBoxes.length - 1) otpBoxes[i + 1].focus();
            autoSubmitIfComplete();
        });

        box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !box.value && i > 0) {
                otpBoxes[i - 1].value = '';
                otpBoxes[i - 1].classList.remove('filled');
                otpBoxes[i - 1].focus();
            }
        });

        box.addEventListener('paste', (e) => {
            e.preventDefault();
            const digits = (e.clipboardData || window.clipboardData)
                .getData('text').replace(/\D/g, '').slice(0, 6);
            digits.split('').forEach((d, idx) => {
                if (otpBoxes[idx]) {
                    otpBoxes[idx].value = d;
                    otpBoxes[idx].classList.add('filled');
                }
            });
            const focusIdx = Math.min(digits.length, otpBoxes.length - 1);
            otpBoxes[focusIdx].focus();
            autoSubmitIfComplete();
        });
    });

    function autoSubmitIfComplete() {
        let token = '';
        otpBoxes.forEach(b => { token += b.value; });
        if (token.length === 6) {
            otpForm?.dispatchEvent(new Event('submit'));
        }
    }

    // ─── SCREEN 2: OTP verify ───────────────────────────────────────────────────
    otpForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearOtpError();

        let token = '';
        otpBoxes.forEach(b => { token += b.value; });
        if (token.length < 6) return showOtpError('Please enter all 6 digits.');

        setVerifyLoading(true);

        const res = await getAuth().verifyOtp(otpEmail, token);

        if (!res.success) {
            setVerifyLoading(false);
            otpBoxes.forEach(b => { b.value = ''; b.classList.remove('filled'); });
            otpBoxes[0]?.focus();

            if (res.error?.message?.toLowerCase().includes('expired') || res.error?.message?.toLowerCase().includes('invalid')) {
                showOtpError('That code is incorrect or has expired. Request a new one below.');
            } else {
                showOtpError('Verification failed: ' + res.error?.message);
            }
            return;
        }

        const session = res.data?.session;
        const user    = res.data?.user;

        if (!session || !user) {
            setVerifyLoading(false);
            showOtpError('Verification succeeded but no session was returned. Please try again.');
            return;
        }

        // NO LOCKOUT: Safely fall back to 'pending' if onboarding registration got interrupted
        const businessId = await fetchBusinessId(user.id) || 'pending';
        toast('Signed in!', false);
        persistAndRedirect(session, businessId);
    });

})();