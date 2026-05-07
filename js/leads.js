const mockLeads = [
    {
        id: 1,
        name: "Sarah Wambui",
        phone: "254712345678",
        lead_quality: "Hot",
        conv_stage: "Price Inquiry",
        cart_state: ["Solar Inverter 5kW", "Lithium Battery"],
        customer_intent: "Needs home office backup; worried about installation time.",
        next_action_plan: "Send the 'Fast-Track Installation' offer and technician schedule.",
        psychology: "Values reliability over cost. Needs reassurance on warranty.",
        trust_markers: "Responded well to the KRA Verified badge and Till Number.",
        transcript: [
            { sender: "Sarah", msg: "Hi, how much is the 5kW system?" },
            { sender: "AI", msg: "Hi Sarah! Our 5kW system starts at 150k. Would you like to see our installation packages?" },
            { sender: "Sarah", msg: "Yes, but how long does it take to install? I work from home." }
        ]
    }
];

// Section Configuration - easily extensible for new sections
// MOVED TO dashboard.html as global configuration

// Update Header Title and Description  
// MOVED TO dashboard.html as updateHeader() function

let leadsSearchQuery = ''; // Search state for leads

function handleLeadsSearch(query) {
    leadsSearchQuery = query.toLowerCase();
    renderLeadsList();
}

function getFilteredLeads() {
    return mockLeads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(leadsSearchQuery) || 
                              lead.phone.includes(leadsSearchQuery) ||
                              lead.lead_quality.toLowerCase().includes(leadsSearchQuery) ||
                              lead.conv_stage.toLowerCase().includes(leadsSearchQuery) ||
                              lead.customer_intent.toLowerCase().includes(leadsSearchQuery);
        return matchesSearch;
    });
}

function renderLeadsList() {
    const contentArea = document.getElementById('content-area');
    
    // Remove centering classes and add proper layout for list view
    contentArea.classList.remove('items-center', 'justify-center');
    contentArea.classList.add('flex-col', 'overflow-y-auto');
    
    const filteredLeads = getFilteredLeads();
    
    let html = `
        <div class="flex flex-col gap-6 w-full max-w-full overflow-x-hidden p-1">
            
            <!-- Search & Actions Row -->
            <div class="flex flex-wrap items-center justify-between gap-4">
                <!-- Search Bar -->
                <div class="relative flex-1 min-w-[280px]">
                    <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input 
                        type="text" 
                        placeholder="Search by name, phone, quality, or intent..." 
                        value="${leadsSearchQuery}"
                        oninput="handleLeadsSearch(this.value)"
                        class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                    >
                </div>

                <!-- Lead Count -->
                <div class="px-4 py-2.5 bg-gray-50 rounded-2xl text-xs font-bold text-gray-600">
                    ${filteredLeads.length} lead${filteredLeads.length !== 1 ? 's' : ''}
                </div>
            </div>

            <!-- Leads List -->
            <div class="w-full flex flex-col gap-3">
    `;

    if (filteredLeads.length === 0) {
        html += `<p class="text-center text-gray-400 py-10">No leads found.</p>`;
    } else {
        filteredLeads.forEach(lead => {
            html += `
                <div onclick="openLeadIntelligence(${lead.id})" class="glass-card p-5 flex items-center gap-6 cursor-pointer hover:border-[#28A745]/40 hover:shadow-xl transition-all group">
                    <div class="w-12 h-12 rounded-xl bg-[#28A745]/10 flex items-center justify-center text-[#28A745] font-bold">
                        ${lead.name.charAt(0)}
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <h4 class="font-bold text-[#0F172A]">${lead.name}</h4>
                            <span class="px-2 py-0.5 rounded-full text-[9px] font-bold border border-red-200 bg-red-50 text-red-600 uppercase">🔥 ${lead.lead_quality}</span>
                        </div>
                        <p class="text-xs text-slate-500">${lead.phone} • <span class="text-[#28A745] font-medium">${lead.conv_stage}</span></p>
                    </div>
                    <div class="hidden md:block flex-[1.5] text-xs text-slate-600 line-clamp-1">
                        <span class="font-semibold text-slate-800">Latest Intent:</span> ${lead.customer_intent}
                    </div>
                    <svg class="w-5 h-5 text-slate-300 group-hover:text-[#28A745]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="2.5" stroke-linecap="round"></path></svg>
                </div>
            `;
        });
    }

    html += `</div></div>`;
    contentArea.innerHTML = html;
}

function openLeadIntelligence(id) {
    const lead = mockLeads.find(l => l.id === id);
    const intelDrawer = document.getElementById('intel-drawer');
    const intelContent = document.getElementById('intel-content');

    intelContent.innerHTML = `
        <div class="bg-[#28A745]/5 border border-[#28A745]/20 p-4 rounded-2xl mb-6">
            <span class="text-[10px] font-bold text-[#28A745] uppercase tracking-wider">Recommended Next Action</span>
            <p class="text-sm text-[#0F172A] font-medium mt-1 mb-3">${lead.next_action_plan}</p>
            <a href="https://wa.me/${lead.phone}?text=${encodeURIComponent(lead.next_action_plan)}" target="_blank" 
               class="flex items-center justify-center gap-2 w-full py-2.5 bg-[#28A745] hover:bg-[#208739] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#28A745]/20">
                Execute Action via WhatsApp
            </a>
        </div>

        <div class="space-y-4">
            <div>
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Customer Psychology</h4>
                <p class="text-sm text-slate-700 leading-relaxed">${lead.psychology}</p>
            </div>
            <div>
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Trust Markers Hit</h4>
                <div class="flex flex-wrap gap-2">
                    <span class="px-3 py-1 bg-white border border-slate-100 rounded-lg text-xs text-slate-600 shadow-sm">${lead.trust_markers}</span>
                </div>
            </div>
        </div>

        <button onclick="toggleChat()" class="fixed bottom-8 right-6 w-14 h-14 bg-white border border-slate-200 shadow-2xl rounded-2xl flex items-center justify-center hover:scale-110 transition-transform group">
            <img src="images/favicon.png" class="w-7 h-7" alt="Chat">
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
        </button>
    `;

    intelDrawer.classList.add('drawer-open');
    
    // Prepare Chat Content
    const chatContent = document.getElementById('chat-content');
    chatContent.innerHTML = lead.transcript.map(t => `
        <div class="mb-4 ${t.sender === 'AI' ? 'text-left' : 'text-right'}">
            <span class="text-[10px] font-bold text-slate-400 uppercase">${t.sender}</span>
            <div class="mt-1 p-3 rounded-2xl text-xs inline-block max-w-[80%] ${t.sender === 'AI' ? 'bg-white border border-slate-200 text-slate-700' : 'bg-[#28A745] text-white'} shadow-sm">
                ${t.msg}
            </div>
        </div>
    `).join('');
}

function toggleChat() {
    const chatDrawer = document.getElementById('chat-drawer');
    const intelDrawer = document.getElementById('intel-drawer');
    chatDrawer.classList.toggle('drawer-open');
    intelDrawer.classList.toggle('intel-active');
}

function closeDrawers() {
    document.getElementById('intel-drawer').classList.remove('drawer-open', 'intel-active');
    document.getElementById('chat-drawer').classList.remove('drawer-open');
}

// Render leads content properly
function renderLeadsContent() {
    const contentArea = document.getElementById('content-area');
    
    // Remove centering classes and add proper layout for list view
    contentArea.classList.remove('items-center', 'justify-center');
    contentArea.classList.add('flex-col', 'overflow-y-auto');
    
    renderLeadsList();
}

// Initial render on page load (Products will be default)
setTimeout(() => {
    // Products page is rendered by default via dashboard.html skeleton
    // Leads will render when clicked
}, 2100);

