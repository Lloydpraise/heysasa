/**
 * addproducts.js — The Unified Approval Studio (Self-Contained)
 * --------------------------------------------------------
 * This file injects its own HTML into the dashboard, fetches products 
 * with status='discovered', allows rapid inline editing via a 
 * card grid, and bulk-upserts them to status='approved'.
 */

import { supabase } from './supabaseClient.js'; 

// --- GLOBAL STATE ---
let currentProducts = [];
let businessId = localStorage.getItem('business_id') || ''; 

// --- DOM ELEMENT REFERENCES (Populated dynamically) ---
let gridContainer = null;
let bulkSaveBtn   = null;
let loadingState  = null;
let emptyState    = null;

/**
 * Initialize the Studio.
 * @param {string} targetContainerId - The ID of the div in dashboard.html where this view should load.
 * @param {Array} preloadedProducts - Optional array of products if redirecting from manual upload.
 */
export async function initApprovalStudio(targetContainerId = 'main-content', preloadedProducts = null) {
    if (!businessId) {
        console.error("No Business ID found in local storage.");
        return;
    }

    const targetContainer = document.getElementById(targetContainerId);
    if (!targetContainer) {
        console.error(`[ApprovalStudio] Target container #${targetContainerId} not found in dashboard.html`);
        return;
    }

    // 1. Inject the HTML Skeleton
    injectHTMLSkeleton(targetContainer);

    // 2. Grab the newly created DOM elements
    gridContainer = document.getElementById('approval-grid');
    bulkSaveBtn   = document.getElementById('bulk-save-btn');
    loadingState  = document.getElementById('loading-state');
    emptyState    = document.getElementById('empty-state');

    // 3. Attach the main button listener immediately
    bulkSaveBtn.addEventListener('click', bulkApproveAndSave);

    // 4. Fetch and Render
    showLoading(true);
    if (preloadedProducts && preloadedProducts.length > 0) {
        currentProducts = preloadedProducts;
    } else {
        currentProducts = await fetchDiscoveredProducts();
    }
    showLoading(false);
    renderGrid();
}

/**
 * Builds the UI shell dynamically
 */
function injectHTMLSkeleton(container) {
    container.innerHTML = `
        <div class="approval-studio-wrapper relative min-h-screen pb-24 animate-fade-in">
            <div class="mb-8">
                <h2 class="text-2xl font-extrabold text-gray-900">Product Approval Studio ✨</h2>
                <p class="text-gray-500 text-sm mt-1">Review, price, and publish discovered products to your AI agent.</p>
            </div>

            <div id="loading-state" class="flex flex-col items-center justify-center py-20" style="display: none;">
                <svg class="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="text-gray-500 font-medium">Loading discovered items...</p>
            </div>

            <div id="empty-state" class="flex flex-col items-center justify-center py-20" style="display: none;">
                <div class="bg-gray-50 rounded-full p-6 mb-4">
                    <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900">You're all caught up!</h3>
                <p class="text-gray-500 text-sm mt-1">No new products waiting for approval.</p>
            </div>

            <div id="approval-grid" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"></div>

            <div class="fixed bottom-8 right-8 z-50">
                <button id="bulk-save-btn" style="display: none;" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-2xl transform transition hover:-translate-y-1 text-lg flex items-center gap-2">
                    🚀 Approve & Publish All
                </button>
            </div>
        </div>
    `;
}

/**
 * Fetch all products waiting for approval from the database
 */
async function fetchDiscoveredProducts() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('business_id', businessId)
            .eq('status', 'discovered')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error('[ApprovalStudio] Error fetching discovered products:', err);
        alert('Could not load products for approval. Check console for details.');
        return [];
    }
}

/**
 * Render the sleek card grid for rapid bulk editing
 */
function renderGrid() {
    if (currentProducts.length === 0) {
        gridContainer.innerHTML = '';
        emptyState.style.display = 'flex';
        bulkSaveBtn.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    bulkSaveBtn.style.display = 'flex';
    bulkSaveBtn.innerHTML = `🚀 Approve & Publish ${currentProducts.length} Items`;
    
    gridContainer.innerHTML = '';

    currentProducts.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all flex flex-col relative';
        
        const imageUrl = (product.images && product.images.length > 0) 
            ? product.images[0] 
            : 'https://via.placeholder.com/300x200?text=No+Image';

        card.innerHTML = `
            <div class="relative h-48 bg-gray-50 border-b border-gray-100 group">
                <img src="${imageUrl}" class="w-full h-full object-cover" alt="Product Image" />
                <div class="absolute top-3 right-3 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur-sm bg-opacity-90">
                    Discovered ✨
                </div>
            </div>

            <div class="p-5 flex-grow flex flex-col gap-4">
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Product Title</label>
                    <input type="text" data-index="${index}" data-field="title" value="${product.title || ''}" 
                        class="w-full text-base font-semibold border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-2 px-3 bg-gray-50 hover:bg-white transition-colors" 
                        placeholder="E.g. Luxury Leather Watch" />
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Price</label>
                        <input type="number" data-index="${index}" data-field="price" value="${product.price || ''}" 
                            class="w-full text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 py-2 px-3 bg-gray-50 hover:bg-white transition-colors" 
                            placeholder="0.00" />
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Category</label>
                        <input type="text" data-index="${index}" data-field="product_type" value="${product.product_type || ''}" 
                            class="w-full text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 py-2 px-3 bg-gray-50 hover:bg-white transition-colors" 
                            placeholder="E.g. Electronics" />
                    </div>
                </div>

                <div class="flex-grow">
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Short Description</label>
                    <textarea data-index="${index}" data-field="description_short" rows="3" 
                        class="w-full text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 py-2 px-3 bg-gray-50 hover:bg-white transition-colors resize-none" 
                        placeholder="Describe the product...">${product.description_short || ''}</textarea>
                </div>
            </div>

            <div class="px-5 pb-5 pt-2 flex justify-between items-center border-t border-gray-50 mt-auto">
                <span class="text-xs text-gray-400 font-mono">ID: ${product.handle || 'auto'}</span>
                <button class="remove-btn text-red-500 hover:bg-red-50 text-sm font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1" data-index="${index}">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    Discard
                </button>
            </div>
        `;
        gridContainer.appendChild(card);
    });

    // Attach seamless live-edit listeners
    gridContainer.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', handleInputChange);
    });

    // Attach discard listeners
    gridContainer.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', handleDiscard);
    });
}

/**
 * Fires every time a user types, updating the state array instantly
 */
function handleInputChange(e) {
    const index = e.target.dataset.index;
    const field = e.target.dataset.field;
    currentProducts[index][field] = e.target.value;
}

/**
 * Discards a product from the grid (Also deletes from DB to keep it clean)
 */
async function handleDiscard(e) {
    const index = e.target.dataset.index;
    const product = currentProducts[index];
    
    const confirmDiscard = confirm("Discard this product? This cannot be undone.");
    if (!confirmDiscard) return;
    
    // Attempt DB Deletion for cleanliness
    if (product.id) {
        try {
            await supabase.from('products').delete().eq('id', product.id);
        } catch (err) {
            console.warn("Could not delete from DB instantly, removing from UI only.", err);
        }
    }

    currentProducts.splice(index, 1);
    renderGrid();
}

/**
 * THE BIG BUTTON: Bulk updates all cards to 'approved' and triggers vectorization
 */
async function bulkApproveAndSave() {
    if (currentProducts.length === 0) return;

    // UI Feedback
    bulkSaveBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Publishing ${currentProducts.length} items...
    `;
    bulkSaveBtn.disabled = true;
    bulkSaveBtn.classList.add('opacity-75', 'cursor-not-allowed');

    try {
        // 1. Prepare the payload
        const updates = currentProducts.map(p => ({
            ...p,
            price: parseFloat(p.price) || 0,
            status: 'approved',           // CRITICAL: Moves it out of the studio
            is_visible: true,
            needs_polish: false,
            updated_at: new Date().toISOString()
        }));

        // 2. Upsert to Supabase
        const { error } = await supabase
            .from('products')
            .upsert(updates, { onConflict: 'id' });

        if (error) throw error;

        // 3. Trigger the Vectorization / Approval Webhook
        fetch('https://your-backend-url.com/products/vectorize-approved', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ business_id: businessId }) 
        }).catch(err => console.warn('Vectorization trigger delayed:', err));

        // 4. Success UI
        alert(`🎉 Success! ${currentProducts.length} products have been published.`);
        
        currentProducts = [];
        renderGrid();

    } catch (err) {
        console.error('[ApprovalStudio] Bulk save failed:', err);
        alert('Something went wrong while saving. Please try again.');
    } finally {
        // Reset button
        if (bulkSaveBtn) {
            bulkSaveBtn.innerHTML = `🚀 Approve & Publish All`;
            bulkSaveBtn.disabled = false;
            bulkSaveBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    }
}

/**
 * Utility to toggle UI states
 */
function showLoading(show) {
    if (loadingState) loadingState.style.display = show ? 'flex' : 'none';
    if (show) {
        if (gridContainer) gridContainer.innerHTML = '';
        if (emptyState) emptyState.style.display = 'none';
        if (bulkSaveBtn) bulkSaveBtn.style.display = 'none';
    }
}