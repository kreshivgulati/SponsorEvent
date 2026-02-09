// ============================================
// Event-Sponsor Matching Platform - JavaScript
// ============================================

/**
 * API Configuration
 * Base URL for backend API - uses environment variable or defaults to localhost:5000
 */
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:5000';

/**
 * Authentication Helper Functions
 */

/**
 * Get stored authentication token
 * @returns {string|null} JWT token or null
 */
function getAuthToken() {
    return localStorage.getItem('authToken');
}

/**
 * Get current user data
 * @returns {Object|null} User object or null
 */
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
function isAuthenticated() {
    return !!getAuthToken();
}

/**
 * Check if user has a specific role
 * @param {string} role - Role to check ('organizer' or 'sponsor')
 * @returns {boolean} True if user has the role
 */
function hasRole(role) {
    const user = getCurrentUser();
    return user && user.role === role;
}

/**
 * Logout user
 */
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

/**
 * Make authenticated API request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 */
async function authenticatedRequest(endpoint, options = {}) {
    const token = getAuthToken();
    
    if (!token) {
        throw new Error('Authentication required. Please login.');
    }
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };
    
    return await apiRequest(endpoint, {
        ...options,
        headers
    });
}

/**
 * API Helper Functions
 * Handles all communication with the backend
 */

/**
 * Make an API request with error handling
 * @param {string} endpoint - API endpoint (e.g., '/api/events')
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise<Object>} Response data
 */
async function apiRequest(endpoint, options = {}) {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        // Add body if provided
        if (options.body && typeof options.body === 'object') {
            config.body = JSON.stringify(options.body);
        }
        
        const response = await fetch(url, config);
        
        // Parse JSON response
        const data = await response.json();
        
        // Check if response is successful
        if (!response.ok) {
            // Handle authentication errors
            if (response.status === 401 || response.status === 403) {
                // Token expired or invalid - redirect to login
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                window.location.href = 'login.html';
                throw new Error('Session expired. Please login again.');
            }
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

/**
 * Create a new event via API (requires authentication)
 * @param {Object} eventData - Event data object
 * @returns {Promise<Object>} Created event
 */
async function createEvent(eventData) {
    return await authenticatedRequest('/api/events', {
        method: 'POST',
        body: {
            eventName: eventData.eventName,
            category: eventData.category,
            audienceSize: parseInt(eventData.audience),
            requiredBudget: parseFloat(eventData.budget),
            location: eventData.location
        }
    });
}

/**
 * Get all events from API
 * @returns {Promise<Array>} Array of events
 */
async function getAllEvents() {
    const response = await apiRequest('/api/events', {
        method: 'GET'
    });
    return response.data || [];
}

/**
 * Create a new sponsor profile via API (requires authentication)
 * @param {Object} sponsorData - Sponsor data object
 * @returns {Promise<Object>} Created sponsor with ID
 */
async function createSponsor(sponsorData) {
    return await authenticatedRequest('/api/sponsors', {
        method: 'POST',
        body: {
            sponsorName: sponsorData.sponsorName,
            preferredCategories: sponsorData.preferredCategories,
            minAudience: parseInt(sponsorData.minAudience),
            maxBudget: parseFloat(sponsorData.maxBudget),
            preferredLocation: sponsorData.preferredLocation || 'any'
        }
    });
}

/**
 * Get matched events for a sponsor (requires authentication)
 * @param {number} sponsorId - Sponsor ID
 * @returns {Promise<Array>} Array of matched events with scores
 */
async function getMatches(sponsorId) {
    const response = await authenticatedRequest(`/api/match/${sponsorId}`, {
        method: 'GET'
    });
    return response.matches || [];
}

// ============================================
// Legacy Dummy Data (kept for fallback)
// ============================================

/**
 * Dummy sponsor/event data for demonstration
 * Used as fallback if API is unavailable
 */
const dummyEvents = [
    {
        id: 1,
        name: "Tech Innovation Summit 2024",
        industry: "Technology",
        category: "technology",
        matchPercentage: 95,
        audience: 5000,
        budget: 50000,
        location: "San Francisco, CA"
    },
    {
        id: 2,
        name: "Global Music Festival",
        industry: "Music",
        category: "music",
        matchPercentage: 88,
        audience: 20000,
        budget: 100000,
        location: "New York, NY"
    },
    {
        id: 3,
        name: "Startup Business Expo",
        industry: "Business",
        category: "business",
        matchPercentage: 92,
        audience: 3000,
        budget: 30000,
        location: "Austin, TX"
    },
    {
        id: 4,
        name: "Marathon Championship 2024",
        industry: "Sports",
        category: "sports",
        matchPercentage: 85,
        audience: 15000,
        budget: 75000,
        location: "Boston, MA"
    },
    {
        id: 5,
        name: "Healthcare Innovation Conference",
        industry: "Healthcare",
        category: "healthcare",
        matchPercentage: 90,
        audience: 2500,
        budget: 40000,
        location: "Chicago, IL"
    },
    {
        id: 6,
        name: "Art & Culture Festival",
        industry: "Arts & Culture",
        category: "arts",
        matchPercentage: 82,
        audience: 8000,
        budget: 35000,
        location: "Los Angeles, CA"
    },
    {
        id: 7,
        name: "Food & Wine Expo",
        industry: "Food & Beverage",
        category: "food",
        matchPercentage: 87,
        audience: 12000,
        budget: 60000,
        location: "Napa Valley, CA"
    },
    {
        id: 8,
        name: "Education Technology Summit",
        industry: "Education",
        category: "education",
        matchPercentage: 93,
        audience: 4000,
        budget: 45000,
        location: "Seattle, WA"
    }
];

// Store all events for filtering
let allEvents = [];
let currentSponsorId = null;

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Display user info in navigation
    displayUserInfo();
    
    // Initialize event form handler
    initializeEventForm();
    
    // Initialize sponsor form handler
    initializeSponsorForm();
    
    // Try to load events from API, fallback to dummy data
    await loadEvents();
    
    // Display sponsor/event cards
    displaySponsorCards(allEvents);
    
    // Smooth scroll for navigation links
    initializeSmoothScroll();
    
    // Initialize scroll-based animations using Intersection Observer
    initializeScrollAnimations();
    
    // Show/hide features based on role
    handleRoleBasedUI();
});

/**
 * Display user information in navigation
 */
function displayUserInfo() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Add user info to navbar
    const navbar = document.querySelector('.navbar .container');
    if (navbar) {
        const userInfo = document.createElement('div');
        userInfo.style.cssText = 'display: flex; align-items: center; gap: 1rem;';
        userInfo.innerHTML = `
            <span style="color: var(--text-dark);">Hello, ${user.name}</span>
            <span style="color: var(--text-light); font-size: 0.9rem;">(${user.role || 'No role'})</span>
            <button onclick="logout()" style="background: var(--primary-color); color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">Logout</button>
        `;
        navbar.appendChild(userInfo);
    }
}

/**
 * Handle role-based UI visibility
 */
function handleRoleBasedUI() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Show/hide sections based on role
    const listEventSection = document.getElementById('list-event');
    const sponsorFormSection = document.getElementById('sponsor-form');
    
    if (user.role === 'organizer') {
        // Organizers can list events
        if (listEventSection) listEventSection.style.display = 'block';
        if (sponsorFormSection) sponsorFormSection.style.display = 'none';
    } else if (user.role === 'sponsor') {
        // Sponsors can create profiles and see matches
        if (listEventSection) listEventSection.style.display = 'none';
        if (sponsorFormSection) sponsorFormSection.style.display = 'block';
    } else {
        // No role selected - show both (user needs to select role)
        if (listEventSection) listEventSection.style.display = 'block';
        if (sponsorFormSection) sponsorFormSection.style.display = 'block';
    }
}

/**
 * Load events from API or use dummy data as fallback
 */
async function loadEvents() {
    try {
        const events = await getAllEvents();
        if (events && events.length > 0) {
            // Transform API event format to display format
            allEvents = events.map(event => ({
                id: event.id,
                name: event.eventName,
                industry: event.category.charAt(0).toUpperCase() + event.category.slice(1),
                category: event.category,
                matchPercentage: 0, // Will be set by matching API
                audience: event.audienceSize,
                budget: event.requiredBudget,
                location: event.location
            }));
        } else {
            // Fallback to dummy data if no events in API
            allEvents = [...dummyEvents];
        }
    } catch (error) {
        console.warn('Failed to load events from API, using dummy data:', error);
        // Fallback to dummy data if API fails
        allEvents = [...dummyEvents];
    }
}

/**
 * Initialize the event listing form
 * Handles form submission, sends data to API, and displays success message
 */
function initializeEventForm() {
    const eventForm = document.getElementById('eventForm');
    const successMessage = document.getElementById('successMessage');
    const submitButton = eventForm?.querySelector('.btn-submit');
    const btnText = submitButton?.querySelector('.btn-text');
    const btnLoader = submitButton?.querySelector('.btn-loader');
    
    if (eventForm) {
        eventForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevent default form submission
            
            // Get form data
            const formData = {
                eventName: document.getElementById('eventName').value.trim(),
                category: document.getElementById('category').value,
                audience: document.getElementById('audience').value,
                budget: document.getElementById('budget').value,
                location: document.getElementById('location').value.trim()
            };
            
            // Validate form data
            if (!formData.eventName || !formData.category || !formData.audience || !formData.budget || !formData.location) {
                showError('Please fill in all required fields');
                return;
            }
            
            // Show loading animation on submit button
            if (submitButton && btnText && btnLoader) {
                submitButton.classList.add('loading');
                submitButton.disabled = true;
                btnLoader.classList.remove('hidden');
            }
            
            try {
                // Send event data to API
                const response = await createEvent(formData);
                
                console.log('Event created successfully:', response);
                
                // Hide the form with fade out
                eventForm.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                eventForm.style.opacity = '0';
                eventForm.style.transform = 'translateY(-20px)';
                
                // After form fades out, show success message
                setTimeout(function() {
                    eventForm.style.display = 'none';
                    
                    // Show success message with animation
                    successMessage.classList.remove('hidden');
                    successMessage.classList.add('show');
                    
                    // Reset button state
                    if (submitButton && btnText && btnLoader) {
                        submitButton.classList.remove('loading');
                        submitButton.disabled = false;
                        btnLoader.classList.add('hidden');
                    }
                    
                    // Reload events list
                    loadEvents();
                }, 300);
                
                // Reset form after 5 seconds
                setTimeout(function() {
                    // Hide success message
                    successMessage.classList.remove('show');
                    successMessage.classList.add('hidden');
                    
                    // Reset and show form
                    eventForm.reset();
                    eventForm.style.display = 'block';
                    eventForm.style.opacity = '1';
                    eventForm.style.transform = 'translateY(0)';
                }, 5000);
                
            } catch (error) {
                console.error('Error creating event:', error);
                showError(error.message || 'Failed to create event. Please try again.');
                
                // Reset button state on error
                if (submitButton && btnText && btnLoader) {
                    submitButton.classList.remove('loading');
                    submitButton.disabled = false;
                    btnLoader.classList.add('hidden');
                }
            }
        });
    }
}

/**
 * Initialize the sponsor profile form
 * Handles form submission, sends data to API, and fetches matches
 */
function initializeSponsorForm() {
    const sponsorForm = document.getElementById('sponsorForm');
    const successMessage = document.getElementById('sponsorSuccessMessage');
    const submitButton = sponsorForm?.querySelector('.btn-submit');
    const btnText = submitButton?.querySelector('.btn-text');
    const btnLoader = submitButton?.querySelector('.btn-loader');
    
    if (sponsorForm) {
        sponsorForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevent default form submission
            
            // Get form data
            const sponsorName = document.getElementById('sponsorName').value.trim();
            const preferredCategories = Array.from(
                document.querySelectorAll('input[name="preferredCategories"]:checked')
            ).map(checkbox => checkbox.value);
            const minAudience = document.getElementById('minAudience').value;
            const maxBudget = document.getElementById('maxBudget').value;
            const preferredLocation = document.getElementById('preferredLocation').value.trim() || 'any';
            
            // Validate form data
            if (!sponsorName || preferredCategories.length === 0 || !minAudience || !maxBudget) {
                showError('Please fill in all required fields and select at least one category');
                return;
            }
            
            const formData = {
                sponsorName,
                preferredCategories,
                minAudience,
                maxBudget,
                preferredLocation
            };
            
            // Show loading animation on submit button
            if (submitButton && btnText && btnLoader) {
                submitButton.classList.add('loading');
                submitButton.disabled = true;
                btnLoader.classList.remove('hidden');
            }
            
            try {
                // Create sponsor profile via API
                const response = await createSponsor(formData);
                
                console.log('Sponsor created successfully:', response);
                
                // Store sponsor ID for matching
                currentSponsorId = response.data.id;
                
                // Hide the form with fade out
                sponsorForm.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                sponsorForm.style.opacity = '0';
                sponsorForm.style.transform = 'translateY(-20px)';
                
                // After form fades out, show success message
                setTimeout(async function() {
                    sponsorForm.style.display = 'none';
                    
                    // Show success message with animation
                    successMessage.classList.remove('hidden');
                    successMessage.classList.add('show');
                    
                    // Reset button state
                    if (submitButton && btnText && btnLoader) {
                        submitButton.classList.remove('loading');
                        submitButton.disabled = false;
                        btnLoader.classList.add('hidden');
                    }
                    
                    // Fetch and display matches
                    await loadAndDisplayMatches(currentSponsorId);
                    
                    // Scroll to suggestions section
                    setTimeout(() => {
                        scrollToSection('suggestions');
                    }, 1000);
                    
                }, 300);
                
            } catch (error) {
                console.error('Error creating sponsor:', error);
                showError(error.message || 'Failed to create sponsor profile. Please try again.');
                
                // Reset button state on error
                if (submitButton && btnText && btnLoader) {
                    submitButton.classList.remove('loading');
                    submitButton.disabled = false;
                    btnLoader.classList.add('hidden');
                }
            }
        });
    }
}

/**
 * Load and display matched events for a sponsor
 * @param {number} sponsorId - Sponsor ID
 */
async function loadAndDisplayMatches(sponsorId) {
    try {
        const matches = await getMatches(sponsorId);
        
        if (matches && matches.length > 0) {
            // Transform match data to display format
            const matchedEvents = matches.map(match => ({
                id: match.event.id,
                name: match.event.eventName,
                industry: match.event.category.charAt(0).toUpperCase() + match.event.category.slice(1),
                category: match.event.category,
                matchPercentage: match.matchPercentage,
                audience: match.event.audienceSize,
                budget: match.event.requiredBudget,
                location: match.event.location,
                matchScore: match.matchScore,
                breakdown: match.breakdown
            }));
            
            // Update global events list and display
            allEvents = matchedEvents;
            displaySponsorCards(matchedEvents);
        } else {
            // No matches found
            const container = document.getElementById('sponsorCardsContainer');
            if (container) {
                container.innerHTML = `
                    <p style="text-align: center; color: var(--text-light); grid-column: 1 / -1; padding: 2rem;">
                        No matching events found. Try adjusting your preferences or check back later.
                    </p>
                `;
            }
        }
    } catch (error) {
        console.error('Error loading matches:', error);
        showError('Failed to load matches. Please try again.');
    }
}

/**
 * Show error message to user
 * @param {string} message - Error message to display
 */
function showError(message) {
    // Create or update error message element
    let errorElement = document.getElementById('errorMessage');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'errorMessage';
        errorElement.className = 'error-message';
        errorElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #ef4444;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        document.body.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorElement.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 300);
    }, 5000);
}

/**
 * Display sponsor/event cards dynamically with staggered animations
 * @param {Array} events - Array of event objects to display
 */
function displaySponsorCards(events) {
    const container = document.getElementById('sponsorCardsContainer');
    
    if (!container) return;
    
    // Clear existing cards
    container.innerHTML = '';
    
    // If no events match the filter, show message
    if (events.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light); grid-column: 1 / -1;">No events found matching your criteria.</p>';
        return;
    }
    
    // Create and append cards for each event with staggered animation
    events.forEach((event, index) => {
        const card = createSponsorCard(event, index);
        container.appendChild(card);
        
        // Trigger animation after a small delay to ensure DOM is ready
        setTimeout(() => {
            card.classList.add('animate-in');
        }, 50);
    });
}

/**
 * Create a single sponsor/event card element with animated match percentage
 * @param {Object} event - Event object with details
 * @param {number} index - Index of the card for staggered animation
 * @returns {HTMLElement} Card element
 */
function createSponsorCard(event, index = 0) {
    // Create card container
    const card = document.createElement('div');
    card.className = 'sponsor-card';
    
    // Get match percentage (from API or default to 0)
    const matchPercentage = event.matchPercentage || 0;
    
    // Create match percentage element with progress bar
    const matchPercentageElement = document.createElement('div');
    matchPercentageElement.className = 'match-percentage';
    matchPercentageElement.textContent = `${matchPercentage}% Match`;
    
    // Set the progress bar width using CSS custom property
    matchPercentageElement.style.setProperty('--match-width', `${matchPercentage}%`);
    
    // Create card HTML structure
    const cardHeader = document.createElement('div');
    cardHeader.className = 'sponsor-card-header';
    
    const sponsorName = document.createElement('div');
    sponsorName.className = 'sponsor-name';
    sponsorName.textContent = event.name;
    
    cardHeader.appendChild(sponsorName);
    cardHeader.appendChild(matchPercentageElement);
    
    const sponsorIndustry = document.createElement('div');
    sponsorIndustry.className = 'sponsor-industry';
    sponsorIndustry.textContent = event.industry;
    
    const sponsorDetails = document.createElement('div');
    sponsorDetails.className = 'sponsor-details';
    
    // Add match breakdown if available
    let breakdownHTML = '';
    if (event.breakdown) {
        breakdownHTML = `
            <div class="match-breakdown" style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--border-color); font-size: 0.85rem;">
                <div style="color: var(--text-light); margin-bottom: 0.25rem;">Match Details:</div>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${event.breakdown.category > 0 ? `<span style="color: var(--success-color);">✓ Category</span>` : ''}
                    ${event.breakdown.audience > 0 ? `<span style="color: var(--success-color);">✓ Audience</span>` : ''}
                    ${event.breakdown.budget > 0 ? `<span style="color: var(--success-color);">✓ Budget</span>` : ''}
                    ${event.breakdown.location > 0 ? `<span style="color: var(--success-color);">✓ Location</span>` : ''}
                </div>
            </div>
        `;
    }
    
    sponsorDetails.innerHTML = `
        <div class="detail-item">
            <span class="detail-label">Expected Audience:</span>
            <span class="detail-value">${event.audience.toLocaleString()}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Budget Required:</span>
            <span class="detail-value">$${event.budget.toLocaleString()}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Location:</span>
            <span class="detail-value">${event.location}</span>
        </div>
        ${breakdownHTML}
    `;
    
    card.appendChild(cardHeader);
    card.appendChild(sponsorIndustry);
    card.appendChild(sponsorDetails);
    
    // Add staggered animation delay based on index
    card.style.animationDelay = `${index * 0.1}s`;
    
    return card;
}

/**
 * Filter events based on search input and category filter
 * Called when user types in search box or changes category filter
 * Note: This filters the currently loaded events (from API or dummy data)
 */
function filterEvents() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (!searchInput || !categoryFilter) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value.toLowerCase();
    
    // Filter events based on search term and category
    const filteredEvents = allEvents.filter(event => {
        // Check if event name or industry matches search term
        const matchesSearch = !searchTerm || 
            event.name.toLowerCase().includes(searchTerm) ||
            event.industry.toLowerCase().includes(searchTerm) ||
            event.location.toLowerCase().includes(searchTerm);
        
        // Check if category matches filter
        const matchesCategory = !selectedCategory || 
            event.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });
    
    // Display filtered events
    displaySponsorCards(filteredEvents);
}

/**
 * Smooth scroll to a section when clicking navigation links or buttons
 * @param {string} sectionId - ID of the section to scroll to
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Initialize smooth scrolling for all navigation links
 */
function initializeSmoothScroll() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-menu a, .hero-buttons button');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // For navigation menu links
            if (this.tagName === 'A') {
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const sectionId = href.substring(1);
                    scrollToSection(sectionId);
                }
            }
        });
    });
}

/**
 * Initialize scroll-based animations using Intersection Observer API
 * Animates elements when they enter the viewport
 */
function initializeScrollAnimations() {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback: show all elements immediately if Intersection Observer is not supported
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => el.classList.add('animated'));
        return;
    }
    
    // Create Intersection Observer with options
    const observerOptions = {
        root: null, // Use viewport as root
        rootMargin: '0px 0px -50px 0px', // Trigger animation when element is 50px from bottom
        threshold: 0.1 // Trigger when 10% of element is visible
    };
    
    // Callback function for when elements enter viewport
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Get animation delay from data attribute if present
                const delay = element.getAttribute('data-animation-delay') || 0;
                
                // Add animated class after delay
                setTimeout(() => {
                    element.classList.add('animated');
                }, delay);
                
                // Stop observing this element after animation triggers
                observer.unobserve(element);
            }
        });
    };
    
    // Create observer instance
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Format number with commas for better readability
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
    return num.toLocaleString();
}

// Export functions for potential external use (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        displaySponsorCards,
        filterEvents,
        scrollToSection,
        initializeScrollAnimations
    };
}

