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
    let url = document.getElementById('client-url').value.trim();
    
    // Add https:// for validation if not already present
    let urlForValidation = url;
    if (!urlForValidation.startsWith('http://') && !urlForValidation.startsWith('https://')) {
        urlForValidation = 'https://' + urlForValidation;
    }
    
    // Validate the URL using browser's URL API
    try {
        new URL(urlForValidation);
        targetWebsiteUrl = urlForValidation;
        goToStep('login');
    } catch (err) {
        notify('Invalid URL. Please enter a valid URL (e.g., yourbusiness.com)');
    }
};

// STEP 2: Login / Sign Up Submission (NEW USERS - Register with password)
document.getElementById('login-form').onsubmit = async (e) => {
    e.preventDefault();
    currentEmail = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('btn-login');

    btn.innerText = "Creating account...";
    btn.disabled = true;

    // STEP 2A: Register the new user with Supabase (creates session)
    const signUpRes = await authManager.signUpWithPassword(currentEmail, password);
    
    if (!signUpRes.success) {
        notify("Could not create account: " + signUpRes.error.message);
        btn.innerText = "Sign In";
        btn.disabled = false;
        console.error('Sign up error:', signUpRes.error);
        return;
    }

    console.log('New user created successfully, now sending OTP...');
    btn.innerText = "Sending Code...";

    // STEP 2B: Now send OTP for verification
    const otpRes = await authManager.signInWithOtp(currentEmail);
    
    if (!otpRes.success) {
        notify("Account created, but could not send code: " + otpRes.error.message);
        btn.innerText = "Sign In";
        btn.disabled = false;
        console.error('OTP error:', otpRes.error);
    } else {
        document.getElementById('display-email').textContent = currentEmail;
        goToStep('otp');
        btn.innerText = "Sign In";
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

    // Show verifying state
    btn.innerText = "Verifying...";
    btn.disabled = true;

    const res = await authManager.verifyOtp(currentEmail, token, 'email');
    
    if (res.success) {
        notify("Identity verified!", false);
        
        // Save the password to backend after OTP confirmation
        const password = document.getElementById('password').value;
        const saveRes = await authManager.savePasswordToBackend(currentEmail, password);
        
        if (!saveRes.success) {
            console.warn('Password save warning:', saveRes.error);
            // Continue with onboarding even if password save fails
        } else {
            console.log('Password saved successfully to backend');
        }
        
        // Now that user is authenticated, trigger the Onboarding Orchestrator
        setTimeout(() => {
            startOnboarding(targetWebsiteUrl);
        }, 500);
    } else {
        // Log exact error to console
        console.error('OTP Verification Failed:', res.error);
        notify("Invalid code. Please try again.");
        btn.innerText = "Verify & Continue";
        btn.disabled = false;
        otpBoxes.forEach(b => b.value = '');
        otpBoxes[0].focus();
    }
};

// OTP Auto-focus logic + Paste support + Auto-verify
otpBoxes.forEach((box, i) => {
    box.addEventListener('input', (e) => {
        if (box.value && i < 5) otpBoxes[i + 1].focus();
        
        // Auto-verify when all boxes are filled
        checkAndAutoVerify();
    });

    box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !box.value && i > 0) {
            otpBoxes[i - 1].focus();
        }
    });

    // Handle paste event (only on first box)
    if (i === 0) {
        box.addEventListener('paste', (e) => {
            e.preventDefault();
            
            // Get clipboard content
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            
            // Extract only digits from the pasted content
            const digits = pastedText.replace(/\D/g, '').slice(0, 6);
            
            // Distribute digits across the OTP boxes
            digits.split('').forEach((digit, index) => {
                if (index < 6) {
                    otpBoxes[index].value = digit;
                }
            });
            
            // Focus on the next empty box or last box
            const nextEmptyIndex = digits.length < 6 ? digits.length : 5;
            otpBoxes[nextEmptyIndex].focus();
            
            // Auto-verify if all boxes are filled
            checkAndAutoVerify();
        });
    }
});

// Auto-verify function: checks if all boxes are filled and submits
function checkAndAutoVerify() {
    let allFilled = true;
    let token = '';
    otpBoxes.forEach(b => {
        if (!b.value) allFilled = false;
        token += b.value;
    });
    
    if (allFilled && token.length === 6) {
        // Prepare button for submission
        const btn = document.getElementById('btn-verify');
        btn.innerText = "Verifying...";
        btn.disabled = true;
        
        // Auto-submit the form
        document.getElementById('otp-form').dispatchEvent(new Event('submit'));
    }
}

// ==========================================
// CORE ONBOARDING PIPELINE (UPDATED FIELDS)
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

        // FIXED: Match the exact keys returned by the orchestrator response
        currentBusinessId = data.sasa_business_id; 
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
    // Check if URL was passed as query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const passedUrl = urlParams.get('url');
    
    if (passedUrl) {
        // If URL is passed, skip to login step
        targetWebsiteUrl = decodeURIComponent(passedUrl);
        goToStep('login');
    } else {
        // Otherwise start at the URL step
        goToStep('url');
    }
};