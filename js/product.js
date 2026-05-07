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

function renderProductsPage() {
    const container = document.getElementById('content-area');
    
    container.innerHTML = `
        <div class="flex flex-col gap-6 w-full max-w-full overflow-x-hidden p-1">
            <!-- Header Actions: Designed for 75%+ Zoom Accessibility -->
            <div class="flex flex-wrap items-center justify-between gap-4">
                <!-- Tabs -->
                <div class="flex bg-gray-100 p-1 rounded-2xl w-fit shrink-0">
                    <button onclick="switchTab('added')" class="px-4 sm:px-6 py-2 rounded-xl text-xs font-bold transition-all ${currentTab === 'added' ? 'bg-white shadow-sm text-green-600' : 'text-gray-400'}">Added Products</button>
                    <button onclick="switchTab('discovered')" class="px-4 sm:px-6 py-2 rounded-xl text-xs font-bold transition-all ${currentTab === 'discovered' ? 'bg-white shadow-sm text-green-600' : 'text-gray-400'}">Discovered</button>
                </div>

                <!-- View Switcher & Add -->
                <div class="flex items-center gap-3 flex-wrap">
                    <div class="flex bg-white border border-gray-100 rounded-xl overflow-hidden mr-2">
                        <button onclick="switchView('list')" class="p-2 ${currentView === 'list' ? 'bg-gray-50 text-green-600' : 'text-gray-400'}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                        <button onclick="switchView('image')" class="p-2 ${currentView === 'image' ? 'bg-gray-50 text-green-600' : 'text-gray-400'}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path></svg>
                        </button>
                    </div>
                    <button class="bg-[#28A745] text-white px-5 py-2.5 rounded-full text-xs font-bold bouncy shadow-lg shadow-green-100 flex items-center gap-2 whitespace-nowrap">
                        <span>+ Add Product</span>
                    </button>
                </div>
            </div>

            <!-- Product Display Area -->
            <div id="products-grid-container" class="w-full">
                ${currentView === 'image' ? renderImageView() : renderListView()}
            </div>
        </div>
    `;
}

function switchTab(tab) {
    currentTab = tab;
    renderProductsPage();
}

function switchView(view) {
    currentView = view;
    renderProductsPage();
}

function renderImageView() {
    // Limits to 4 products only
    const filtered = mockProducts.filter(p => p.status === currentTab).slice(0, 4);
    
    return `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            ${filtered.map(p => `
                <div class="glass-panel rounded-3xl overflow-hidden group transition-all hover:shadow-2xl hover:shadow-gray-200/50 flex flex-col bg-white border border-gray-50">
                    <div class="relative h-52 w-full overflow-hidden bg-gray-100">
                        <img src="${p.img}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
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
    // Limits to 4 products only
    const filtered = mockProducts.filter(p => p.status === currentTab).slice(0, 4);
    
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
                                    <img src="${p.img}" class="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0">
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

document.addEventListener('DOMContentLoaded', renderProductsPage);