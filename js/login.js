// --- 1. CONFIGURATION ---
const screenLogin = document.getElementById('screen-login');
const screenOtp = document.getElementById('screen-otp');
const otpBoxes = document.querySelectorAll('.otp-box');
let tempEmail = ''; // Stores email between password and OTP steps

// --- 2. AUTH LOGIC ---

// Handle the Initial Login Form (Email + Password)
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('btn-login');

    // Visual feedback
    btn.innerText = "Verifying...";
    btn.disabled = true;

    // STEP 1: Verify Password
    const loginResult = await authManager.signInWithPassword(email, password);
    
    if (!loginResult.success) {
        notify(loginResult.error.message);
        btn.innerText = "Sign In";
        btn.disabled = false;
        return;
    }

    // STEP 2: Password is correct, now trigger the OTP challenge
    tempEmail = email; 
    const otpResult = await authManager.signInWithOtp(tempEmail);

    if (!otpResult.success) {
        notify("Password correct, but could not send code: " + otpResult.error.message);
        btn.innerText = "Sign In";
        btn.disabled = false;
    } else {
        // STEP 3: Switch to the OTP screen
        document.getElementById('display-email').textContent = tempEmail;
        toggleScreens(true);
        notify("Credentials accepted. Please enter your verification code.", false);
    }
});

// Handle OTP Verification
document.getElementById('otp-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-verify');
    let token = '';
    otpBoxes.forEach(b => token += b.value);

    if (token.length < 6) return notify("Please enter the full 6-digit code");

    btn.innerText = "Authenticating...";

    const result = await authManager.verifyOtp(tempEmail, token, 'email');
    
    if (!result.success) {
        notify("Invalid code. Please try again.");
        btn.innerText = "Verify & Sign In";
        otpBoxes.forEach(b => b.value = '');
        otpBoxes[0].focus();
    } else {
        notify("Identity verified!", false);
        window.location.href = '/dashboard'; 
    }
});

// --- 3. UI HELPERS ---

function notify(msg, err = true) {
    const t = document.getElementById('toast');
    document.getElementById('toast-message').textContent = msg;
    t.style.backgroundColor = err ? '#ef4444' : '#28A745';
    t.classList.remove('translate-y-[-150%]');
    setTimeout(() => t.classList.add('translate-y-[-150%]'), 4000);
}

function toggleScreens(toOtp) {
    if (toOtp) {
        screenLogin.classList.replace('fade-show', 'fade-hide');
        setTimeout(() => {
            screenLogin.style.display = 'none';
            screenOtp.style.display = 'block';
            screenOtp.classList.replace('fade-hide', 'fade-show');
            otpBoxes[0].focus();
        }, 400);
    } else {
        screenOtp.classList.replace('fade-show', 'fade-hide');
        setTimeout(() => {
            screenOtp.style.display = 'none';
            screenLogin.style.display = 'block';
            screenLogin.classList.replace('fade-hide', 'fade-show');
            document.getElementById('btn-login').innerText = "Sign In";
            document.getElementById('btn-login').disabled = false;
        }, 400);
    }
}

document.getElementById('btn-back').onclick = () => toggleScreens(false);

// Auto-focus OTP boxes logic
otpBoxes.forEach((box, i) => {
    box.addEventListener('input', (e) => {
        if (box.value && i < 5) otpBoxes[i + 1].focus();
    });
    box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !box.value && i > 0) otpBoxes[i - 1].focus();
    });
});