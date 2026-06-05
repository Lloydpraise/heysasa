/**
 * overviewRouter.js — HeySasa! Overview Router
 *
 * Routes the overview page based on onboarding completion status.
 * Decides whether to show onboarding wizard or main dashboard.
 *
 * Registration priority:
 *   1. This file registers PAGE_CONFIG.overview as the authoritative handler
 *   2. On render, checks window.onboardingData.onboarding_complete
 *   3. If false → calls window._renderOnboarding (from onboarding.js)
 *   4. If true → calls window._renderDashboard (from overview.js)
 *
 * Flow:
 *   - navigation.js calls PAGE_CONFIG.overview.render(businessId)
 *   - This router decides based on onboarding status
 *   - One of the render functions populates #content-area
 */

(function () {
    'use strict';

    function getBusinessId() {
        return localStorage.getItem('business_id');
    }

    async function routeOverview(businessId) {
        const data = window.onboardingData || {};
        const isComplete = data.onboarding_complete === true;

        console.log('[OverviewRouter] Routing overview. businessId:', businessId,
                    '| onboardingDataLoaded:', !!window.onboardingData,
                    '| onboarding_complete:', isComplete,
                    '| current_step:', data.current_step);

        if (!isComplete) {
            // Route to onboarding wizard
            if (typeof window._renderOnboarding === 'function') {
                console.log('[OverviewRouter] Calling _renderOnboarding...');
                await window._renderOnboarding(businessId);
            } else {
                console.error('[OverviewRouter] Onboarding render function not available.');
                throw new Error('Onboarding module not loaded');
            }
        } else {
            // Route to dashboard
            if (typeof window._renderDashboard === 'function') {
                console.log('[OverviewRouter] Calling _renderDashboard...');
                await window._renderDashboard(businessId);
            } else {
                console.error('[OverviewRouter] Dashboard render function not available.');
                throw new Error('Dashboard module not loaded');
            }
        }
    }

    // Register as the single overview page handler
    if (typeof window.PAGE_CONFIG !== 'undefined') {
        window.PAGE_CONFIG.overview = {
            title:       'Dashboard',
            description: '',
            navId:       'nav-overview',
            render: async function (passedBusinessId) {
                const activeId = passedBusinessId || getBusinessId();
                await routeOverview(activeId);
            },
        };
        console.log('[OverviewRouter] Registered as PAGE_CONFIG.overview.');
    } else {
        console.error('[OverviewRouter] PAGE_CONFIG not found — navigation.js may not have loaded.');
    }
})();
