/**
 * HeySasa! PLAYGROUND CORE ENGINE
 * Implements Chat and Follow-up model training workflows.
 */

// 1. Extend the global PAGE_CONFIG
if (typeof PAGE_CONFIG !== 'undefined') {
    PAGE_CONFIG.playground = {
        title: 'The Playground',
        description: 'Train and test your AI models by modifying prompts and scenarios.',
        navId: 'nav-playground'
    };
}

// 2. State Management
let playgroundState = {
    currentModel: 'chat', // 'chat' or 'followup'
    isScenarioMode: false
};

// 3. The Main Renderer
function renderPlayground() {
    const contentArea = document.getElementById('content-area');
    // Clear all positioning and display classes
    contentArea.className = 'absolute inset-0 p-0 flex flex-row overflow-hidden opacity-100 pointer-events-auto gap-0';

    contentArea.innerHTML = `
        <div class="w-1/3 h-full glass-panel border-y-0 border-l-0 rounded-none flex flex-col overflow-hidden bg-white/20">
            <div class="p-6 border-b border-white/40">
                <h3 class="font-bold text-[#0F172A] flex items-center gap-2">
                    <svg class="w-4 h-4 text-[#28A745]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2" stroke-linecap="round"/></svg>
                    Instructions View
                </h3>
                <p class="text-[11px] text-[#64748B] font-medium mt-1 uppercase tracking-wider">System Prompt Configuration</p>
            </div>
            <textarea id="ai-instructions" class="flex-1 p-6 bg-transparent text-sm text-[#0F172A] outline-none resize-none leading-relaxed placeholder:text-slate-400" 
                placeholder="Define how the AI should behave, its tone, and its knowledge boundaries..."></textarea>
            <div class="p-4 bg-white/40 border-t border-white/40">
                <button onclick="savePlaygroundInstructions()" class="w-full py-3 bg-[#28A745] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#28A745]/20 hover:scale-[1.02] transition-all active:scale-95">
                    Save Instructions
                </button>
            </div>
        </div>

        <div class="flex-1 h-full flex flex-col overflow-hidden bg-slate-50/30">
            
            <div id="playground-top-controls" class="p-4 border-b border-white/40 bg-white/60 flex items-center justify-between">
                <div class="flex bg-slate-200/50 p-1 rounded-xl border border-white">
                    <button onclick="setPlaygroundModel('chat')" id="tab-chat" class="px-4 py-2 rounded-lg text-xs font-bold transition-all bg-[#28A745] text-white shadow-sm">Chat Model</button>
                    <button onclick="setPlaygroundModel('followup')" id="tab-followup" class="px-4 py-2 rounded-lg text-xs font-bold transition-all text-[#64748B] hover:text-[#0F172A]">Follow-up Model</button>
                </div>

                <div id="chat-model-tools" class="flex items-center gap-3">
                    <div id="scenario-input-area" class="hidden flex items-center gap-2 bg-white rounded-xl px-3 py-1.5 border border-orange-200 shadow-sm animate-in fade-in slide-in-from-right-4">
                        <input type="text" id="scenario-input" placeholder="type in your scenario" class="bg-transparent text-xs outline-none w-48 text-[#0F172A]">
                        <button onclick="applyScenario()" class="bg-[#FF8C00] text-white text-[10px] px-3 py-1 rounded-md font-bold uppercase hover:brightness-110 active:scale-90 transition-all">test</button>
                    </div>
                    <button onclick="toggleScenarioInput()" title="Create Scenario" class="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#FF8C00] shadow-sm hover:scale-110 transition-all border border-orange-100 font-bold text-xl">+</button>
                </div>

                <div id="followup-model-tools" class="hidden flex-1 flex justify-end animate-in fade-in duration-500">
                    <div class="relative w-full max-w-xs">
                        <input type="text" placeholder="Search leads to load history..." class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none focus:border-[#28A745] transition-all shadow-sm">
                        <svg class="w-4 h-4 absolute right-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2"/></svg>
                    </div>
                </div>
            </div>

            <div id="playground-messages" class="flex-1 overflow-y-auto p-8 space-y-6">
                ${renderAiMessage("Hello! I'm your AI model. Send a message to begin testing.")}
            </div>

            <div class="p-6 bg-white/60 border-t border-white/40">
                <div id="chat-input-view" class="flex gap-3">
                    <input type="text" id="pg-user-input" placeholder="What would a customer say..." class="flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 ring-[#28A745]/10 transition-all">
                    <button onclick="sendPlaygroundMessage()" class="bg-[#28A745] text-white px-6 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#28A745]/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send-horizontal-icon lucide-send-horizontal"><path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/><path d="M6 12h16"/></svg>
                    </button>
                </div>
                
                <button id="followup-button-view" onclick="simulateFollowUp()" class="hidden w-full py-4 bg-[#FF8C00] text-white rounded-2xl font-bold text-lg shadow-xl shadow-[#FF8C00]/20 hover:scale-[1.01] active:scale-95 transition-all">
                    Follow up
                </button>
            </div>
        </div>
    `;
}

// 4. Component Renderers
function renderAiMessage(text, timestamp = null) {
    const timeLabel = timestamp ? 
        `<div class="text-[10px] mt-2 opacity-80 font-medium italic border-t border-white/20 pt-1">To be sent at ${timestamp}</div>` : '';

    return `
        <div class="flex flex-col items-start group relative animate-in fade-in slide-in-from-left-4 mb-4">
            <div class="relative max-w-[80%] bg-[#FF8C00] text-white px-5 py-3.5 rounded-2xl rounded-tl-none shadow-lg shadow-orange-500/10">
                <p class="text-sm leading-relaxed">${text}</p>
                ${timeLabel}
                
                <div class="absolute -right-12 top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <button onclick="reinforceResponse(this, true)" class="p-2 bg-[#28A745] text-white rounded-full shadow-lg hover:scale-110 active:scale-90 transition-all" title="Correct Response">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <button onclick="showCorrectionInput(this)" class="p-2 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 active:scale-90 transition-all" title="Incorrect Response">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                </div>
            </div>
            <div class="correction-container w-full"></div>
        </div>
    `;
}

function renderUserMessage(text) {
    return `
        <div class="flex justify-end animate-in fade-in slide-in-from-right-4 mb-4">
            <div class="max-w-[80%] bg-[#28A745] text-white px-5 py-3.5 rounded-2xl rounded-tr-none shadow-md">
                <p class="text-sm leading-relaxed">${text}</p>
            </div>
        </div>
    `;
}

function renderLeadMessage(text) {
    return `
        <div class="flex justify-start animate-in fade-in slide-in-from-left-4 mb-4">
            <div class="max-w-[80%] bg-[#64748B] text-white px-5 py-3.5 rounded-2xl rounded-tl-none shadow-md">
                <p class="text-sm leading-relaxed">${text}</p>
            </div>
        </div>
    `;
}

// 5. Logic & Event Handlers
window.setPlaygroundModel = (model) => {
    playgroundState.currentModel = model;
    const isChat = model === 'chat';

    // Tabs Toggle
    document.getElementById('tab-chat').className = isChat ? 'px-4 py-2 rounded-lg text-xs font-bold transition-all bg-[#28A745] text-white shadow-sm' : 'px-4 py-2 rounded-lg text-xs font-bold transition-all text-[#64748B] hover:text-[#0F172A]';
    document.getElementById('tab-followup').className = !isChat ? 'px-4 py-2 rounded-lg text-xs font-bold transition-all bg-[#28A745] text-white shadow-sm' : 'px-4 py-2 rounded-lg text-xs font-bold transition-all text-[#64748B] hover:text-[#0F172A]';

    // Tools Toggle
    document.getElementById('chat-model-tools').classList.toggle('hidden', !isChat);
    document.getElementById('followup-model-tools').classList.toggle('hidden', isChat);
    
    // Input Toggle
    document.getElementById('chat-input-view').classList.toggle('hidden', !isChat);
    document.getElementById('followup-button-view').classList.toggle('hidden', isChat);

    const messages = document.getElementById('playground-messages');
    messages.innerHTML = renderAiMessage(isChat ? "Chat model loaded. Send a message to begin." : "Follow-up model loaded. Search for a lead to see history or click 'Follow up'.");
};

window.toggleScenarioInput = () => {
    const el = document.getElementById('scenario-input-area');
    el.classList.toggle('hidden');
    if(!el.classList.contains('hidden')) document.getElementById('scenario-input').focus();
};

window.applyScenario = () => {
    const scenario = document.getElementById('scenario-input').value;
    if(scenario) {
        playgroundState.isScenarioMode = true;
        showPlaygroundToast("Scenario updated! The AI now sees through this lens.", "success");
        document.getElementById('scenario-input-area').classList.add('hidden');
    }
};

window.showCorrectionInput = (btn) => {
    const parentContainer = btn.closest('.group');
    const correctionTarget = parentContainer.querySelector('.correction-container');
    
    if(correctionTarget.querySelector('.correction-box')) return;

    const div = document.createElement('div');
    div.className = "correction-box mt-3 flex items-center gap-2 animate-in slide-in-from-left-2 duration-300";
    div.innerHTML = `
        <input type="text" placeholder="how would ai have responded?" class="text-xs p-2.5 rounded-xl border border-red-200 bg-white outline-none w-64 shadow-sm focus:ring-2 ring-red-50">
        <button onclick="reinforceResponse(this, false)" class="bg-[#28A745] text-white text-[10px] px-4 py-2.5 rounded-xl font-bold shadow-md hover:brightness-110 active:scale-95 transition-all">SAVE</button>
    `;
    correctionTarget.appendChild(div);
    div.querySelector('input').focus();
};

window.reinforceResponse = (el, isTick) => {
    if(!isTick) {
        const box = el.closest('.correction-box');
        if(box) box.remove();
    }
    showPlaygroundToast("response saved!", "success");
};

window.sendPlaygroundMessage = () => {
    const input = document.getElementById('pg-user-input');
    const container = document.getElementById('playground-messages');
    if(!input.value) return;

    container.innerHTML += renderUserMessage(input.value);
    const userMsg = input.value;
    input.value = '';
    
    setTimeout(() => {
        const responseText = playgroundState.isScenarioMode 
            ? "I'm viewing this through your custom scenario lens. Tone adjusted." 
            : "Understood. Based on your instructions, I'll keep the conversation moving forward.";
        container.innerHTML += renderAiMessage(responseText);
        container.scrollTop = container.scrollHeight;
    }, 800);
};

window.simulateFollowUp = () => {
    const container = document.getElementById('playground-messages');
    
    // Simulate a lead history message first if container is empty
    if(container.children.length <= 1) {
        container.innerHTML += renderLeadMessage("I was looking at the catalog but wasn't sure about the delivery times.");
    }

    setTimeout(() => {
        const now = new Date();
        const analysisTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        container.innerHTML += renderAiMessage("Hi! Just checking in to see if you had a chance to look at our delivery schedule?", analysisTime);
        container.scrollTop = container.scrollHeight;
    }, 500);
};

window.savePlaygroundInstructions = () => {
    showPlaygroundToast("Instructions saved! Model updated.", "success");
};

// 6. Global Utility: Toast
window.showPlaygroundToast = (msg, type = "success") => {
    const toast = document.createElement('div');
    const bgColor = type === "success" ? "bg-[#28A745]" : "bg-red-500";
    toast.className = `fixed top-24 left-1/2 -translate-x-1/2 ${bgColor} text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg z-[1000] border border-white/20 animate-in fade-in duration-300`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('animate-out', 'fade-out', 'duration-300');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
};

// 7. Page Switch Logic
const originalSwitchPage = window.switchPage;
window.switchPage = function(page) {
    if (page === 'playground') {
        const config = PAGE_CONFIG[page];
        const contentArea = document.getElementById('content-area');
        
        document.querySelectorAll('[id^="nav-"]').forEach(item => item.classList.remove('active'));
        const navItem = document.getElementById(config.navId);
        if (navItem) navItem.classList.add('active');
        
        document.getElementById('section-title').textContent = config.title;
        document.getElementById('section-description').textContent = config.description;
        if(document.getElementById('alpha-strip')) document.getElementById('alpha-strip').classList.add('hidden');
        
        // Reset content area to proper flex container
        contentArea.className = 'absolute inset-0 p-0 flex flex-row overflow-hidden opacity-100 pointer-events-auto gap-0';
        
        renderPlayground();
    } else if (originalSwitchPage) {
        originalSwitchPage(page);
    }
};