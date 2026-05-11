// ==========================================
// CONFIGURATION & STATE
// ==========================================
// Supabase initialization is in initSupabase.js
// All Supabase API calls are in supabaseClient.js via supabaseAPI
// This file handles UI logic and calls supabaseAPI methods

// Variables to hold state
let currentBusinessId = null;
let currentInstanceName = null;
let checkConnectionInterval = null;

// ==========================================
// UI & PROGRESS LOGIC
// ==========================================
function goToStep(num) {
    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    document.getElementById('step-' + num).classList.add('active');
}

function updateProgress(percentage, text) {
    const progressBar = document.getElementById('progress-bar');
    const statusText = document.getElementById('status-text');
    
    if (progressBar) progressBar.style.width = percentage + '%';
    if (statusText) statusText.textContent = text;
}

// ==========================================
// CORE ONBOARDING PIPELINE
// ==========================================
async function startOnboarding(websiteUrl) {
    try {
        updateProgress(50, "Initializing AI Setup...");

        // Call Supabase Edge Function via supabaseAPI
        const client = window.getSupabase();
        const { data, error } = await client.functions.invoke('onboarding-orchestrator', {
            body: { websiteUrl: websiteUrl }
        });

        if (error) throw error;

        // Save state globally for future steps (like saving the selected token tier)
        currentBusinessId = data.business_id;
        currentInstanceName = data.instance_name;

        // data now contains { business_id, instance_name, qrcode }
        document.querySelector('#step-2 img').src = data.qrcode;
        
        updateProgress(100, "Scan to connect! (AI is learning your business in the background)");
        
        setTimeout(() => {
            goToStep(2);
            startConnectionPolling(currentInstanceName);
        }, 800);

    } catch (err) {
        console.error("Onboarding failed:", err);
        updateProgress(0, "Setup failed. Please try again.");
    }
}

// ==========================================
// WHATSAPP CONNECTION POLLING
// ==========================================
function startConnectionPolling(instanceName) {
    // Prevent multiple intervals from running
    if (checkConnectionInterval) clearInterval(checkConnectionInterval);

    let attempts = 0;
    const maxAttempts = 60; // 60 attempts * 2 seconds = 2 minutes timeout

    checkConnectionInterval = setInterval(async () => {
        attempts++;
        try {
            // Check the status from supabaseAPI
            const result = await supabaseAPI.db.fetchOne('businesses', currentBusinessId);

            if (result.success && result.data.status === 'connected') {
                clearInterval(checkConnectionInterval);
                updateProgress(100, "WhatsApp Connected Successfully!");
                goToStep(3); // Move to the token picker / final step
            }

            if (attempts >= maxAttempts) {
                clearInterval(checkConnectionInterval);
                console.log("Polling timeout reached.");
                updateProgress(100, "Scan timeout. Please refresh for a new QR code.");
            }
        } catch (err) {
            console.error("Polling error:", err);
        }
    }, 2000); // Check every 2 seconds
}

// ==========================================
// TOKEN PICKER LOGIC (Alarm Clock Scroller)
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
    // Initialize first position
    picker.scrollTop = 0;
}

// ==========================================
// INITIALIZATION
// ==========================================
// Trigger the flow when the script loads
window.onload = () => {
    // In production, grab this from URL params or localStorage
    // const urlParams = new URLSearchParams(window.location.search);
    // const userUrl = urlParams.get('url');
    const userUrl = "https://clientswebsite.com"; 
    
    if (userUrl) {
        startOnboarding(userUrl);
    } else {
        console.error("No website URL provided.");
        updateProgress(0, "Missing Website URL.");
    }
};