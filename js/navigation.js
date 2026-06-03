/**
 * Navigation System for HeySasa! Dashboard
 * Handles sidebar navigation and page switching
 */

window.PAGE_CONFIG = {
    overview: {
        title: 'Overview',
        description: 'A high-level view of your system operations.',
        navId: 'nav-overview',
        renderKey: 'renderOverview'
    },
    analytics: {
        title: 'Analytics',
        description: 'Overview of your business performance.',
        navId: 'nav-analytics',
        renderKey: 'renderAnalytics' // Will pull live from analytics.js
    },
    leads: {
        title: 'Leads',
        description: 'Manage and track all your leads.',
        navId: 'nav-leads',
        renderKey: 'renderLeadsContent'
    },
    products: {
        title: 'Products',
        description: 'Manage your product catalog.',
        navId: 'nav-products',
        renderKey: 'renderProducts'
    },
    preferences: {
        title: 'Preferences',
        description: 'Manage your account configurations and preferences.',
        navId: 'nav-preferences',
        renderKey: 'renderPreferences'
    }
};

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

window.switchPage = function(page) {
    const config = window.PAGE_CONFIG[page];
    
    if (!config) {
        console.error(`Page ${page} not found in PAGE_CONFIG`);
        return;
    }

    document.querySelectorAll('[id^="nav-"]').forEach(item => {
        item.classList.remove('active');
    });
    
    const navItem = document.getElementById(config.navId);
    if (navItem) {
        navItem.classList.add('active');
    }

    const sectionTitle = document.getElementById('section-title');
    const sectionDescription = document.getElementById('section-description');
    
    if (sectionTitle) sectionTitle.textContent = config.title;
    if (sectionDescription) sectionDescription.textContent = config.description;

    showSectionLoader();

    if (pageLoadTimer) {
        clearTimeout(pageLoadTimer);
        pageLoadTimer = null;
    }

    pageLoadTimer = setTimeout(async () => {
        try {
            const targetRenderFunction = window[config.renderKey];
            if (targetRenderFunction && typeof targetRenderFunction === 'function') {
                await targetRenderFunction();
            } else {
                // Fallback UI if the page script isn't loaded yet
                document.getElementById('content-area').innerHTML = `
                    <div class="p-8 text-center text-gray-500">
                        Loading live interface elements...
                    </div>`;
            }
        } catch (error) {
            console.error(`Error rendering view for section [${page}]:`, error);
        }
        hideSectionLoader();
        pageLoadTimer = null;
    }, 200);
};

document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('[id^="nav-"]');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const pageName = item.id.replace('nav-', '');
            window.switchPage(pageName);
        });
    });

    window.switchPage('overview');
});