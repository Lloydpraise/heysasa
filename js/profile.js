/**
 * Profile Management for HeySasa! Dashboard
 * Pulls and saves directly to public.businesses table
 */

// Expose globally so dashboard.html or navigation.js can trigger it
window.loadProfileData = async function(businessId) {
    const activeId = businessId || localStorage.getItem('business_id');
    if (!activeId) return;

    const sb = window.getSupabase ? window.getSupabase() : window.supabase;
    if (!sb) {
        displayDefaultUser();
        return;
    }

    try {
        // Fetch from the real businesses table
        const { data: business, error } = await sb
            .from('businesses')
            .select('name, owner_email')
            .eq('business_id', activeId)
            .maybeSingle();

        if (error) throw error;

        if (business) {
            const displayName = business.name || "Lloyd Praise";
            const displayEmail = business.owner_email || "lloydpraise@example.com";
            updateProfileUI(displayName, displayEmail);
        } else {
            displayDefaultUser();
        }

    } catch (err) {
        console.error('[Profile] Failed to load profile data from businesses table:', err);
        displayDefaultUser();
    }
};

// UI Render Helpers
function displayDefaultUser() {
    updateProfileUI("Lloyd Praise", "lloydpraise@example.com");
}

function updateProfileUI(name, email) {
    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    const initialsEl = document.getElementById('profile-initials');

    if (nameEl) nameEl.textContent = name;
    if (emailEl) emailEl.textContent = email;
    
    if (initialsEl) {
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        initialsEl.textContent = initials || 'LP';
    }
}

// Function to handle inline name changes from the dashboard layout
window.updateBusinessName = async function() {
    const activeId = localStorage.getItem('business_id');
    if (!activeId) return;

    const currentName = document.getElementById('profile-name')?.textContent || "";
    const newName = prompt("Enter new business name:", currentName);
    
    if (!newName || newName.trim() === "" || newName === currentName) return;

    const sb = window.getSupabase ? window.getSupabase() : window.supabase;
    if (!sb) {
        alert("Database connection offline.");
        return;
    }

    try {
        const { error } = await sb
            .from('businesses')
            .update({ name: newName.trim() })
            .eq('business_id', activeId);

        if (error) throw error;

        // Refresh elements across UI instantly
        window.loadProfileData(activeId);

    } catch (err) {
        alert("Failed to save name: " + err.message);
    }
};

// Wire up dropdown menus and modal triggers when DOM is interactive
document.addEventListener('DOMContentLoaded', () => {
    const profileTrigger = document.getElementById('profile-trigger');
    const profileMenu = document.getElementById('profile-menu');

    if (profileTrigger && profileMenu) {
        profileTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            profileMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!profileMenu.contains(e.target) && !profileTrigger.contains(e.target)) {
                profileMenu.classList.add('hidden');
            }
        });
    }

    // Run immediately if business_id is already cached on load
    const businessId = localStorage.getItem('business_id');
    if (businessId) {
        window.loadProfileData(businessId);
    }
});

/**
 * Change Password Logic (Connected to Supabase Auth)
 */
function openPasswordModal() {
    const modal = document.getElementById('password-modal');
    const menu = document.getElementById('profile-menu');
    
    if (modal) modal.classList.remove('hidden');
    if (menu) menu.classList.add('hidden');
}

function closePasswordModal() {
    const modal = document.getElementById('password-modal');
    if (modal) modal.classList.add('hidden');
}

async function submitPasswordChange() {
    const oldPass = document.getElementById('old-password').value;
    const newPass = document.getElementById('new-password').value;

    if (!oldPass || !newPass) {
        alert("Please enter both current and new passwords.");
        return;
    }

    if (newPass.length < 6) {
        alert("New password must be at least 6 characters.");
        return;
    }

    const sb = window.getSupabase ? window.getSupabase() : window.supabase;
    if (!sb) {
        alert("Database client connection error. Please refresh the page.");
        return;
    }

    try {
        const { error } = await sb.auth.updateUser({ password: newPass });
        if (error) throw error;

        closePasswordModal();

        const toast = document.getElementById('success-toast');
        if (toast) {
            toast.classList.remove('translate-y-20', 'opacity-0');
            setTimeout(() => {
                toast.classList.add('translate-y-20', 'opacity-0');
            }, 3000);
        }

        document.getElementById('old-password').value = "";
        document.getElementById('new-password').value = "";

    } catch (err) {
        alert("Failed to update password: " + err.message);
    }
}

/**
 * Logout Logic (Signs out session and breaks cache)
 */
async function handleLogout() {
    const sb = window.getSupabase ? window.getSupabase() : window.supabase;
    if (sb) {
        try {
            await sb.auth.signOut();
        } catch (err) {
            console.error("Logout session error:", err.message);
        }
    }
    window.location.href = 'login.html';
}