// ─── Live Data State ──────────────────────────────────────────────────────────
let products      = [];
let isInitialized = false;
let isLoading     = false;

let currentTab  = 'added';  // 'added' | 'discovered'
let currentView = 'image';  // 'image' | 'list'
let searchQuery = '';

let imageObserver = null;
let cardObserver  = null;

// ─── Intersection Observer: lazy image loading ────────────────────────────────
function initLazyLoadingObserver() {
    imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('lazy-loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    }, { root: null, rootMargin: '50px', threshold: 0.01 });
}

// ─── Intersection Observer: staggered card scroll animations ─────────────────
function initCardAnimationObserver() {
    cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('card-visible');
                cardObserver.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px 0px -40px 0px', threshold: 0.1 });
}

function applyLazyLoading() {
    if (!imageObserver) initLazyLoadingObserver();
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

function applyCardAnimations() {
    if (!cardObserver) initCardAnimationObserver();
    document.querySelectorAll('.animate-card').forEach(card => cardObserver.observe(card));
}

// ─── Main render ──────────────────────────────────────────────────────────────
async function renderProductsPage(businessId) {
    const container = document.getElementById('content-area');
    container.classList.remove('items-center', 'justify-center');
    container.classList.add('flex-col', 'overflow-y-auto');

    const activeId = businessId || window.getActiveBusinessId?.();

    // ── Fetch from DB once per page session (not on every search/tab toggle) ──
    if (!isInitialized && !isLoading) {
        isLoading = true;

        container.innerHTML = `
            <div class="flex items-center justify-center py-20 text-gray-400 font-medium text-sm">
                <svg class="animate-spin h-5 w-5 mr-3 text-green-600" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading product catalog...
            </div>`;

        if (!window.productService) {
            console.error('[Products] productService not found. Ensure product-service.js is loaded.');
            container.innerHTML = `
                <div class="flex items-center justify-center py-20 text-red-400 text-sm font-medium">
                    Product service unavailable. Check console for details.
                </div>`;
            isLoading = false;
            return;
        }

        const response = await window.productService.fetchProducts(activeId);
        if (response.success) {
            products      = response.data;
            isInitialized = true;
        } else {
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center py-20 gap-4 text-center">
                    <div class="text-3xl">⚠️</div>
                    <div class="text-sm font-bold text-gray-700">Failed to load products</div>
                    <div class="text-xs text-gray-400 max-w-xs">${response.error || 'Unknown error'}</div>
                    <button onclick="renderProductsPage()" class="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl mt-2">Retry</button>
                </div>`;
            isLoading = false;
            return;
        }

        isLoading = false;
    }

    // ── Inject scroll-animation styles once ───────────────────────────────────
    if (!document.getElementById('staggered-scroll-styles')) {
        const style = document.createElement('style');
        style.id = 'staggered-scroll-styles';
        style.innerHTML = `
            .animate-card { opacity: 0; transform: translateY(40px); transition: opacity 0.5s ease-out, transform 0.5s ease-out !important; }
            .animate-card .anim-desc { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease-out 0.3s, transform 0.5s ease-out 0.3s !important; }
            .animate-card .anim-img { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease-out 0.6s, transform 0.5s ease-out 0.6s !important; }
            .animate-card.card-visible { opacity: 1; transform: translateY(0); }
            .animate-card.card-visible .anim-desc { opacity: 1; transform: translateY(0); }
            .animate-card.card-visible .anim-img { opacity: 1; transform: translateY(0); }
        `;
        document.head.appendChild(style);
    }

    container.innerHTML = `
        <div class="flex flex-col gap-6 w-full max-w-full overflow-x-hidden p-1">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="relative flex-1 min-w-[280px]">
                    <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Search by title or description..."
                        value="${searchQuery}"
                        oninput="window.handleSearch(this.value)"
                        class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                    >
                </div>

                <div class="flex bg-gray-100 p-1 rounded-2xl w-fit shrink-0">
                    <button onclick="window.switchTab('added')"      class="px-4 sm:px-6 py-2 rounded-xl text-xs font-bold transition-all ${currentTab === 'added'      ? 'bg-white shadow-sm text-green-600' : 'text-gray-400'}">Added Products</button>
                    <button onclick="window.switchTab('discovered')" class="px-4 sm:px-6 py-2 rounded-xl text-xs font-bold transition-all ${currentTab === 'discovered' ? 'bg-white shadow-sm text-green-600' : 'text-gray-400'}">Discovered</button>
                </div>

                <div class="flex items-center gap-3 flex-wrap">
                    <div class="flex bg-white border border-gray-100 rounded-xl overflow-hidden">
                        <button onclick="window.switchView('list')" class="p-2 ${currentView === 'list'  ? 'bg-gray-50 text-green-600' : 'text-gray-400'}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                        <button onclick="window.switchView('image')" class="p-2 ${currentView === 'image' ? 'bg-gray-50 text-green-600' : 'text-gray-400'}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path></svg>
                        </button>
                    </div>
                    <button onclick="toggleImporterModal()" class="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        Add Product
                    </button>
                </div>
            </div>

            <div id="products-grid-container" class="w-full">
                ${currentView === 'image' ? renderImageView() : renderListView()}
            </div>
        </div>
    `;

    requestAnimationFrame(() => {
        applyLazyLoading();
        applyCardAnimations();
    });
}

// ─── Search & Tab/View toggles (re-render UI only, no DB call) ────────────────
function handleSearch(query) {
    searchQuery = query.toLowerCase();
    const gridContainer = document.getElementById('products-grid-container');
    if (gridContainer) {
        gridContainer.innerHTML = currentView === 'image' ? renderImageView() : renderListView();
        requestAnimationFrame(() => {
            applyLazyLoading();
            applyCardAnimations();
        });
    }
}

function switchTab(tab) {
    currentTab = tab;
    renderProductsPage();
}

function switchView(view) {
    currentView = view;
    renderProductsPage();
}

// ─── Delete ───────────────────────────────────────────────────────────────────
async function handleDeleteProduct(productId) {
    if (!confirm('Are you sure you want to permanently delete this product?')) return;

    const response = await window.productService.deleteProduct(productId);
    if (response.success) {
        products = products.filter(p => p.id !== productId);
        renderProductsPage();
    } else {
        alert('Error deleting product: ' + response.error);
    }
}

// ─── Filter helper ────────────────────────────────────────────────────────────
function getFilteredProducts() {
    return products.filter(p => {
        const matchesTab    = p.status === currentTab;
        const matchesSearch = !searchQuery ||
            p.title.toLowerCase().includes(searchQuery) ||
            p.description.toLowerCase().includes(searchQuery);
        return matchesTab && matchesSearch;
    });
}

// ─── Empty state helper ───────────────────────────────────────────────────────
function renderEmptyState() {
    const isSearch = searchQuery.length > 0;
    return `
        <div class="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div class="text-4xl">${isSearch ? '🔍' : currentTab === 'added' ? '📦' : '🤖'}</div>
            <div class="text-sm font-bold text-gray-700">
                ${isSearch
                    ? `No results for "${searchQuery}"`
                    : currentTab === 'added'
                        ? 'No products added yet'
                        : 'No discovered products yet'}
            </div>
            <div class="text-xs text-gray-400 max-w-xs leading-relaxed">
                ${isSearch
                    ? 'Try a different search term.'
                    : currentTab === 'added'
                        ? 'Click "Add Product" to add your first product to the catalog.'
                        : 'Products shared in WhatsApp conversations will appear here automatically.'}
            </div>
        </div>
    `;
}

// ─── Image grid view ──────────────────────────────────────────────────────────
function renderImageView() {
    const filtered = getFilteredProducts();
    if (filtered.length === 0) return renderEmptyState();

    return `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            ${filtered.map(p => `
                <div data-sort-name="${p.title}" class="animate-card glass-panel rounded-3xl overflow-hidden group hover:shadow-2xl hover:shadow-gray-200/50 flex flex-col bg-white border border-gray-50">
                    <div class="anim-img relative h-52 w-full overflow-hidden bg-gray-100">
                        <img
                            data-src="${p.img}"
                            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 208'%3E%3Crect fill='%23f3f4f6' width='400' height='208'/%3E%3C/svg%3E"
                            alt="${p.title}"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 lazy-image"
                            style="opacity:0.6;"
                        >
                        <div class="absolute top-3 right-3 z-10">
                            <button
                                onclick="document.getElementById('menu-img-${p.id}').classList.toggle('hidden')"
                                onblur="setTimeout(() => document.getElementById('menu-img-${p.id}').classList.add('hidden'), 200)"
                                class="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                            >
                                <span class="text-gray-800 font-bold">⋮</span>
                            </button>
                            <div id="menu-img-${p.id}" class="hidden absolute right-0 mt-2 w-28 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20">
                                <button class="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-gray-700 transition-colors">Edit</button>
                                <button onclick="window.handleDeleteProduct('${p.id}')" class="w-full text-left px-4 py-2 text-xs hover:bg-red-50 text-red-600 border-t border-gray-50 transition-colors">Delete</button>
                            </div>
                        </div>
                    </div>
                    <div class="p-5 flex-1 flex flex-col justify-between">
                        <div class="flex flex-wrap justify-between items-start mb-3 gap-2">
                            <h3 class="font-bold text-gray-800 text-sm leading-snug flex-1 truncate">${p.title}</h3>
                            <span class="text-green-600 font-extrabold text-sm whitespace-nowrap">KSh ${p.price}</span>
                        </div>
                        <p class="anim-desc text-xs text-gray-400 line-clamp-2 leading-relaxed">${p.description}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ─── List / table view ────────────────────────────────────────────────────────
function renderListView() {
    const filtered = getFilteredProducts();
    if (filtered.length === 0) return renderEmptyState();

    return `
        <div class="glass-panel rounded-3xl overflow-x-auto border border-gray-100 bg-white">
            <table class="w-full text-left min-w-[600px]">
                <thead class="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                        <th class="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Product</th>
                        <th class="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Description</th>
                        <th class="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400 text-right">Price</th>
                        <th class="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    ${filtered.map(p => `
                        <tr data-sort-name="${p.title}" class="animate-card hover:bg-gray-50/30 transition-colors">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-4">
                                    <div class="anim-img shrink-0">
                                        <img
                                            data-src="${p.img}"
                                            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect fill='%23e5e7eb' width='48' height='48'/%3E%3C/svg%3E"
                                            alt="${p.title}"
                                            class="w-12 h-12 rounded-xl object-cover shadow-sm lazy-image"
                                            style="opacity:0.6;"
                                        >
                                    </div>
                                    <span class="font-bold text-sm text-gray-800 truncate max-w-[150px]">${p.title}</span>
                                </div>
                            </td>
                            <td class="anim-desc px-6 py-4 text-xs text-gray-500 max-w-xs truncate">${p.description}</td>
                            <td class="px-6 py-4 text-right">
                                <span class="font-bold text-green-600 text-sm whitespace-nowrap">KSh ${p.price}</span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <div class="relative inline-block text-left">
                                    <button
                                        onclick="document.getElementById('menu-list-${p.id}').classList.toggle('hidden')"
                                        onblur="setTimeout(() => document.getElementById('menu-list-${p.id}').classList.add('hidden'), 200)"
                                        class="text-gray-400 hover:text-gray-800 transition-colors font-bold text-xl px-2"
                                    >⋮</button>
                                    <div id="menu-list-${p.id}" class="hidden absolute right-4 top-8 w-28 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20">
                                        <button class="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-gray-700 transition-colors">Edit</button>
                                        <button onclick="window.handleDeleteProduct('${p.id}')" class="w-full text-left px-4 py-2 text-xs hover:bg-red-50 text-red-600 border-t border-gray-50 transition-colors">Delete</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ─── Expose onclick handlers to global scope ──────────────────────────────────
window.handleSearch        = handleSearch;
window.switchTab           = switchTab;
window.switchView          = switchView;
window.handleDeleteProduct = handleDeleteProduct;

// ─── Self-register with nav ───────────────────────────────────────────────────
if (typeof PAGE_CONFIG !== 'undefined') {
    PAGE_CONFIG.products = {
        title:       'Products',
        description: 'Manage your product catalog.',
        navId:       'nav-products',
        render: function(passedBusinessId) {
            const activeId = passedBusinessId || localStorage.getItem('business_id');
            if (activeId) {
                renderProductsPage(activeId);
            } else {
                console.error('[Products Error] No business ID available.');
            }
        }
    };
}