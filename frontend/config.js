/**
 * API Configuration
 * 
 * Set the API base URL here or use environment variable.
 * For production, set window.API_BASE_URL before loading script.js
 * 
 * Example:
 * <script>
 *   window.API_BASE_URL = 'https://api.yourdomain.com';
 * </script>
 * <script src="script.js"></script>
 */

// Default API base URL (used if window.API_BASE_URL is not set)
// This will be overridden by script.js if window.API_BASE_URL exists
window.API_BASE_URL = window.API_BASE_URL || ' ${process.env.NEXT_PUBLIC_API_URL}';

