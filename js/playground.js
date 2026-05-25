/**
 * HeySasa! PLAYGROUND CORE ENGINE (v2 Premium Redesign)
 * Implements Chat and Follow-up model training workflows with a Two-Panel Architecture.
 */

// 1. Extend the global PAGE_CONFIG
if (typeof PAGE_CONFIG !== 'undefined') {
    PAGE_CONFIG.playground = {
        title: 'The Playground',
        description: 'Train models, upload knowledge base documents, and simulate scenarios.',
        navId: 'nav-playground',
        render: renderPlayground
    };
}

// 2. State Management
let playgroundState = {
    currentModel: 'chat', // 'chat' or 'followup'
    activeBrainTab: 'instructions', // 'instructions', 'knowledge', 'scenarios'
    isScenarioMode: false,
    activeScenario: null
};

// 3. Inject Premium Styles
function injectPlaygroundStyles() {
    if (document.getElementById('playground-styles')) return;
    const style = document.createElement('style');
    style.id = 'playground-styles';
    style.textContent = `
        /* Main Layout */
        .pg-wrap { display: flex; height: 100%; overflow: hidden; background: transparent; width: 100%; }
        
        /* The Brain (Left Panel) */
        .pg-brain { width: 40%; min-width: 380px; flex-shrink: 0; display: flex; flex-direction: column; background: rgba(255,255,255,0.5); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-right: 1px solid rgba(255,255,255,0.7); z-index: 10; border-radius: 2rem 0 0 2rem; }
        
        /* The Simulator (Right Panel) */
        .pg-sim { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: rgba(248, 250, 252, 0.4); z-index: 5; border-radius: 0 2rem 2rem 0;}
        
        /* Tabs */
        .pg-tabs-wrap { display: flex; gap: 8px; padding: 24px 24px 0; border-bottom: 1px solid rgba(15,23,42,0.05); overflow-x: auto; scrollbar-width: none; }
        .pg-tabs-wrap::-webkit-scrollbar { display: none; }
        .pg-tab { padding: 10px 16px; border-radius: 12px 12px 0 0; font-size: 12px; font-weight: 700; color: #64748B; cursor: pointer; transition: all 0.2s; border-bottom: 3px solid transparent; white-space: nowrap; }
        .pg-tab:hover { color: #0F172A; background: rgba(255,255,255,0.4); }
        .pg-tab.active { color: #0F172A; border-bottom-color: #28A745; background: rgba(255,255,255,0.7); }
        
        /* Content Areas */
        .pg-tab-content { flex: 1; overflow-y: auto; padding: 24px; display: none; flex-direction: column; }
        .pg-tab-content.active { display: flex; }
        
        /* Textarea */
        .pg-textarea { flex: 1; width: 100%; bg: transparent; border: none; resize: none; font-size: 13px; line-height: 1.6; color: #0F172A; outline: none; background: rgba(255,255,255,0.4); padding: 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.8); box-shadow: inset 0 2px 5px rgba(0,0,0,0.02); }
        .pg-textarea:focus { background: rgba(255,255,255,0.8); border-color: #28A745; }
        
        /* Dropzone */
        .pg-dropzone { border: 2px dashed rgba(15,23,42,0.15); border-radius: 16px; padding: 32px 20px; text-align: center; cursor: pointer; transition: all 0.2s; background: rgba(255,255,255,0.4); margin-bottom: 20px; }
        .pg-dropzone:hover { border-color: #28A745; background: rgba(40,167,69,0.05); }
        
        /* Glass Cards */
        .pg-glass-card { background: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.9); box-shadow: 0 4px 15px rgba(0,0,0,0.02); border-radius: 16px; padding: 16px; margin-bottom: 16px; }
        
        /* Buttons */
        .pg-btn-primary { width: 100%; padding: 14px; background: #28A745; color: #fff; rounded: 14px; font-weight: 700; font-size: 13px; border: none; border-radius: 14px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 15px rgba(40,167,69,0.2); display: flex; align-items: center; justify-content: center; gap: 8px; }
        .pg-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(40,167,69,0.3); }
        .pg-btn-primary:active { transform: scale(0.98); }
        
        /* Top Toggles */
        .pg-toggle-wrap { display: inline-flex; background: rgba(15,23,42,0.05); padding: 4px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.6); }
        .pg-toggle-btn { padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; color: #64748B; cursor: pointer; transition: all 0.2s; border: none; background: transparent; }
        .pg-toggle-btn.active { background: #fff; color: #0F172A; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        
        /* Chat Area (Inheriting Leads structure but self-contained) */
        .pg-chat-scroll { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; scroll-behavior: smooth; }
        .pg-bubble-wrap { display: flex; flex-direction: column; max-width: 85%; position: relative; }
        .pg-bubble-wrap.out { align-self: flex-end; align-items: flex-end; }
        .pg-bubble-wrap.in { align-self: flex-start; align-items: flex-start; }
        
        .pg-sender-label { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #94A3B8; margin-bottom: 4px; padding: 0 4px; }
        .pg-bubble { padding: 14px 18px; border-radius: 16px; font-size: 13px; line-height: 1.5; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        
        .pg-bubble-ai { background: #28A745; color: #fff; border-bottom-right-radius: 4px; }
        .pg-bubble-lead { background: rgba(255,255,255,0.9); color: #0F172A; border-bottom-left-radius: 4px; border: 1px solid rgba(255,255,255,1); }
        
        /* Correction Actions */
        .pg-correction-actions { position: absolute; top: 20px; display: flex; gap: 6px; opacity: 0; transition: opacity 0.2s; }
        .pg-bubble-wrap.out .pg-correction-actions { right: calc(100% + 8px); flex-direction: row-reverse; }
        .pg-bubble-wrap:hover .pg-correction-actions { opacity: 1; }
        
        .pg-action-btn { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; color: white; transition: all 0.2s; shadow-md; }
        .pg-btn-good { background: #28A745; }
        .pg-btn-bad { background: #EF4444; }
        .pg-action-btn:hover { transform: scale(1.1); }
        
        /* Input Area */
        .pg-input-area { padding: 20px 24px 24px; border-top: 1px solid rgba(15,23,42,0.05); background: rgba(255,255,255,0.6); backdrop-filter: blur(10px); }
        .pg-input-row { display: flex; gap: 12px; align-items: center; }
        .pg-chat-input { flex: 1; padding: 14px 20px; background: rgba(255,255,255,0.9); border: 1px solid rgba(255,255,255,1); border-radius: 20px; font-size: 13px; outline: none; box-shadow: inset 0 2px 4px rgba(0,0,0,0.01); color: #0F172A; transition: all 0.2s; }
        .pg-chat-input:focus { border-color: #28A745; box-shadow: 0 0 0 3px rgba(40,167,69,0.1); }
        
        /* Scrollbars */
        .pg-tab-content::-webkit-scrollbar, .pg-chat-scroll::-webkit-scrollbar { width: 6px; }
        .pg-tab-content::-webkit-scrollbar-track, .pg-chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .pg-tab-content::-webkit-scrollbar-thumb, .pg-chat-scroll::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.1); border-radius: 10px; }
    `;
    document.head.appendChild(style);
}

// 4. The Main Renderer
function renderPlayground() {
    injectPlaygroundStyles();
    const contentArea = document.getElementById('content-area');
    
    // Clear styling to allow full bleed
    contentArea.className = 'absolute inset-0 p-0 flex flex-row overflow-hidden opacity-100 pointer-events-auto gap-0 bg-transparent';

    contentArea.innerHTML = `
        <div class="pg-wrap animate-in fade-in duration-500">
            
            <div class="pg-brain">
                <div class="px-6 pt-6 pb-2">
                    <h2 class="text-lg font-extrabold text-[#0F172A] flex items-center gap-2">
                        <svg class="w-5 h-5 text-[#28A745]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        The Brain
                    </h2>
                    <p class="text-[11px] text-[#64748B] font-semibold mt-1">Configure AI logic and knowledge.</p>
                </div>

                <div class="pg-tabs-wrap">
                    <div id="tab-btn-instructions" class="pg-tab active" onclick="setBrainTab('instructions')">Instructions</div>
                    <div id="tab-btn-knowledge" class="pg-tab" onclick="setBrainTab('knowledge')">Knowledge Base</div>
                    <div id="tab-btn-scenarios" class="pg-tab" onclick="setBrainTab('scenarios')">Scenarios</div>
                </div>

                <div id="tab-content-instructions" class="pg-tab-content active">
                    <textarea id="ai-instructions" class="pg-textarea mb-4" placeholder="Define how the AI should behave, its tone, and its knowledge boundaries... You are a helpful sales assistant for HeySasa..."></textarea>
                    <button onclick="savePlaygroundInstructions()" class="pg-btn-primary mt-auto">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        Save System Prompt
                    </button>
                </div>

                <div id="tab-content-knowledge" class="pg-tab-content">
                    <div class="pg-dropzone" onclick="alert('File picker simulation')">
                        <svg class="w-8 h-8 mx-auto mb-2 text-[#28A745]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p class="text-sm font-bold text-[#0F172A] mb-1">Upload Business Documents</p>
                        <p class="text-xs text-[#64748B]">PDF, DOCX, CSV or TXT up to 50MB</p>
                    </div>

                    <div class="flex gap-2 mb-6">
                        <input type="text" placeholder="https://yourwebsite.com/pricing" class="flex-1 px-4 py-2 bg-white/60 border border-white/90 rounded-xl text-xs outline-none focus:border-[#28A745]">
                        <button class="px-4 py-2 bg-[#0F172A] text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">Crawl URL</button>
                    </div>

                    <h3 class="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] mb-3">Active Context</h3>
                    
                    <div class="pg-glass-card !p-3 flex items-center justify-between mb-2">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-500">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                            </div>
                            <div>
                                <p class="text-xs font-bold text-[#0F172A]">Pricing_List_2026.pdf</p>
                                <p class="text-[10px] text-[#64748B]">Processed • 2.4 MB</p>
                            </div>
                        </div>
                        <button class="text-slate-400 hover:text-red-500 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                    </div>
                </div>

                <div id="tab-content-scenarios" class="pg-tab-content">
                    <div class="flex gap-2 mb-6">
                        <input type="text" id="scenario-input" placeholder="e.g. Angry customer asking for refund" class="flex-1 px-4 py-2 bg-white/60 border border-white/90 rounded-xl text-xs outline-none focus:border-[#28A745]">
                        <button onclick="applyScenario()" class="px-4 py-2 bg-[#28A745] text-white rounded-xl text-xs font-bold hover:scale-[1.02] active:scale-95 transition-all">Set Lens</button>
                    </div>

                    <h3 class="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] mb-3">Saved Lenses</h3>
                    
                    <div class="pg-glass-card !p-3 flex items-center justify-between cursor-pointer hover:border-[#28A745] transition-colors" onclick="document.getElementById('scenario-input').value='Price Shopper'; applyScenario();">
                        <div>
                            <p class="text-xs font-bold text-[#0F172A]">Price Shopper</p>
                            <p class="text-[10px] text-[#64748B]">Highly resistant, comparing with competitors.</p>
                        </div>
                        <div class="w-2 h-2 rounded-full bg-slate-300"></div>
                    </div>
                    
                    <div class="pg-glass-card !p-3 flex items-center justify-between cursor-pointer hover:border-[#28A745] transition-colors" onclick="document.getElementById('scenario-input').value='Technical Buyer'; applyScenario();">
                        <div>
                            <p class="text-xs font-bold text-[#0F172A]">Technical Buyer</p>
                            <p class="text-[10px] text-[#64748B]">Wants detailed specs, skeptical of marketing.</p>
                        </div>
                        <div class="w-2 h-2 rounded-full bg-slate-300"></div>
                    </div>
                </div>
            </div>

            <div class="pg-sim">
                <div class="p-4 border-b border-white/40 bg-white/50 backdrop-blur-md flex justify-between items-center z-10">
                    <div class="pg-toggle-wrap">
                        <button id="toggle-chat" class="pg-toggle-btn active" onclick="setPlaygroundModel('chat')">Chat Model</button>
                        <button id="toggle-followup" class="pg-toggle-btn" onclick="setPlaygroundModel('followup')">Follow-up Model</button>
                    </div>
                    
                    <div id="sim-status-badge" class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-wider border border-white">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#28A745] animate-pulse"></span>
                        Ready to test
                    </div>
                </div>

                <div id="playground-messages" class="pg-chat-scroll">
                    ${renderAiMessage("Engine initialized. Send a message as a Lead to test my responses.")}
                </div>

                <div class="pg-input-area z-10">
                    <div id="chat-input-view" class="pg-input-row">
                        <input type="text" id="pg-user-input" placeholder="Type a message as the customer..." class="pg-chat-input" onkeydown="if(event.key==='Enter') sendPlaygroundMessage()">
                        <button onclick="sendPlaygroundMessage()" class="w-12 h-12 rounded-2xl bg-[#28A745] text-white flex items-center justify-center shadow-lg shadow-[#28A745]/20 hover:scale-[1.05] active:scale-95 transition-all">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        </button>
                    </div>
                    
                    <div id="followup-button-view" class="hidden">
                        <div class="flex gap-3">
                            <div class="flex-1 relative">
                                <input type="text" placeholder="Search a lead by name or ID to load context..." class="pg-chat-input w-full">
                                <svg class="w-4 h-4 absolute right-4 top-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <button onclick="simulateFollowUp()" class="px-6 py-3 rounded-2xl bg-[#FF8C00] text-white font-bold text-sm shadow-lg shadow-[#FF8C00]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                Generate Follow-up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 5. Component Renderers
function renderAiMessage(text, timestamp = null) {
    const timeStr = timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return `
        <div class="pg-bubble-wrap out animate-in fade-in slide-in-from-right-4">
            <span class="pg-sender-label">AI Assistant</span>
            <div class="pg-bubble pg-bubble-ai">
                ${text}
            </div>
            <span class="text-[9px] text-slate-400 font-semibold mt-1 px-1">${timeStr}</span>
            
            <div class="pg-correction-actions">
                <button onclick="reinforceResponse(this, true)" class="pg-action-btn pg-btn-good" title="Good Response">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                </button>
                <button onclick="showCorrectionInput(this)" class="pg-action-btn pg-btn-bad" title="Needs Correction">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div class="correction-container w-full mt-2 flex justify-end"></div>
        </div>
    `;
}

function renderLeadMessage(text) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `
        <div class="pg-bubble-wrap in animate-in fade-in slide-in-from-left-4">
            <span class="pg-sender-label">Lead (You)</span>
            <div class="pg-bubble pg-bubble-lead">
                ${text}
            </div>
            <span class="text-[9px] text-slate-400 font-semibold mt-1 px-1">${timeStr}</span>
        </div>
    `;
}

// 6. Logic & Event Handlers
window.setBrainTab = (tabName) => {
    playgroundState.activeBrainTab = tabName;
    
    // Update Tab UI
    ['instructions', 'knowledge', 'scenarios'].forEach(tab => {
        document.getElementById(`tab-btn-${tab}`).classList.toggle('active', tab === tabName);
        document.getElementById(`tab-content-${tab}`).classList.toggle('active', tab === tabName);
    });
};

window.setPlaygroundModel = (model) => {
    playgroundState.currentModel = model;
    const isChat = model === 'chat';

    // Update Toggles
    document.getElementById('toggle-chat').classList.toggle('active', isChat);
    document.getElementById('toggle-followup').classList.toggle('active', !isChat);

    // Update Input Area
    document.getElementById('chat-input-view').classList.toggle('hidden', !isChat);
    document.getElementById('followup-button-view').classList.toggle('hidden', isChat);

    // Reset Chat
    const messages = document.getElementById('playground-messages');
    messages.innerHTML = renderAiMessage(isChat ? "Chat model loaded. Send a message to begin testing." : "Follow-up model loaded. Search a lead context, then generate a follow-up.");
};

window.applyScenario = () => {
    const scenarioInput = document.getElementById('scenario-input');
    const val = scenarioInput.value.trim();
    if(val) {
        playgroundState.isScenarioMode = true;
        playgroundState.activeScenario = val;
        
        // Update badge
        const badge = document.getElementById('sim-status-badge');
        badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-[#FF8C00] animate-pulse"></span> Lens: ${val}`;
        badge.classList.replace('bg-slate-100', 'bg-orange-50');
        badge.classList.replace('text-slate-500', 'text-[#FF8C00]');
        
        showPlaygroundToast(`Lens applied: ${val}`);
    }
};

window.sendPlaygroundMessage = () => {
    const input = document.getElementById('pg-user-input');
    const container = document.getElementById('playground-messages');
    const text = input.value.trim();
    
    if(!text) return;

    // Render User (Lead) Message
    container.innerHTML += renderLeadMessage(text);
    input.value = '';
    scrollToBottom(container);
    
    // Simulate AI Response
    setTimeout(() => {
        let responseText = "Understood. Searching knowledge base and crafting response...";
        if(playgroundState.isScenarioMode) {
            responseText = `[Viewing as: ${playgroundState.activeScenario}] Based on your input, here is how I would handle this specific customer state.`;
        }
        container.innerHTML += renderAiMessage(responseText);
        scrollToBottom(container);
    }, 800);
};

window.simulateFollowUp = () => {
    const container = document.getElementById('playground-messages');
    
    // Simulate lead context injection
    container.innerHTML += renderLeadMessage("I saw the pricing, but I need to consult with my team before deciding.");
    scrollToBottom(container);

    setTimeout(() => {
        const timeLabel = "Drafted for 9:00 AM Tomorrow";
        container.innerHTML += renderAiMessage("Hi! Just following up on our last chat. Did you have a chance to discuss the pricing with your team? Let me know if you need a formal PDF proposal to share with them.", timeLabel);
        scrollToBottom(container);
    }, 600);
};

window.showCorrectionInput = (btn) => {
    const parentContainer = btn.closest('.pg-bubble-wrap');
    const correctionTarget = parentContainer.querySelector('.correction-container');
    
    if(correctionTarget.querySelector('.pg-correction-box')) return;

    const div = document.createElement('div');
    div.className = "pg-correction-box flex items-center gap-2 animate-in slide-in-from-right-2 duration-300 bg-white/80 backdrop-blur-sm p-2 rounded-xl border border-red-200 shadow-sm";
    div.innerHTML = `
        <input type="text" placeholder="Type the ideal response..." class="text-xs px-3 py-2 rounded-lg bg-white border border-slate-200 outline-none w-64 focus:border-red-400 transition-colors text-[#0F172A]">
        <button onclick="reinforceResponse(this, false)" class="bg-[#0F172A] text-white text-[10px] px-4 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition-colors">SAVE</button>
        <button onclick="this.closest('.pg-correction-box').remove()" class="text-slate-400 hover:text-red-500 p-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
    `;
    correctionTarget.appendChild(div);
    div.querySelector('input').focus();
};

window.reinforceResponse = (el, isTick) => {
    if(!isTick) {
        const box = el.closest('.pg-correction-box');
        if(box) box.remove();
    }
    showPlaygroundToast("Response recorded to training log.");
};

window.savePlaygroundInstructions = () => {
    showPlaygroundToast("Instructions saved! Engine updated.");
};

// 7. Global Utilities
window.showPlaygroundToast = (msg) => {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white px-5 py-3 rounded-xl text-xs font-bold shadow-2xl z-[1000] border border-white/10 animate-in slide-in-from-bottom-5 duration-300 flex items-center gap-3`;
    toast.innerHTML = `<svg class="w-4 h-4 text-[#28A745]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg> ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.replace('animate-in', 'animate-out');
        toast.classList.add('fade-out', 'slide-out-to-bottom-5', 'duration-300');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
};

function scrollToBottom(el) {
    setTimeout(() => { el.scrollTop = el.scrollHeight; }, 50);
}

// 8. Page Switch Logic (Backward compatibility)
const originalSwitchPage = window.switchPage;
window.switchPage = function(page) {
    if (page === 'playground') {
        const config = PAGE_CONFIG[page];
        if (!config) return;

        // Nav update
        document.querySelectorAll('[id^="nav-"]').forEach(item => item.classList.remove('active'));
        const navItem = document.getElementById(config.navId);
        if (navItem) navItem.classList.add('active');
        
        // Header update
        if(document.getElementById('section-title')) document.getElementById('section-title').textContent = config.title;
        if(document.getElementById('section-description')) document.getElementById('section-description').textContent = config.description;
        if(document.getElementById('alpha-strip')) document.getElementById('alpha-strip').classList.add('hidden');
        
        if (typeof config.render === 'function') config.render();
    } else if (originalSwitchPage) {
        originalSwitchPage(page);
    }
};