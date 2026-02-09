# Authentication System Guide

Complete guide for the dual authentication system (Google OAuth + Email OTP) for Event-Sponsor Matching Platform.

## Features

✅ **Google OAuth 2.0** - Sign in with Google account
✅ **Email OTP** - Sign in with 6-digit OTP sent to email
✅ **Role Selection** - Choose between Organizer or Sponsor
✅ **JWT Authentication** - Secure token-based authentication
✅ **Protected Routes** - APIs require authentication
✅ **Role-Based Access** - UI adapts based on user role

## Setup Instructions

### 1. Backend Setup

#### Install Dependencies
```bash
npm install
```

#### Environment Variables
Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8000

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Session Secret
SESSION_SECRET=your-session-secret-change-in-production

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email Configuration (for OTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

#### Gmail App Password Setup (for OTP)

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Security → 2-Step Verification (enable if not already)
3. App Passwords → Generate new app password
4. Copy the 16-character password to `.env` as `EMAIL_PASS`

### 2. Frontend Setup

No additional setup required! Just open `login.html` in a browser.

## Authentication Flow

### Google OAuth Flow

1. User clicks "Continue with Google"
2. Redirected to Google login page
3. User authorizes application
4. Google redirects back with code
5. Backend exchanges code for user info
6. User created/linked in database
7. JWT token generated
8. Redirected to role selection (if needed) or main page

### Email OTP Flow

1. User enters email address
2. Backend generates 6-digit OTP
3. OTP sent to email (valid for 5 minutes)
4. User enters OTP
5. Backend verifies OTP
6. User created/linked in database
7. JWT token generated
8. Redirected to role selection (if needed) or main page

### Role Selection

After first login, users must select a role:
- **Event Organizer**: Can list events and find sponsors
- **Sponsor**: Can create sponsor profile and find events

Role is stored in user profile and used for:
- UI customization
- Feature access control
- API authorization

## API Endpoints

### Authentication

- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/otp/send` - Send OTP to email
- `POST /api/auth/otp/verify` - Verify OTP and login
- `POST /api/auth/select-role` - Set user role (requires auth)
- `GET /api/auth/me` - Get current user info (requires auth)

### Protected Endpoints

All these endpoints require `Authorization: Bearer <token>` header:

- `POST /api/events` - Create event (organizer role recommended)
- `POST /api/sponsors` - Create sponsor profile (sponsor role recommended)
- `GET /api/match/:sponsorId` - Get matched events (sponsor role recommended)

## Frontend Files

### `login.html`
- Login page with Google and OTP options
- Role selection UI
- Smooth animations

### `login.js`
- Handles Google OAuth redirect
- Manages OTP flow
- Role selection logic

### `auth-callback.html`
- Handles Google OAuth callback
- Processes token from URL
- Redirects to appropriate page

### `script.js` (updated)
- Authentication helpers
- Token management
- Protected API calls
- Role-based UI

## Security Features

✅ **JWT Tokens** - Secure, stateless authentication
✅ **Token Expiration** - Tokens expire after 7 days
✅ **OTP Expiration** - OTPs expire after 5 minutes
✅ **Environment Variables** - Secrets stored securely
✅ **CORS Protection** - Configured for specific origins
✅ **Input Validation** - All inputs validated
✅ **Error Handling** - Graceful error handling

## Testing

### Test Google OAuth
1. Click "Continue with Google"
2. Sign in with Google account
3. Verify redirect and token storage

### Test Email OTP
1. Click "Continue with Email OTP"
2. Enter email address
3. Check email for OTP (or console in dev mode)
4. Enter OTP
5. Verify login success

### Test Role Selection
1. Login as new user
2. Select role (Organizer or Sponsor)
3. Verify UI updates based on role

### Test Protected Routes
1. Try accessing protected API without token
2. Verify 401 error
3. Login and retry
4. Verify success

## Troubleshooting

### Google OAuth Not Working
- Check Google Client ID and Secret in `.env`
- Verify callback URL matches Google Console settings
- Check CORS settings

### OTP Email Not Sending
- Verify Gmail App Password in `.env`
- Check email credentials
- In development, OTP is logged to console

### Token Expired
- Tokens expire after 7 days
- User will be redirected to login
- Token is automatically cleared from localStorage

### Role Not Set
- User must select role after first login
- Role selection is required for full functionality
- Can be changed later (if implemented)

## Development Notes

- In development mode, OTP is shown in console
- Tokens stored in localStorage (not secure for production)
- User data stored in memory (resets on server restart)
- For production, use MongoDB and Redis

## Production Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Change SESSION_SECRET to strong random string
- [ ] Update FRONTEND_URL to production domain
- [ ] Update GOOGLE_CALLBACK_URL to production domain
- [ ] Use MongoDB for user storage
- [ ] Use Redis for OTP storage
- [ ] Enable HTTPS
- [ ] Remove dev OTP logging
- [ ] Implement token refresh
- [ ] Add rate limiting
- [ ] Add CSRF protection

