
const API_BASE_URL = window.API_BASE_URL || ' ${process.env.NEXT_PUBLIC_API_URL}';

// ============================================
// UI State Management
// ============================================

function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    errorEl.textContent = message;
    errorEl.classList.add('show');
    
    setTimeout(() => {
        errorEl.classList.remove('show');
    }, 5000);
}

function hideError() {
    document.getElementById('errorMessage').classList.remove('show');
}

function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

function showLoginOptions() {
    document.getElementById('loginOptions').style.display = 'block';
    document.getElementById('otpForm').classList.remove('active');
    hideError();
}

function showOTPForm() {
    document.getElementById('loginOptions').style.display = 'none';
    document.getElementById('otpForm').classList.add('active');
    hideError();
}

// ============================================
// Google OAuth Login
// ============================================

/**
 * Initiate Google OAuth login
 * Opens Google OAuth popup or redirects
 */
function loginWithGoogle() {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${API_BASE_URL}/api/auth/google`;
}

// ============================================
// OTP Login Flow
// ============================================

/**
 * Send OTP to user's email
 */
async function sendOTP() {
    const email = document.getElementById('email').value.trim();
    
    if (!email || !email.includes('@')) {
        showError('Please enter a valid email address');
        return;
    }
    
    showLoading();
    hideError();
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/otp/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to send OTP');
        }
        
        // Show OTP input
        document.getElementById('otpInputGroup').style.display = 'flex';
        document.getElementById('verifyOTPButton').style.display = 'block';
        document.getElementById('otp').focus();
        
        // In development, show OTP in console
        if (data.devOTP) {
            console.log(`[DEV] OTP for ${email}: ${data.devOTP}`);
            alert(`[Development Mode] OTP: ${data.devOTP}\n\nIn production, check your email.`);
        }
        
    } catch (error) {
        console.error('Error sending OTP:', error);
        showError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
        hideLoading();
    }
}

/**
 * Verify OTP and complete login
 */
async function verifyOTP() {
    const email = document.getElementById('email').value.trim();
    const otp = document.getElementById('otp').value.trim();
    const name = document.getElementById('name').value.trim();
    
    if (!email || !otp) {
        showError('Please enter email and OTP');
        return;
    }
    
    // Check if name is required (for new users)
    const nameInputGroup = document.getElementById('nameInputGroup');
    if (nameInputGroup.style.display === 'block' && !name) {
        showError('Please enter your name');
        return;
    }
    
    showLoading();
    hideError();
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/otp/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email, 
                otp,
                name: name || undefined
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Invalid OTP');
        }
        
        // Store token and user data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Check if role selection is required
        if (data.requiresRoleSelection) {
            // Show role selection
            showRoleSelection(data.user);
        } else {
            // Redirect to main page
            window.location.href = 'index.html';
        }
        
    } catch (error) {
        console.error('Error verifying OTP:', error);
        showError(error.message || 'Invalid OTP. Please try again.');
        
        // If it's a new user, show name input
        if (error.message && error.message.includes('name')) {
            document.getElementById('nameInputGroup').style.display = 'block';
        }
    } finally {
        hideLoading();
    }
}

// ============================================
// Role Selection
// ============================================

/**
 * Show role selection UI
 * @param {Object} user - User object
 */
function showRoleSelection(user) {
    const loginCard = document.querySelector('.login-card');
    
    loginCard.innerHTML = `
        <div class="login-header">
            <h1>Choose Your Role</h1>
            <p>Select how you want to use EventMatch</p>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <button class="btn btn-primary" style="width: 100%; padding: 1.5rem; font-size: 1.1rem;" onclick="selectRole('organizer')">
                <strong>Event Organizer</strong><br>
                <span style="font-size: 0.9rem; font-weight: normal;">List your events and find sponsors</span>
            </button>
            
            <button class="btn btn-secondary" style="width: 100%; padding: 1.5rem; font-size: 1.1rem;" onclick="selectRole('sponsor')">
                <strong>Sponsor</strong><br>
                <span style="font-size: 0.9rem; font-weight: normal;">Find events to sponsor</span>
            </button>
        </div>
    `;
}

/**
 * Select user role and complete registration
 * @param {string} role - 'organizer' or 'sponsor'
 */
async function selectRole(role) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        showError('Session expired. Please login again.');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/select-role`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ role })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to set role');
        }
        
        // Update stored user data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to main page
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error('Error selecting role:', error);
        showError(error.message || 'Failed to set role. Please try again.');
    } finally {
        hideLoading();
    }
}

// ============================================
// Handle Google OAuth Callback
// ============================================

/**
 * Check if this is a Google OAuth callback
 * Handle token from URL parameters
 */
function handleGoogleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const requiresRoleSelection = urlParams.get('requiresRoleSelection') === 'true';
    
    if (token) {
        // Store token temporarily
        localStorage.setItem('authToken', token);
        
        // Fetch user data
        fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
                
                if (requiresRoleSelection || !data.user.role) {
                    showRoleSelection(data.user);
                } else {
                    window.location.href = 'index.html';
                }
            }
        })
        .catch(() => {
            // If /api/auth/me doesn't exist, decode token manually
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const user = {
                    id: payload.userId,
                    email: payload.email,
                    role: payload.role
                };
                localStorage.setItem('user', JSON.stringify(user));
                
                if (requiresRoleSelection || !payload.role) {
                    showRoleSelection(user);
                } else {
                    window.location.href = 'index.html';
                }
            } catch (e) {
                showError('Failed to process login. Please try again.');
            }
        });
    }
}

// ============================================
// OTP Input Formatting
// ============================================

// Auto-format OTP input (numbers only)
document.addEventListener('DOMContentLoaded', () => {
    const otpInput = document.getElementById('otp');
    if (otpInput) {
        otpInput.addEventListener('input', (e) => {
            // Only allow numbers
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            
            // Auto-submit when 6 digits entered
            if (e.target.value.length === 6) {
                verifyOTP();
            }
        });
        
        // Allow Enter key to submit
        otpInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.value.length === 6) {
                verifyOTP();
            }
        });
    }
    
    // Handle Google OAuth callback
    handleGoogleCallback();
});

