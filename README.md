# SponsorMatch - Frontend Application

A modern Next.js frontend application for connecting event organizers with sponsors. This platform eliminates manual sponsorship outreach by providing an automated matching system.

## Features

- 🏠 **Landing Page** - Modern hero section with features and statistics
- 📊 **Organizer Dashboard** - Manage events, track sponsors, view analytics
- 💼 **Sponsor Dashboard** - Browse events, manage proposals, track ROI
- 📅 **Event Management** - Create, view, and manage events
- 🔍 **Sponsor Discovery** - Browse and filter sponsors
- 📱 **Mobile Responsive** - Fully responsive design for all devices
- 🎨 **Modern UI/UX** - Clean, startup-style design with Tailwind CSS

## Tech Stack

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Mock Data** - Dummy data for development

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── events/
│   │   ├── [id]/          # Event details page
│   │   ├── create/        # Create event page
│   │   └── page.js        # Events listing page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── organizer/
│   │   ├── dashboard/     # Organizer dashboard
│   │   ├── events/        # Organizer's events
│   │   ├── sponsors/      # Find sponsors
│   │   └── analytics/     # Analytics page
│   ├── sponsor/
│   │   ├── dashboard/     # Sponsor dashboard
│   │   ├── events/        # Browse events
│   │   ├── proposals/     # Sponsor proposals
│   │   └── analytics/     # Analytics page
│   ├── layout.js          # Root layout
│   ├── page.js            # Home/Landing page
│   └── globals.css        # Global styles
├── components/
│   ├── Navbar.js          # Navigation component
│   ├── Footer.js          # Footer component
│   ├── EventCard.js       # Event card component
│   ├── SponsorCard.js     # Sponsor card component
│   ├── Sidebar.js         # Dashboard sidebar
│   └── StatCard.js        # Statistics card
├── lib/
│   └── mockData.js        # Mock data for events and sponsors
└── public/                # Static assets

```

## Pages

### Public Pages
- `/` - Landing page
- `/events` - Browse all events
- `/events/[id]` - Event details page
- `/login` - Login page
- `/signup` - Signup page

### Organizer Pages
- `/organizer/dashboard` - Organizer dashboard with stats
- `/organizer/events` - Manage organizer's events
- `/organizer/sponsors` - Find and browse sponsors
- `/organizer/analytics` - Analytics and metrics

### Sponsor Pages
- `/sponsor/dashboard` - Sponsor dashboard with stats
- `/sponsor/events` - Browse events seeking sponsors
- `/sponsor/proposals` - Manage sponsorship proposals
- `/sponsor/analytics` - Analytics and ROI tracking

## Components

### Reusable Components
- **Navbar** - Responsive navigation with mobile menu
- **Footer** - Site footer with links
- **EventCard** - Card component for displaying events
- **SponsorCard** - Card component for displaying sponsors
- **Sidebar** - Dashboard sidebar navigation
- **StatCard** - Statistics/metrics card component

## Mock Data

The application uses mock data located in `lib/mockData.js`:
- `mockEvents` - Array of sample events
- `mockSponsors` - Array of sample sponsors
- `mockOrganizerStats` - Statistics for organizer dashboard
- `mockSponsorStats` - Statistics for sponsor dashboard

## Styling

The application uses Tailwind CSS with custom configuration:
- Primary color: Blue (#0ea5e9)
- Custom utility classes in `globals.css`
- Responsive breakpoints: sm, md, lg
- Card, button, and input field styles

## Features in Detail

### Landing Page
- Hero section with CTA buttons
- Features showcase
- Statistics section
- Call-to-action section

### Dashboards
- Statistics cards with metrics
- Quick action buttons
- Recent events/proposals
- Activity feed

### Event Management
- Create event form
- Event listing with filters
- Event details page
- Sponsor information

### Responsive Design
- Mobile-first approach
- Responsive navigation
- Grid layouts that adapt to screen size
- Touch-friendly buttons and inputs

## Development Notes

- This is a **frontend-only** application with no backend logic
- All data is mock/dummy data
- Forms submit but don't persist data (demo purposes)
- Images use Unsplash placeholder URLs
- Ready to be connected to a backend API

## Next Steps

To integrate with a backend:
1. Replace mock data with API calls
2. Add authentication state management
3. Implement form submissions
4. Add real-time updates
5. Connect to your backend API endpoints

## License

ISC
