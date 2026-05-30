/**
 * Navigation System for HeySasa! Dashboard
 * Handles sidebar navigation and page switching
 */

// Global page configuration (will be extended by individual page scripts)
window.PAGE_CONFIG = {
    overview: {
        title: 'Overview',
        description: 'A high-level view of your system operations.',
        navId: 'nav-overview',
        render: window.renderOverview // Pulls from overview.js
    },
    analytics: {
        title: 'Analytics',
        description: 'Overview of your business performance.',
        navId: 'nav-analytics',
        render: renderAnalytics
    },
    leads: {
        title: 'Leads',
        description: 'Manage and track all your leads.',
        navId: 'nav-leads'
    },
    products: {
        title: 'Products',
        description: 'Manage your product catalog.',
        navId: 'nav-products'
    }
};

// Analytics placeholder render function
function renderAnalytics() {
    const contentArea = document.getElementById('content-area');
    contentArea.className = 'absolute inset-0 p-8 flex items-center justify-center opacity-100 pointer-events-auto transition-opacity duration-700';
    
    contentArea.innerHTML = `
        <div class="glass-card p-10 text-center max-w-md w-full shadow-2xl">
            <div class="w-16 h-16 bg-[#28A745]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg class="w-8 h-8 text-[#28A745]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <h3 class="text-xl font-bold text-[#0F172A] mb-2">Analytics Dashboard</h3>
            <p class="text-sm text-[#64748B] leading-relaxed">Your analytics data will be visualized here.</p>
        </div>
    `;
}

let pageLoadTimer = null;

function showSectionLoader() {
    const skeleton = document.getElementById('skeleton-loader');
    const contentArea = document.getElementById('content-area');
    if (skeleton) skeleton.style.display = 'block';
    if (contentArea) {
        contentArea.classList.add('opacity-0', 'pointer-events-none');
    }
}

function hideSectionLoader() {
    const skeleton = document.getElementById('skeleton-loader');
    const contentArea = document.getElementById('content-area');
    if (skeleton) skeleton.style.display = 'none';
    if (contentArea) {
        contentArea.classList.remove('opacity-0', 'pointer-events-none');
    }
}

// Switch page function
window.switchPage = function(page) {
    const config = PAGE_CONFIG[page];
    
    if (!config) {
        console.error(`Page ${page} not found in PAGE_CONFIG`);
        return;
    }

    // Update navigation UI
    document.querySelectorAll('[id^="nav-"]').forEach(item => {
        item.classList.remove('active');
    });
    
    const navItem = document.getElementById(config.navId);
    if (navItem) {
        navItem.classList.add('active');
    }

    // Update header
    const sectionTitle = document.getElementById('section-title');
    const sectionDescription = document.getElementById('section-description');
    
    if (sectionTitle) sectionTitle.textContent = config.title;
    if (sectionDescription) sectionDescription.textContent = config.description;

    // Show loader for every navigation switch
    showSectionLoader();

    if (pageLoadTimer) {
        clearTimeout(pageLoadTimer);
        pageLoadTimer = null;
    }

    pageLoadTimer = setTimeout(() => {
        if (config.render && typeof config.render === 'function') {
            config.render();
        }
        hideSectionLoader();
        pageLoadTimer = null;
    }, 300);
};

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', () => {
    // Get all navigation items
    const navItems = document.querySelectorAll('[id^="nav-"]');
    
    // Attach click listeners to each nav item
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Extract page name from element ID (e.g., "nav-analytics" -> "analytics")
            const pageName = item.id.replace('nav-', '');
            switchPage(pageName);
        });
    });

    // Set initial page to analytics
    switchPage('overview');
});
