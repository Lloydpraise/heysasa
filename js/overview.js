// ─── Mock Overview Data ───────────────────────────────────────────────────────
const overviewData = {
    businessName: "Parem Agencies",
    creditBalance: 1500, // Try changing this to 150 to see the red warning
    whatsappConnected: false,
    processedLeads: 30,
    unprocessedLeads: 470,
    contactsLocked: 45
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

window.processPayment = function() {
    overviewData.creditBalance += 1000;
    closePaymentModal();
    setTimeout(() => {
        renderOverviewContent();
        showToast('Account successfully topped up with KES 1000');
    }, 250);
};

function showToast(message) {
    const toast = document.getElementById('success-toast');
    if (toast) {
        toast.querySelector('span').innerText = message;
        toast.classList.remove('translate-y-20', 'opacity-0');
        setTimeout(() => {
            toast.classList.add('translate-y-20', 'opacity-0');
        }, 3000);
    }
}

// ─── Main Render Function ─────────────────────────────────────────────────────

function renderOverviewContent() {
    const contentArea = document.getElementById('content-area');
    
    // Logic for dynamic display
    const creditColor = overviewData.creditBalance < 200 ? 'text-red-500' : 'text-[#28A745]';
    const creditBg = overviewData.creditBalance < 200 ? 'bg-red-500' : 'bg-[#28A745]';
    const creditGlow = overviewData.creditBalance < 200 ? 'shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'shadow-[0_0_8px_rgba(40,167,69,0.5)]';
    
    const totalLeads = overviewData.processedLeads + overviewData.unprocessedLeads;
    const leadsPercentage = totalLeads === 0 ? 0 : (overviewData.processedLeads / totalLeads) * 100;
    
    contentArea.className = 'absolute inset-0 z-10 p-4 md:p-8 overflow-y-auto custom-scrollbar flex items-start justify-center opacity-100 pointer-events-auto transition-opacity duration-700';
    
    contentArea.innerHTML = `
        <div class="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-10">
            
            <!-- Top Header Area -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h1 class="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">Overview</h1>
                    <p class="text-sm text-slate-500 font-medium mt-1">Manage your business operations for <span class="text-[#0F172A] font-bold">${overviewData.businessName}</span>.</p>
                </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <!-- Credit Balance -->
                <div class="glass-card p-6 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg cursor-default group">
                    <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full ${creditBg} ${creditGlow}"></span>
                        Credit Balance
                    </div>
                    <div class="flex items-center gap-1 mb-2">
                        <svg class="w-8 h-8 ${creditColor} opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <div class="text-4xl font-black ${creditColor} tracking-tighter">${overviewData.creditBalance.toLocaleString()}</div>
                    </div>
                    <div class="text-xs text-slate-500 font-medium">Available KES for AI usage</div>
                </div>

                <!-- Leads Progress Bar (Replaces old card) -->
                <div class="glass-card p-6 col-span-1 md:col-span-2 flex flex-col justify-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg cursor-default">
                    <div class="flex justify-between items-end mb-3">
                        <div class="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-[#28A745] shadow-[0_0_8px_rgba(40,167,69,0.4)]"></span>
                            Lead Processing Pipeline
                        </div>
                        <div class="text-right flex items-baseline gap-1">
                            <span class="text-3xl font-black text-[#28A745]">${overviewData.processedLeads}</span>
                            <span class="text-sm font-bold text-slate-400">/ ${totalLeads} Processed</span>
                        </div>
                    </div>
                    <div class="w-full h-4 bg-slate-200/50 rounded-full overflow-hidden shadow-inner relative">
                        <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-[#28A745] to-[#34d058] rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(40,167,69,0.6)]" style="width: ${leadsPercentage}%"></div>
                    </div>
                    <div class="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>0%</span>
                        <span class="text-slate-500">${overviewData.unprocessedLeads} Pending Interaction</span>
                    </div>
                </div>

            </div>

            <!-- Actions Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                
                <!-- WhatsApp Status Card -->
                <div class="glass-card p-6 flex flex-col justify-between relative overflow-hidden group">
                    <div class="flex justify-between items-start mb-8">
                        <div>
                            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <svg class="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771z"></path></svg>
                                Connection Setup
                            </h3>
                            <div class="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                                <span class="relative flex h-3 w-3 mr-1">
                                  ${overviewData.whatsappConnected ? '<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>' : ''}
                                  <span class="relative inline-flex rounded-full h-3 w-3 ${overviewData.whatsappConnected ? 'bg-[#25D366]' : 'bg-red-400'}"></span>
                                </span>
                                ${overviewData.whatsappConnected ? 'WhatsApp Linked' : 'No Device Linked'}
                            </div>
                        </div>
                    </div>
                    
                    <button onclick="openWhatsAppModal()" class="w-full py-3.5 ${overviewData.whatsappConnected ? 'bg-white/60 text-[#0F172A] border border-white/80 hover:bg-white' : 'bg-[#25D366] text-white hover:bg-[#128C7E] shadow-lg shadow-[#25D366]/20'} font-bold rounded-xl transition-all flex justify-center items-center gap-2">
                        <svg class="w-5 h-5 ${overviewData.whatsappConnected ? 'text-[#25D366]' : 'text-white'}" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 1.833 6.371L0 24l5.805-1.523A12 12 0 0 0 11.944 24c6.627 0 12-5.373 12-12S18.571 0 11.944 0zm0 20.254c-1.802 0-3.565-.483-5.112-1.398l-.366-.217-3.8.997.997-3.793-.217-.366A9.742 9.742 0 0 1 2.254 12c0-5.385 4.38-9.765 9.69-9.765 5.385 0 9.765 4.38 9.765 9.765s-4.38 9.765-9.765 9.765z"/></svg>
                        ${overviewData.whatsappConnected ? 'Manage Connection' : 'Connect WhatsApp'}
                    </button>
                </div>

                <!-- Account Funding Card -->
                <div class="glass-card p-6 flex flex-col justify-between relative overflow-hidden group">
                    <div class="flex justify-between items-start mb-8">
                        <div>
                            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Account Funding
                            </h3>
                            <div class="text-xl font-bold text-[#0F172A]">Top Up Credits</div>
                        </div>
                    </div>
                    <button onclick="openPaymentModal()" class="w-full py-3.5 bg-[#0F172A] text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex justify-center items-center gap-2">
                        Add Funds
                    </button>
                </div>

            </div>
        </div>

        <!-- Modals Restrict Render Area -->
        
        <!-- WhatsApp Connect Modal -->
        <div id="wa-modal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity duration-300">
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onclick="closeWhatsAppModal()"></div>
            <div id="wa-modal-content" class="glass-card w-full max-w-sm relative z-10 p-8 shadow-2xl border border-white/80 transform scale-95 translate-y-4 opacity-0 transition-all duration-300 ease-out">
                <div class="w-12 h-12 bg-[#25D366]/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg class="w-7 h-7 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 1.833 6.371L0 24l5.805-1.523A12 12 0 0 0 11.944 24c6.627 0 12-5.373 12-12S18.571 0 11.944 0zm0 20.254c-1.802 0-3.565-.483-5.112-1.398l-.366-.217-3.8.997.997-3.793-.217-.366A9.742 9.742 0 0 1 2.254 12c0-5.385 4.38-9.765 9.69-9.765 5.385 0 9.765 4.38 9.765 9.765s-4.38 9.765-9.765 9.765z"/></svg>
                </div>
                <h2 class="text-2xl font-black text-center text-[#0F172A] mb-2 tracking-tight">Link WhatsApp</h2>
                <p class="text-xs text-center text-slate-500 mb-6 font-medium px-4">Open WhatsApp on your phone, go to Linked Devices, and scan this code.</p>
                
                <div class="w-full aspect-square bg-white rounded-2xl mb-6 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 shadow-inner">
                    <svg class="w-16 h-16 text-slate-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    <span class="text-xs text-slate-400 font-bold uppercase tracking-widest">QR Code Area</span>
                </div>
                
                <div class="flex gap-3">
                    <button onclick="closeWhatsAppModal()" class="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-xl transition-all">Cancel</button>
                    <button onclick="simulateWAConnect()" class="flex-1 py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#128C7E] transition-all shadow-lg shadow-[#25D366]/20">Link Device</button>
                </div>
            </div>
        </div>

        <!-- Top-Up / Payment Modal -->
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
        title: 'Overview',
        description: 'Manage your business operations.',
        navId: 'nav-overview',
        render: renderOverviewContent
    };
}
