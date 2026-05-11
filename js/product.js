// Mock Data (To be replaced by Supabase)
const mockProducts = [
    { id: 1, title: "Classic Green Hoodie", description: "Soft cotton blend, perfect for winter.", price: 2500, img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400", status: "added" },
    { id: 2, title: "Tech Runner Sneakers", description: "Lightweight and breathable fabric.", price: 4200, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", status: "discovered" },
    { id: 3, title: "Minimalist Watch", description: "Elegant design with leather strap.", price: 1800, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", status: "added" },
    { id: 4, title: "Wireless Noise-Canceling Earbuds", description: "Crystal clear sound with deep bass.", price: 6500, img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400", status: "added" },
    { id: 5, title: "Vintage Denim Jacket", description: "Classic retro wash, durable denim.", price: 3200, img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400", status: "discovered" },
    { id: 6, title: "Smart Home Speaker", description: "Voice-activated assistant with 360 audio.", price: 5500, img: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=400", status: "added" },
    { id: 7, title: "Premium Leather Backpack", description: "Spacious interior with laptop compartment.", price: 4800, img: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=400", status: "discovered" },
    { id: 8, title: "Polarized Aviator Sunglasses", description: "UV400 protection with metal frame.", price: 1500, img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400", status: "added" }
];

let currentTab = 'added'; // 'added' or 'discovered'
let currentView = 'image'; // 'image' or 'list'
let searchQuery = ''; // Search state
let imageObserver = null; // Intersection Observer for lazy loading

// Initialize Intersection Observer for lazy loading images
function initLazyLoadingObserver() {
    const observerOptions = {
        root: null, // viewport
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01 // Trigger when even 1% of image is visible
    };

    imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('lazy-loaded'); // Add class for fade-in animation
                    imageObserver.unobserve(img);
                }
            }
        });
    }, observerOptions);
}

// Apply lazy loading to all images with data-src attribute
function applyLazyLoading() {
    if (!imageObserver) {
        initLazyLoadingObserver();
    }
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

function renderProductsPage() {
    const container = document.getElementById('content-area');
    
    // Remove centering classes to ensure search bar stays at top
    container.classList.remove('items-center', 'justify-center');
    container.classList.add('flex-col', 'overflow-y-auto');
    
    container.innerHTML = `
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
                        placeholder="Search by title or description..." 
                        value="${searchQuery}"
                        oninput="handleSearch(this.value)"
                        class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                    >
                </div>

                <!-- Tabs -->
                <div class="flex bg-gray-100 p-1 rounded-2xl w-fit shrink-0">
                    <button onclick="switchTab('added')" class="px-4 sm:px-6 py-2 rounded-xl text-xs font-bold transition-all ${currentTab === 'added' ? 'bg-white shadow-sm text-green-600' : 'text-gray-400'}">Added Products</button>
                    <button onclick="switchTab('discovered')" class="px-4 sm:px-6 py-2 rounded-xl text-xs font-bold transition-all ${currentTab === 'discovered' ? 'bg-white shadow-sm text-green-600' : 'text-gray-400'}">Discovered</button>
                </div>

                <!-- View Switcher -->
                <div class="flex items-center gap-3 flex-wrap">
                    <div class="flex bg-white border border-gray-100 rounded-xl overflow-hidden">
                        <button onclick="switchView('list')" class="p-2 ${currentView === 'list' ? 'bg-gray-50 text-green-600' : 'text-gray-400'}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                        <button onclick="switchView('image')" class="p-2 ${currentView === 'image' ? 'bg-gray-50 text-green-600' : 'text-gray-400'}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path></svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Product Display Area -->
            <div id="products-grid-container" class="w-full">
                ${currentView === 'image' ? renderImageView() : renderListView()}
            </div>
        </div>
    `;
    
    // Initialize lazy loading for images after DOM is rendered
    requestAnimationFrame(() => {
        applyLazyLoading();
    });
}

// Logic for Search
function handleSearch(query) {
    searchQuery = query.toLowerCase();
    renderProductsPage();
}

function switchTab(tab) {
    currentTab = tab;
    renderProductsPage();
}

function switchView(view) {
    currentView = view;
    renderProductsPage();
}

// Helper to filter products based on tab and search query
function getFilteredProducts() {
    return mockProducts.filter(p => {
        const matchesTab = p.status === currentTab;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery) || 
                              p.description.toLowerCase().includes(searchQuery);
        return matchesTab && matchesSearch;
    });
}

function renderImageView() {
    const filtered = getFilteredProducts();
    
    if (filtered.length === 0) return `<p class="text-center text-gray-400 py-10">No products found.</p>`;

    return `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            ${filtered.map(p => `
                <div class="glass-panel rounded-3xl overflow-hidden group transition-all hover:shadow-2xl hover:shadow-gray-200/50 flex flex-col bg-white border border-gray-50">
                    <div class="relative h-52 w-full overflow-hidden bg-gray-100">
                        <!-- Lazy loaded image with fade-in animation -->
                        <img data-src="${p.img}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 208'%3E%3Crect fill='%23f3f4f6' width='400' height='208'/%3E%3C/svg%3E" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 lazy-image" style="opacity: 0.6;">
                        <div class="absolute top-3 right-3 z-10">
                            <button onclick="document.getElementById('menu-img-${p.id}').classList.toggle('hidden')" onblur="setTimeout(() => document.getElementById('menu-img-${p.id}').classList.add('hidden'), 200)" class="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors">
                                <span class="text-gray-800 font-bold">⋮</span>
                            </button>
                            <div id="menu-img-${p.id}" class="hidden absolute right-0 mt-2 w-28 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20">
                                <button class="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-gray-700 transition-colors">Edit</button>
                                <button class="w-full text-left px-4 py-2 text-xs hover:bg-red-50 text-red-600 border-t border-gray-50 transition-colors">Delete</button>
                            </div>
                        </div>
                    </div>
                    <div class="p-5 flex-1 flex flex-col justify-between">
                        <div class="flex flex-wrap justify-between items-start mb-3 gap-2">
                            <h3 class="font-bold text-gray-800 text-sm leading-snug flex-1 truncate">${p.title}</h3>
                            <span class="text-green-600 font-extrabold text-sm whitespace-nowrap">KSh ${p.price}</span>
                        </div>
                        <p class="text-xs text-gray-400 line-clamp-2 leading-relaxed">${p.description}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderListView() {
    const filtered = getFilteredProducts();

    if (filtered.length === 0) return `<p class="text-center text-gray-400 py-10">No products found.</p>`;
    
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
                        <tr class="hover:bg-gray-50/30 transition-colors">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-4">
                                    <img data-src="${p.img}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect fill='%23e5e7eb' width='48' height='48'/%3E%3C/svg%3E" alt="${p.title}" class="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0 lazy-image" style="opacity: 0.6;">
                                    <span class="font-bold text-sm text-gray-800 truncate max-w-[150px]">${p.title}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">${p.description}</td>
                            <td class="px-6 py-4 text-right">
                                <span class="font-bold text-green-600 text-sm whitespace-nowrap">KSh ${p.price}</span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <div class="relative inline-block text-left">
                                    <button onclick="document.getElementById('menu-list-${p.id}').classList.toggle('hidden')" onblur="setTimeout(() => document.getElementById('menu-list-${p.id}').classList.add('hidden'), 200)" class="text-gray-400 hover:text-gray-800 transition-colors font-bold text-xl px-2">⋮</button>
                                    <div id="menu-list-${p.id}" class="hidden absolute right-4 top-8 w-28 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20">
                                        <button class="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-gray-700 transition-colors">Edit</button>
                                        <button class="w-full text-left px-4 py-2 text-xs hover:bg-red-50 text-red-600 border-t border-gray-50 transition-colors">Delete</button>
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
