// ==========================================
// CONFIGURATION & STATE
// ==========================================
// Supabase initialization is in initSupabase.js
// All Supabase API calls are in supabaseClient.js via supabaseAPI

let currentBusinessId = null;
let currentInstanceName = null;
let checkConnectionInterval = null;
let currentEmail = '';
let targetWebsiteUrl = ''; // Captured from Step 1

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
    // Handle both numeric IDs (from old code) and string IDs (from new code)
    const target = typeof stepId === 'number' ? document.getElementById('step-' + stepId) : screens[stepId];
    
    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    if (target) target.classList.add('active');

    // Layout adjustment for wide WhatsApp screen
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
    setTimeout(() => t.classList.add('translate-y-[-150%]'), 3000);
}

// ==========================================
// AUTHENTICATION FLOW HANDLERS
// ==========================================

// STEP 1: URL Submission
document.getElementById('url-form').onsubmit = (e) => {
    e.preventDefault();
    targetWebsiteUrl = document.getElementById('client-url').value;
    goToStep('login');
};

// STEP 2: Login Submission
document.getElementById('login-form').onsubmit = async (e) => {
    e.preventDefault();
    currentEmail = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const btn = document.getElementById('btn-login');

    btn.innerText = "Verifying...";
    btn.disabled = true;

    const res = await authManager.signInWithPassword(currentEmail, pass);
    if (!res.success) {
        notify(res.error.message);
        btn.innerText = "Sign In";
        btn.disabled = false;
    } else {
        const otpRes = await authManager.signInWithOtp(currentEmail);
        if (!otpRes.success) {
            notify(otpRes.error.message);
            btn.disabled = false;
        } else {
            document.getElementById('display-email').textContent = currentEmail;
            goToStep('otp');
        }
    }
};

// STEP 3: OTP Verification
document.getElementById('otp-form').onsubmit = async (e) => {
    e.preventDefault();
    let token = '';
    otpBoxes.forEach(b => token += b.value);

    const res = await authManager.verifyOtp(currentEmail, token, 'email');
    
    if (res.success) {
        // Now that user is authenticated, trigger the Onboarding Orchestrator
        startOnboarding(targetWebsiteUrl);
    } else {
        notify("Invalid code. Please try again.");
        otpBoxes.forEach(b => b.value = '');
        otpBoxes[0].focus();
    }
};

// OTP Auto-focus logic
otpBoxes.forEach((box, i) => {
    box.onkeyup = (e) => {
        if (e.key >= 0 && e.key <= 9 && i < 5) otpBoxes[i+1].focus();
        if (e.key === 'Backspace' && i > 0) otpBoxes[i-1].focus();
    };
});

// ==========================================
// CORE ONBOARDING PIPELINE
// ==========================================
async function startOnboarding(websiteUrl) {
    try {
        goToStep('whatsapp'); // Move to the WA screen immediately to show progress
        updateProgress(50, "Initializing AI Setup...");

        const client = window.getSupabase();
        if (!client) throw new Error('Supabase client not initialized.');
        
        const { data, error } = await client.functions.invoke('onboarding-orchestrator', {
            body: { websiteUrl: websiteUrl }
        });

        if (error) throw error;

        currentBusinessId = data.business_id;
        currentInstanceName = data.instance_name;

        // Update the QR code image in the WhatsApp step
        const qrImg = document.querySelector('#step-whatsapp img') || document.querySelector('#step-2 img');
        if (qrImg) qrImg.src = data.qrcode;
        
        updateProgress(100, "Scan to connect! (AI is learning in background)");
        startConnectionPolling(currentInstanceName);

    } catch (err) {
        console.error("Onboarding failed:", err);
        notify("Setup failed: " + err.message);
        updateProgress(0, "Setup failed. Please try again.");
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
            const result = await supabaseAPI.db.fetchOne('businesses', currentBusinessId);

            if (result.success && result.data.status === 'connected') {
                clearInterval(checkConnectionInterval);
                updateProgress(100, "WhatsApp Connected Successfully!");
                goToStep(3); // Move to token picker
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
// TOKEN PICKER LOGIC
// ==========================================
const picker = document.getElementById('tier-picker');
const priceDisplay = document.getElementById('total-price');
const tiers = document.querySelectorAll('.token-tier');

if (picker) {
    picker.addEventListener('scroll', () => {
        let closest = null;
        let closestDist = Infinity;

        tiers.forEach(tier => {
            const rect = tier.getBoundingClientRect();
            const pickerRect = picker.getBoundingClientRect();
            const dist = Math.abs((rect.top + rect.height/2) - (pickerRect.top + pickerRect.height/2));
            
            tier.classList.remove('selected');
            if (dist < closestDist) {
                closestDist = dist;
                closest = tier;
            }
        });

        if (closest) {
            closest.classList.add('selected');
            const sh = closest.getAttribute('data-sh');
            if (priceDisplay) priceDisplay.textContent = `KSh ${Number(sh).toLocaleString()}.00`;
        }
    });
    picker.scrollTop = 0;
}

// ==========================================
// INITIALIZATION
// ==========================================
window.onload = () => {
    // Instead of auto-starting, we start at the URL step
    goToStep('url');
};