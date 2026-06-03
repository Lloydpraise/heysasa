// ─── Mock Overview & Onboarding Data ──────────────────────────────────────────
const overviewData = {
    businessName: "Parem Agencies",
    creditBalance: 0,
    whatsappConnected: false,
    processedLeads: 0,
    unprocessedLeads: 470,
    contactsLocked: 45,
    onboardingStep: 1 // 1: Credits, 2: Create AI, 3: Process Leads, 4: Follow-ups, 5: Products, 6: Done
};

// ─── Modal & Action Logic ─────────────────────────────────────────────────────

window.openWhatsAppModal = function() {
    const modal = document.getElementById('wa-modal');
    const content = document.getElementById('wa-modal-content');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100', 'pointer-events-auto');
    setTimeout(() => {
        content.classList.remove('scale-95', 'translate-y-4', 'opacity-0');
        content.classList.add('scale-100', 'translate-y-0', 'opacity-100');
    }, 10);
};

window.closeWhatsAppModal = function() {
    const modal = document.getElementById('wa-modal');
    const content = document.getElementById('wa-modal-content');
    content.classList.remove('scale-100', 'translate-y-0', 'opacity-100');
    content.classList.add('scale-95', 'translate-y-4', 'opacity-0');
    setTimeout(() => {
        modal.classList.remove('opacity-100', 'pointer-events-auto');
        modal.classList.add('opacity-0', 'pointer-events-none');
    }, 200);
};

window.simulateWAConnect = function() {
    overviewData.whatsappConnected = true;
    closeWhatsAppModal();
    setTimeout(() => {
        renderOverviewContent();
        showToast('WhatsApp linked successfully!');
    }, 250);
};

window.openPaymentModal = function() {
    const modal = document.getElementById('pay-modal');
    const content = document.getElementById('pay-modal-content');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100', 'pointer-events-auto');
    setTimeout(() => {
        content.classList.remove('scale-95', 'translate-y-4', 'opacity-0');
        content.classList.add('scale-100', 'translate-y-0', 'opacity-100');
    }, 10);
};

window.closePaymentModal = function() {
    const modal = document.getElementById('pay-modal');
    const content = document.getElementById('pay-modal-content');
    content.classList.remove('scale-100', 'translate-y-0', 'opacity-100');
    content.classList.add('scale-95', 'translate-y-4', 'opacity-0');
    setTimeout(() => {
        modal.classList.remove('opacity-100', 'pointer-events-auto');
        modal.classList.add('opacity-0', 'pointer-events-none');
    }, 200);
};

// Onboarding specific actions
window.processPayment = function() {
    overviewData.creditBalance += 1000;
    overviewData.onboardingStep = 2; // Move to next step
    closePaymentModal();
    setTimeout(() => {
        renderOverviewContent();
        showToast('Account successfully topped up with KES 1000!');
    }, 250);
};

window.completeCreateAI = function() {
    overviewData.onboardingStep = 3;
    renderOverviewContent();
    showToast('AI Agent successfully created!');
};

window.completeProcessLeads = function() {
    overviewData.processedLeads = 30; // Free account limit demo
    overviewData.unprocessedLeads -= 30;
    overviewData.onboardingStep = 4;
    renderOverviewContent();
    showToast('30 Leads Processed! Your data mine is unlocked.');
};

window.completeFollowUps = function() {
    overviewData.onboardingStep = 5;
    renderOverviewContent();
    showToast('Follow-up preferences saved!');
};

window.completeProducts = function() {
    overviewData.onboardingStep = 6; // All done!
    renderOverviewContent();
    showToast('Products seeded! Onboarding complete.');
};


function showToast(message) {
    let toast = document.getElementById('success-toast');
    if (!toast) {
        // Create toast if it doesn't exist
        toast = document.createElement('div');
        toast.id = 'success-toast';
        toast.className = 'fixed bottom-4 right-4 bg-[#28A745] text-white px-6 py-3 rounded-xl font-bold shadow-lg transform translate-y-20 opacity-0 transition-all duration-300 z-[999]';
        toast.innerHTML = `<span></span>`;
        document.body.appendChild(toast);
    }
    toast.querySelector('span').innerText = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// ─── Main Render Function ─────────────────────────────────────────────────────

function renderOverviewContent() {
    const contentArea = document.getElementById('content-area');
    
    contentArea.className = 'absolute inset-0 z-10 p-4 md:p-8 overflow-y-auto custom-scrollbar flex items-start justify-center opacity-100 pointer-events-auto transition-opacity duration-700';
    
    // Define steps
    const steps = [
        {
            id: 1,
            title: "Load Credits",
            desc: "Add KES 1000 minimum commitment to unlock high-value AI systems and start sending messages.",
            btnText: "Add Funds (KES 1000)",
            action: "openPaymentModal()",
            icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
        },
        {
            id: 2,
            title: "Create Your AI",
            desc: "Provide basic info to generate a personalized AI that perfectly responds on your behalf.",
            btnText: "Generate AI",
            action: "completeCreateAI()",
            icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`
        },
        {
            id: 3,
            title: "Process All Leads",
            desc: "Process 30 free leads now. Discover the goldmine of data sitting in your WhatsApp history.",
            btnText: "Process 30 Leads",
            action: "completeProcessLeads()",
            icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>`
        },
        {
            id: 4,
            title: "Configure Follow-ups",
            desc: "Tell us how you'd like your friendly AI to handle automated follow-ups. We do the heavy lifting.",
            btnText: "Set Preferences",
            action: "completeFollowUps()",
            icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>`
        },
        {
            id: 5,
            title: "Process & Add Products",
            desc: "Seed 10 products instantly to finish setup. Just click process, then add.",
            btnText: "Process & Add",
            action: "completeProducts()",
            icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>`
        }
    ];

    let stepsHTML = '';
    
    if (overviewData.onboardingStep > 5) {
        stepsHTML = `
            <div class="glass-card p-8 text-center flex flex-col items-center justify-center py-16">
                <div class="w-20 h-20 bg-[#28A745]/20 rounded-full flex items-center justify-center mb-6">
                    <svg class="w-10 h-10 text-[#28A745]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 class="text-3xl font-black text-[#0F172A] mb-2">You're All Set!</h2>
                <p class="text-slate-500 font-medium max-w-md">Your AI systems are armed and ready. Dashboard unlocking soon...</p>
            </div>
        `;
    } else {
        steps.forEach(step => {
            const isCompleted = step.id < overviewData.onboardingStep;
            const isActive = step.id === overviewData.onboardingStep;
            const isLocked = step.id > overviewData.onboardingStep;

            if (isActive) {
                // Active Step: Encouraging, large, interactive
                stepsHTML += `
                    <div class="glass-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transform transition-all duration-500 shadow-xl border-l-4 border-l-[#0F172A] bg-white">
                        <div class="flex items-start gap-4">
                            <div class="w-12 h-12 bg-[#0F172A] text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-slate-900/20">
                                ${step.icon}
                            </div>
                            <div>
                                <h3 class="text-xl font-black text-[#0F172A] mb-1">Step ${step.id}: ${step.title}</h3>
                                <p class="text-sm font-medium text-slate-500 max-w-lg">${step.desc}</p>
                            </div>
                        </div>
                        <button onclick="${step.action}" class="w-full md:w-auto px-8 py-3.5 bg-[#0F172A] text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 whitespace-nowrap">
                            ${step.btnText}
                        </button>
                    </div>
                `;
            } else if (isCompleted) {
                // Completed Step: Greyed out, small, line-through
                stepsHTML += `
                    <div class="p-4 flex items-center gap-4 opacity-50 transform scale-95 transition-all duration-500">
                        <div class="w-8 h-8 bg-[#28A745] text-white rounded-full flex items-center justify-center shrink-0">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <div>
                            <h3 class="text-sm font-bold text-slate-500 line-through">Step ${step.id}: ${step.title}</h3>
                        </div>
                    </div>
                `;
            } else if (isLocked) {
                // Locked Step: Small, faded, waiting
                stepsHTML += `
                    <div class="p-4 flex items-center gap-4 opacity-40 transform scale-95 transition-all duration-500 grayscale">
                        <div class="w-8 h-8 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">
                            ${step.id}
                        </div>
                        <div>
                            <h3 class="text-sm font-bold text-slate-400">Step ${step.id}: ${step.title}</h3>
                        </div>
                    </div>
                `;
            }
        });
    }
    
    contentArea.innerHTML = `
        <div class="flex flex-col w-full max-w-3xl mx-auto pb-10">
            
            <div class="mb-8 text-center md:text-left">
                <h1 class="text-3xl font-black text-[#0F172A] mb-2 tracking-tight">Let's Get You Set Up</h1>
                <p class="text-sm text-slate-500 font-medium">Complete this quick checklist (< 5 mins) to launch your system.</p>
            </div>

            <div class="flex flex-col gap-3">
                ${stepsHTML}
            </div>

        </div>

        <!-- Payment Modal from your original code remains below -->
        <div id="pay-modal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity duration-300">
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onclick="closePaymentModal()"></div>
            <div id="pay-modal-content" class="glass-card w-full max-w-sm relative z-10 p-8 shadow-2xl border border-white/80 transform scale-95 translate-y-4 opacity-0 transition-all duration-300 ease-out">
                <div class="w-12 h-12 bg-[#28A745]/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg class="w-6 h-6 text-[#28A745]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h2 class="text-2xl font-black text-center text-[#0F172A] mb-2 tracking-tight">Buy Credits</h2>
                <p class="text-xs text-center text-slate-500 mb-6 font-medium px-4">Pay securely using M-Pesa. A prompt will be sent to your phone.</p>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Payment Method</label>
                        <select class="w-full px-4 py-3 rounded-xl border border-white/60 bg-white/60 focus:border-[#28A745] outline-none transition-all font-bold text-slate-700 shadow-sm appearance-none">
                            <option value="mpesa">M-Pesa Mobile Money</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">M-Pesa Number</label>
                        <input type="tel" placeholder="2547XXXXXXXX" class="w-full px-4 py-3 rounded-xl border border-white/60 bg-white/60 focus:border-[#28A745] focus:ring-2 focus:ring-[#28A745]/20 outline-none transition-all font-bold text-slate-800 shadow-sm placeholder:text-slate-300">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Amount (KES)</label>
                        <input type="number" value="1000" readonly class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 outline-none text-slate-600 font-black cursor-not-allowed">
                    </div>
                    
                    <div class="flex gap-3 pt-4 mt-2 border-t border-slate-100">
                        <button onclick="closePaymentModal()" class="flex-1 py-3.5 font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-xl transition-all">Cancel</button>
                        <button onclick="processPayment()" class="flex-1 py-3.5 bg-[#0F172A] text-white font-black rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">Pay 1000</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Automatically render if this script is loaded and the container exists
if (document.getElementById('content-area') && typeof PAGE_CONFIG === 'undefined') {
    renderOverviewContent();
}

// Ensure it hooks into your navigation system if PAGE_CONFIG exists
if (typeof window.PAGE_CONFIG !== 'undefined') {
    window.PAGE_CONFIG.overview = {
        title: 'Onboarding',
        description: 'Get your AI systems up and running in 5min!',
        navId: 'nav-overview',
        render: renderOverviewContent
    };
}