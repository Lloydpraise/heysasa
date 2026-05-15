/**
 * Profile Management for HeySasa! Dashboard
 * Identity: Lloyd Praise
 * Integration: window.getSupabase()
 */

document.addEventListener('DOMContentLoaded', async () => {
    const profileTrigger = document.getElementById('profile-trigger');
    const profileMenu = document.getElementById('profile-menu');

    /**
     * 1. Load & Display User Data
     * Note: Redirect is commented out for design purposes.
     */
    async function loadUserProfile() {
        const sb = window.getSupabase();
        
        if (!sb) {
            displayDefaultUser();
            return;
        }

        try {
            const { data: { user }, error } = await sb.auth.getUser();

            if (error || !user) {
                displayDefaultUser();
                return;
            }

            const fullName = user.user_metadata?.full_name || "Lloyd Praise";
            updateProfileUI(fullName, user.email);

        } catch (err) {
            displayDefaultUser();
        }
    }

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

    /**
     * 2. Robust Profile Menu Toggle
     */
    if (profileTrigger && profileMenu) {
        profileTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Stops background listener from closing it instantly
            
            profileMenu.classList.toggle('hidden');
        });

        // Close menu when clicking anywhere else on the page
        document.addEventListener('click', (e) => {
            if (!profileMenu.contains(e.target) && !profileTrigger.contains(e.target)) {
                profileMenu.classList.add('hidden');
            }
        });
    }

    loadUserProfile();
});

/**
 * 3. Change Password Logic (Mocked for Design)
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

    // Mock Success UI flow
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
}

/**
 * 4. Logout Logic
 */
async function handleLogout() {
    const sb = window.getSupabase();
    if (sb) {
        await sb.auth.signOut();
    }
    window.location.href = 'login.html';
}