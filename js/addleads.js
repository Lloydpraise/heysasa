// addleads.js

function openAddLeadModal() {
    // Check if modal already exists to prevent duplicates
    let modal = document.getElementById('add-lead-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'add-lead-modal';
        // Tailwind classes for a full-screen semi-transparent overlay centered modal
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative m-4">
                <button onclick="closeAddLeadModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                
                <h2 class="text-xl font-bold text-gray-900 mb-6">Add New Lead</h2>
                
                <form id="add-lead-form" onsubmit="submitNewLead(event)" class="flex flex-col gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" id="new-lead-name" required placeholder="e.g. John Doe" 
                            class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                        <input type="text" id="new-lead-contact" required placeholder="Phone number" 
                            class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Product of Interest</label>
                        <input type="text" id="new-lead-product" required placeholder="e.g. Solar Inverter 5kW" 
                            class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all">
                    </div>
                    
                    <div class="mt-4 flex gap-3 justify-end">
                        <button type="button" onclick="closeAddLeadModal()" 
                            class="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold transition-all">
                            Cancel
                        </button>
                        <button type="submit" 
                            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all">
                            Save Lead
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Show the modal
    modal.classList.remove('hidden');
}

function closeAddLeadModal() {
    const modal = document.getElementById('add-lead-modal');
    if (modal) {
        modal.classList.add('hidden');
        // Clear the form fields upon closing
        document.getElementById('add-lead-form').reset();
    }
}

function submitNewLead(event) {
    event.preventDefault(); // Prevent page reload
    
    // Fetch values from the form
    const name = document.getElementById('new-lead-name').value;
    const contact = document.getElementById('new-lead-contact').value;
    const product = document.getElementById('new-lead-product').value;
    
    // Generate a new ID based on the highest existing ID in mockLeads
    const newId = mockLeads.length > 0 ? Math.max(...mockLeads.map(l => l.id)) + 1 : 1;
    
    // Construct the new lead object with default fallback values for complex fields
    const newLead = {
        id: newId,
        name: name,
        phone: contact,
        lead_quality: "Warm", // Defaulting manually added leads to warm
        conv_stage: "Initial Contact",
        cart_state: [product],
        customer_intent: "Manually entered lead. Pending initial follow-up.",
        next_action_plan: "Assign agent to reach out and qualify intent.",
        psychology: "Unknown",
        trust_markers: [],
        vibe_check: "Pending initial conversation.",
        transcript: []
    };
    
    // Add to the existing leads array
    mockLeads.push(newLead);
    
    // Close modal and reset form
    closeAddLeadModal();
    
    // Refresh the UI to display the new lead
    renderLeadsList();
}