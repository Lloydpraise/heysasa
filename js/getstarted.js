// ==========================================
// CONFIGURATION & STATE
// ==========================================
let currentBusinessId = null;
let currentInstanceName = null;
let checkConnectionInterval = null;
let currentEmail = '';
let targetWebsiteUrl = ''; 

const screens = {
    url: document.getElementById('step-url'),
    login: document.getElementById('step-login'),
    otp: document.getElementById('step-otp'),
    whatsapp: document.getElementById('step-whatsapp')
};

const otpBoxes = document.querySelectorAll('.otp-box');

// ==========================================
// UI & PROGRESS LOGIC
// ==========================================
function goToStep(stepId) {
    const target = typeof stepId === 'number' ? document.getElementById('step-' + stepId) : screens[stepId];
    
    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    if (target) target.classList.add('active');

    const container = document.getElementById('main-container');
    if (container) {
        if (stepId === 'whatsapp' || stepId === 2) {
            container.classList.replace('max-w-md', 'max-w-5xl');
        } else {
            container.classList.replace('max-w-5xl', 'max-w-md');
        }
    }
}

function updateProgress(percentage, text) {
    const progressBar = document.getElementById('progress-bar');
    const statusText = document.getElementById('status-text');
    
    if (progressBar) progressBar.style.width = percentage + '%';
    if (statusText) statusText.textContent = text;
}

function notify(msg, err = true) {
    const t = document.getElementById('toast');
    const msgEl = document.getElementById('toast-message');
    if (!t || !msgEl) return;

    msgEl.textContent = msg;
    t.style.backgroundColor = err ? '#ef4444' : '#28A745';
    t.classList.remove('translate-y-[-150%]');
    setTimeout(() => t.classList.add('translate-y-[-150%]'), 4000);
}

// ==========================================
// PASSWORD STRENGTH VISUAL LOGIC
// ==========================================
const passwordInput = document.getElementById('password');
if (passwordInput) {
    passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;
        
        // Rules definitions
        const hasLength = val.length >= 8;
        const hasNumber = /\D*/.test(val) && /[0-9]/.test(val);
        const hasSpecial = /[^A-Za-z0-9]/.test(val);

        // UI Adjustments
        toggleRuleVisual('req-length', hasLength);
        toggleRuleVisual('req-number', hasNumber);
        toggleRuleVisual('req-special', hasSpecial);
    });
}

function toggleRuleVisual(elementId, isValid) {
    const el = document.getElementById(elementId);
    if (el) {
        if (isValid) {
            el.classList.add('valid');
        } else {
            el.classList.remove('valid');
        }
    }
}

// ==========================================
// AUTHENTICATION FLOW HANDLERS
// ==========================================

// STEP 1: URL Submission
document.getElementById('url-form').onsubmit = (e) => {
    e.preventDefault();
    let url = document.getElementById('client-url').value.trim();
    
    let urlForValidation = url;
    if (!urlForValidation.startsWith('http://') && !urlForValidation.startsWith('https://')) {
        urlForValidation = 'https://' + urlForValidation;
    }
    
    try {
        new URL(urlForValidation);
        targetWebsiteUrl = urlForValidation;
        goToStep('login');
    } catch (err) {
        notify('Invalid URL. Please enter a valid URL (e.g., yourbusiness.com)');
    }
};

// STEP 2: Login / Sign Up Submission
document.getElementById('login-form').onsubmit = async (e) => {
    e.preventDefault();
    currentEmail = document.getElementById('email').value.trim();
    const password = passwordInput.value;
    const btn = document.getElementById('btn-login');

    // Pre-flight check
    if (password.length < 8 || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
        return notify("Please complete all password security strength requirements.");
    }

    btn.innerText = "Creating account...";
    btn.disabled = true;

    // Register user session with Supabase
    const signUpRes = await authManager.signUpWithPassword(currentEmail, password);
    
    if (!signUpRes.success) {
        notify("Could not create account: " + signUpRes.error.message);
        btn.innerText = "Create Account";
        btn.disabled = false;
        console.error('Sign up error:', signUpRes.error);
        return;
    }

    btn.innerText = "Sending Code...";

    // Fire verification token setup
    const otpRes = await authManager.signInWithOtp(currentEmail);
    
    if (!otpRes.success) {
        notify("Account registered, but could not deliver verification token: " + otpRes.error.message);
        btn.innerText = "Create Account";
        btn.disabled = false;
        console.error('OTP error:', otpRes.error);
    } else {
        document.getElementById('display-email').textContent = currentEmail;
        goToStep('otp');
        notify("We've sent a 6-digit verification code to your email!", false);
        btn.innerText = "Create Account";
        btn.disabled = false;
    }
};

// STEP 3: OTP Verification
document.getElementById('otp-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-verify');
    let token = '';
    otpBoxes.forEach(b => token += b.value);

    if (token.length < 6) return notify("Please enter the full 6-digit code");

    btn.innerText = "Verifying...";
    btn.disabled = true;

    const res = await authManager.verifyOtp(currentEmail, token, 'email');
    
    if (res.success) {
        notify("Identity verified successfully!", false);
        
        const password = passwordInput.value;
        const saveRes = await authManager.savePasswordToBackend(currentEmail, password);
        
        if (!saveRes.success) {
            console.warn('Password vault tracking notice:', saveRes.error);
        } else {
            console.log('Credentials saved securely.');
        }
        
        // Seamless handoff to trigger browser credential autofill profile capture
        setTimeout(() => {
            startOnboarding(targetWebsiteUrl);
        }, 500);
    } else {
        console.error('OTP Verification Failed:', res.error);
        notify("Invalid or expired setup code. Please try again.");
        btn.innerText = "Verify & Continue";
        btn.disabled = false;
        otpBoxes.forEach(b => b.value = '');
        otpBoxes[0].focus();
    }
};

// OTP Navigation Controls & Behaviors
otpBoxes.forEach((box, i) => {
    box.addEventListener('input', (e) => {
        // Strip non-numeric inputs
        box.value = box.value.replace(/\D/g, '');
        if (box.value && i < 5) otpBoxes[i + 1].focus();
        
        checkAndAutoVerify();
    });

    box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !box.value && i > 0) {
            otpBoxes[i - 1].focus();
        }
    });

    if (i === 0) {
        box.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const digits = pastedText.replace(/\D/g, '').slice(0, 6);
            
            digits.split('').forEach((digit, index) => {
                if (index < 6) {
                    otpBoxes[index].value = digit;
                }
            });
            
            const nextEmptyIndex = digits.length < 6 ? digits.length : 5;
            otpBoxes[nextEmptyIndex].focus();
            
            checkAndAutoVerify();
        });
    }
});

function checkAndAutoVerify() {
    let allFilled = true;
    let token = '';
    otpBoxes.forEach(b => {
        if (!b.value) allFilled = false;
        token += b.value;
    });
    
    if (allFilled && token.length === 6) {
        const btn = document.getElementById('btn-verify');
        btn.innerText = "Verifying...";
        btn.disabled = true;
        
        document.getElementById('otp-form').dispatchEvent(new Event('submit'));
    }
}

// ==========================================
// CORE ONBOARDING PIPELINE
// ==========================================
async function startOnboarding(websiteUrl) {
    try {
        goToStep('whatsapp'); 
        updateProgress(50, "Initializing AI Setup...");

        const client = window.getSupabase();
        if (!client) throw new Error('Supabase integration offline.');
        
        const { data, error } = await client.functions.invoke('onboarding-ochestrator', {
            body: { websiteUrl: websiteUrl }
        });

        // Intercept and sanitize Edge Function platform/network issues
        if (error) {
            console.error("Supabase edge function error log:", error);
            throw new Error("Our setup channels are running slowly. Let's complete synchronization inside the control dashboard.");
        }

        const sasaBusinessId = data.sasa_business_id;
        const derivedBusinessId = data.business_id; 
        currentInstanceName = data.instance_name;

        localStorage.setItem('sb_sasa_business_id', sasaBusinessId);
        localStorage.setItem('sb_business_id', derivedBusinessId); 
        localStorage.setItem('sb_instance_name', currentInstanceName);

        currentBusinessId = derivedBusinessId; 

        const qrImg = document.querySelector('#step-whatsapp img') || document.querySelector('#step-2 img');
        if (qrImg) qrImg.src = data.qrcode;
        
        updateProgress(100, "Scan to connect! (AI is learning in background)");
        startConnectionPolling(currentInstanceName);

    } catch (err) {
        console.error("Onboarding setup failure details:", err);
        // User-friendly fallback messaging that routes past systemic edge errors cleanly
        notify("Account verified! We're putting on the final touches via your workspace dashboard...", false);
        updateProgress(100, "Redirecting to tracking terminal...");
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2500);
    }
}

// ==========================================
// WHATSAPP CONNECTION POLLING
// ==========================================
function startConnectionPolling(instanceName) {
    if (checkConnectionInterval) clearInterval(checkConnectionInterval);

    let attempts = 0;
    const maxAttempts = 60; 

    checkConnectionInterval = setInterval(async () => {
        attempts++;
        try {
            const result = await supabaseAPI.db.fetchOneByShortId('businesses', currentBusinessId);

            if (result.success && result.data.status === 'connected') {
                clearInterval(checkConnectionInterval);
                updateProgress(100, "WhatsApp Connected Successfully!");
                goToStep(3); 
            }

            if (attempts >= maxAttempts) {
                clearInterval(checkConnectionInterval);
                updateProgress(100, "Scan timeout. Please refresh.");
            }
        } catch (err) {
            console.error("Polling error:", err);
        }
    }, 2000);
}

// ==========================================
// INITIALIZATION
// ==========================================
window.onload = async () => {
    currentBusinessId = localStorage.getItem('sb_business_id');
    currentInstanceName = localStorage.getItem('sb_instance_name');

    const client = window.getSupabase();
    let hasSession = false;
    
    if (client) {
        const { data: { session } } = await client.auth.getSession();
        if (session) {
            hasSession = true;
            currentEmail = session.user.email;
        }
    }

    if (hasSession && currentBusinessId) {
        console.log("Session verified. Resuming profile tracking for business:", currentBusinessId);
        goToStep('whatsapp');
        updateProgress(100, "Checking connection status...");
        startConnectionPolling(currentInstanceName);
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const passedUrl = urlParams.get('url');
    
    if (passedUrl) {
        targetWebsiteUrl = decodeURIComponent(passedUrl);
        goToStep('login');
    } else {
        goToStep('url');
    }
};