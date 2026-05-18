const mockLeads = [
    {
        id: 1,
        name: "Sarah Wambui",
        phone: "+254 712 345 678",
        lead_quality: "Hot",
        conv_stage: "Price Inquiry",
        cart_state: ["Solar Inverter 5kW", "Lithium Battery"],
        customer_intent: "Needs home office backup; worried about installation time.",
        next_action_plan: "Send the 'Fast-Track Installation' offer and technician schedule.",
        psychology: "Values reliability over cost. Needs reassurance on warranty.",
        trust_markers: ["KRA Verified", "Till Number Displayed"],
        vibe_check: "Polite but urgent; highly focused on technical specs and timelines.",
        transcript: [
            { sender: "Sarah", msg: "Hi, how much is the 5kW system?" },
            { sender: "AI", msg: "Hi Sarah! Our 5kW system starts at 150k. Would you like to see our installation packages?" },
            { sender: "Sarah", msg: "Yes, but how long does it take to install? I work from home." },
            { sender: "User", msg: "Hi Sarah, human agent here. We can prioritize your installation for tomorrow morning. It takes about 4 hours." }
        ]
    }
];

let leadsSearchQuery = '';

function handleLeadsSearch(query) {
    leadsSearchQuery = query.toLowerCase();
    renderLeadsList();
}

function getFilteredLeads() {
    return mockLeads.filter(lead => {
        return lead.name.toLowerCase().includes(leadsSearchQuery) || 
               lead.phone.includes(leadsSearchQuery) ||
               lead.lead_quality.toLowerCase().includes(leadsSearchQuery) ||
               lead.conv_stage.toLowerCase().includes(leadsSearchQuery) ||
               lead.customer_intent.toLowerCase().includes(leadsSearchQuery);
    });
}

function renderLeadsList() {
    const contentArea = document.getElementById('content-area');
    contentArea.classList.remove('items-center', 'justify-center');
    contentArea.classList.add('flex-col', 'overflow-y-auto', 'p-4');
    
    const filteredLeads = getFilteredLeads();
    
    let html = `
        <div class="flex flex-col gap-6 w-full max-w-5xl mx-auto">
            
            <div class="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div class="relative flex-1 min-w-[280px]">
                    <span class="absolute inset-y-0 left-4 flex items-center text-gray-400">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input 
                        type="text" 
                        placeholder="Search leads by name, intent, or stage..." 
                        value="${leadsSearchQuery}"
                        oninput="handleLeadsSearch(this.value)"
                        class="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 transition-all"
                    >
                </div>
                <div class="flex items-center gap-3">
                    <div class="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-semibold border border-green-100">
                        Total Leads: ${filteredLeads.length}
                    </div>
                   <button onclick="openAddLeadModal()" class="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        Add Lead
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-4">
    `;

    if (filteredLeads.length === 0) {
        html += `<div class="text-center text-gray-400 py-12 bg-white rounded-2xl border border-gray-100">No leads found matching your criteria.</div>`;
    } else {
        filteredLeads.forEach(lead => {
            const qualityColor = lead.lead_quality.toLowerCase() === 'hot' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-orange-50 text-orange-600 border-orange-200';
            const cartSummary = lead.cart_state.join(', ');

            html += `
                <div onclick="openLeadIntelligence(${lead.id})" data-sort-name="${lead.name}" class="bg-white p-5 rounded-2xl border border-gray-100 hover:border-green-400 hover:shadow-md transition-all cursor-pointer group flex flex-col md:flex-row md:items-center gap-4">
                    
                    <div class="flex items-center gap-4 min-w-[220px]">
                        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-green-700 font-bold text-lg shadow-inner">
                            ${lead.name.charAt(0)}
                        </div>
                        <div>
                            <h4 class="font-bold text-gray-900 text-base">${lead.name}</h4>
                            <p class="text-xs text-gray-500 font-medium">${lead.phone}</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 md:w-[220px] flex-shrink-0">
                        <span class="px-2.5 py-1 rounded-md text-[10px] font-bold border ${qualityColor} uppercase tracking-wider whitespace-nowrap">
                            ${lead.lead_quality === 'Hot' ? '🔥' : '⚡'} ${lead.lead_quality}
                        </span>
                        <span class="px-2.5 py-1 rounded-md text-[10px] font-bold border border-gray-200 bg-gray-50 text-gray-600 uppercase tracking-wider whitespace-nowrap">
                            📍 ${lead.conv_stage}
                        </span>
                    </div>

                    <div class="flex-1 text-sm text-gray-600 line-clamp-1 border-l-2 border-gray-100 pl-4">
                        <span class="font-semibold text-gray-800 text-[10px] uppercase tracking-wider block mb-0.5">
                            Interested In: <span class="text-green-600">${cartSummary}</span>
                        </span>
                        <span class="italic text-gray-500">"${lead.customer_intent}"</span>
                    </div>

                    <div class="hidden md:flex items-center justify-center w-10">
                        <svg class="w-5 h-5 text-gray-300 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </div>
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
        <div class="border-b border-gray-100 pb-4 mb-5 relative">
            <h2 class="text-xl font-bold text-gray-900">${lead.name}</h2>
            <p class="text-sm text-gray-500">${lead.phone}</p>
            <button onclick="openChatDrawer(${lead.id})" class="absolute bottom-4 right-0 flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-full text-xs font-bold transition-all border border-green-200 shadow-sm hover:shadow-md">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
                View Chat
            </button>
        </div>

        <div class="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 p-5 rounded-2xl mb-6">
            <div class="flex items-center justify-between mb-2">
                <span class="flex items-center gap-2 text-[10px] font-bold text-orange-700 uppercase tracking-wider">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Suggested Next Action
                </span>
                <span class="px-2 py-0.5 bg-orange-100/50 text-orange-700 text-[9px] font-bold rounded uppercase tracking-wider flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                    AI Managed
                </span>
            </div>
            <p class="text-sm text-gray-800 font-medium mb-4">${lead.next_action_plan}</p>
            
            <div class="flex flex-col gap-3">
                <button onclick="alert('Action queued. The Follow-up AI will determine the optimal time to send this message.')" 
                    class="flex items-center justify-center gap-2 w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-orange-500/20 group relative overflow-hidden">
                    <div class="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    Execute Next Step
                </button>
                <div class="text-center pt-1">
                    <span class="text-xs text-gray-500">Need it sent immediately? </span>
                    <a href="https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(lead.next_action_plan)}" target="_blank" 
                       class="text-xs font-bold text-green-600 hover:text-green-700 underline underline-offset-2 transition-colors">
                        Send manually via WhatsApp
                    </a>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-5 mb-6">
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Customer Psychology & Intent</h4>
                <p class="text-sm text-gray-700 leading-relaxed mb-2"><span class="font-semibold">Intent:</span> ${lead.customer_intent}</p>
                <p class="text-sm text-gray-700 leading-relaxed"><span class="font-semibold">Psychology:</span> ${lead.psychology}</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Vibe Check</h4>
                <div class="flex items-start gap-2">
                    <span class="text-lg">🔮</span>
                    <p class="text-sm text-gray-700 leading-relaxed italic">"${lead.vibe_check || 'Analysis pending...'}"</p>
                </div>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Cart Status</h4>
                <div class="flex flex-wrap gap-2">
                    ${lead.cart_state.map(item => `<span class="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700">${item}</span>`).join('')}
                </div>
            </div>

            <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Trust Markers Hit</h4>
                <div class="flex flex-wrap gap-2">
                    ${lead.trust_markers.map(marker => `<span class="px-3 py-1 bg-green-50 border border-green-100 rounded-lg text-xs font-medium text-green-700">${marker}</span>`).join('')}
                </div>
            </div>
        </div>
    `;

    intelDrawer.classList.add('drawer-open');
}

function generateChatHTML(transcript) {
    return transcript.map(t => {
        let alignClass = '';
        let bubbleClass = '';
        let senderLabel = '';

        if (t.sender === 'AI') {
            alignClass = 'self-end items-end';
            bubbleClass = 'bg-orange-500 text-white rounded-br-none';
            senderLabel = '<span class="text-[9px] font-bold text-gray-400 uppercase mb-1 mr-1">AI Assistant</span>';
        } else if (t.sender === 'User') {
            alignClass = 'self-end items-end';
            bubbleClass = 'bg-green-600 text-white rounded-br-none';
            senderLabel = '<span class="text-[9px] font-bold text-gray-400 uppercase mb-1 mr-1">You</span>';
        } else {
            alignClass = 'self-start items-start';
            bubbleClass = 'bg-gray-200 text-gray-800 rounded-bl-none';
            senderLabel = `<span class="text-[9px] font-bold text-gray-400 uppercase mb-1 ml-1">${t.sender}</span>`;
        }

        return `
            <div class="flex flex-col w-full ${alignClass}">
                ${senderLabel}
                <div class="max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${bubbleClass}">
                    ${t.msg}
                </div>
            </div>
        `;
    }).join('');
}

function openChatDrawer(id) {
    const lead = mockLeads.find(l => l.id === id);
    const chatContent = document.getElementById('chat-content');
    
    chatContent.innerHTML = `
        <div class="flex flex-col gap-4">
            ${generateChatHTML(lead.transcript)}
        </div>
    `;
    
    document.getElementById('chat-drawer').classList.add('drawer-open');
    document.getElementById('intel-drawer').classList.add('intel-active');
}

function toggleChat() {
    document.getElementById('chat-drawer').classList.remove('drawer-open');
    document.getElementById('intel-drawer').classList.remove('intel-active');
}

function closeDrawers() {
    document.getElementById('intel-drawer').classList.remove('drawer-open');
    document.getElementById('chat-drawer').classList.remove('drawer-open');
    document.getElementById('intel-drawer').classList.remove('intel-active');
}

function renderLeadsContent() {
    renderLeadsList();
}

// Register Leads page configuration
if (typeof PAGE_CONFIG !== 'undefined') {
    PAGE_CONFIG.leads = {
        title: 'Leads',
        description: 'Manage and track all your leads.',
        navId: 'nav-leads',
        render: renderLeadsContent
    };
}