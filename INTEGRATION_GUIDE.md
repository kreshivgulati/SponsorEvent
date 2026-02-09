# Frontend-Backend Integration Guide

This guide explains how the frontend and backend are connected for the Event-Sponsor Matching Platform.

## Quick Start

1. **Start the Backend Server:**
   ```bash
   cd backend  # or root directory if server.js is in root
   npm install
   npm start
   ```
   Server runs on `http://localhost:5000`

2. **Open the Frontend:**
   - Simply open `index.html` in a browser
   - Or use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js http-server
     npx http-server -p 8000
     ```
   - Open `http://localhost:8000` in your browser

## API Integration

### API Base URL Configuration

The frontend uses an environment-based API base URL. By default, it points to `http://localhost:5000`.

To change the API URL, update the script tag in `index.html`:

```html
<script>
    window.API_BASE_URL = 'http://localhost:5000'; // Change this for production
</script>
```

### API Endpoints Used

1. **POST /api/events** - Create new event
   - Called when organizer submits event form
   - Sends: `eventName`, `category`, `audienceSize`, `requiredBudget`, `location`

2. **GET /api/events** - Get all events
   - Called on page load to display existing events
   - Falls back to dummy data if API fails

3. **POST /api/sponsors** - Create sponsor profile
   - Called when sponsor submits profile form
   - Sends: `sponsorName`, `preferredCategories`, `minAudience`, `maxBudget`, `preferredLocation`
   - Returns sponsor ID for matching

4. **GET /api/match/:sponsorId** - Get matched events
   - Called automatically after sponsor profile creation
   - Returns events sorted by match score (0-100%)

## Integration Flow

### Event Submission Flow

1. User fills out event form
2. Form submission triggers `createEvent()` API call
3. Loading animation shows on submit button
4. On success:
   - Form fades out
   - Success message appears
   - Events list reloads
   - Form resets after 5 seconds

### Sponsor Profile Flow

1. User fills out sponsor form (name, categories, budget, etc.)
2. Form submission triggers `createSponsor()` API call
3. On success:
   - Sponsor ID is stored
   - `getMatches()` is called automatically
   - Matched events are displayed with scores
   - Page scrolls to suggestions section

### Matching Display

- Events are displayed as cards with:
  - Event name and category
  - Match percentage (0-100%)
  - Animated progress bar
  - Match breakdown (category, audience, budget, location)
  - Event details (audience, budget, location)

## Error Handling

- **API Errors**: Displayed as toast notifications (top-right corner)
- **Network Errors**: Falls back to dummy data for events list
- **Validation Errors**: Shown inline on forms
- **Timeout**: 5-second auto-dismiss for error messages

## Features

✅ **Async/Await**: All API calls use modern async/await syntax
✅ **Error Handling**: Graceful error handling with user-friendly messages
✅ **Loading States**: Visual feedback during API calls
✅ **Animations**: Smooth UI transitions and animations
✅ **Fallback Data**: Dummy data used if API is unavailable
✅ **CORS Enabled**: Backend configured for cross-origin requests

## Testing the Integration

1. **Test Event Submission:**
   - Fill out event form
   - Submit and verify success message
   - Check backend console for created event

2. **Test Sponsor Profile:**
   - Fill out sponsor form
   - Select at least one category
   - Submit and verify matches appear

3. **Test Matching:**
   - Create a sponsor profile
   - Verify matched events appear with scores
   - Check match breakdown details

## Troubleshooting

**CORS Errors:**
- Ensure backend CORS is enabled (already configured)
- Check that backend is running on port 5000

**API Not Found:**
- Verify backend server is running
- Check API base URL in `index.html`
- Check browser console for errors

**No Matches Showing:**
- Ensure events exist in backend
- Verify sponsor profile was created successfully
- Check browser console for API errors

## Production Deployment

1. Update API base URL in `index.html`:
   ```html
   <script>
       window.API_BASE_URL = 'https://your-api-domain.com';
   </script>
   ```

2. Deploy backend to your server
3. Update CORS settings if needed
4. Test all API endpoints

## Code Structure

- **API Functions**: `apiRequest()`, `createEvent()`, `createSponsor()`, `getMatches()`
- **Form Handlers**: `initializeEventForm()`, `initializeSponsorForm()`
- **Display Functions**: `displaySponsorCards()`, `loadAndDisplayMatches()`
- **Error Handling**: `showError()` with toast notifications

All code is well-commented and suitable for hackathon presentations!

