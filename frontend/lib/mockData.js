// Mock data for events and sponsors

export const mockEvents = [
  {
    id: '1',
    title: 'Tech Innovation Summit 2024',
    description: 'A premier technology conference featuring the latest innovations in AI, blockchain, and cloud computing. Join industry leaders and innovators.',
    category: 'Technology',
    date: '2024-06-15',
    location: 'San Francisco, CA',
    expectedAttendees: 5000,
    budget: 50000,
    status: 'active',
    organizer: {
      name: 'Tech Events Inc.',
      email: 'contact@techevents.com'
    },
    sponsors: ['1', '2'],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
  },
  {
    id: '2',
    title: 'Sustainable Business Conference',
    description: 'Exploring sustainable business practices and environmental responsibility in modern enterprises.',
    category: 'Business',
    date: '2024-07-20',
    location: 'New York, NY',
    expectedAttendees: 2000,
    budget: 30000,
    status: 'active',
    organizer: {
      name: 'Green Business Network',
      email: 'info@greenbusiness.com'
    },
    sponsors: ['3'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800'
  },
  {
    id: '3',
    title: 'Startup Pitch Competition',
    description: 'Annual startup pitch competition with $100K in prizes. Connect with investors and mentors.',
    category: 'Startup',
    date: '2024-08-10',
    location: 'Austin, TX',
    expectedAttendees: 1500,
    budget: 25000,
    status: 'active',
    organizer: {
      name: 'Startup Hub',
      email: 'hello@startuphub.com'
    },
    sponsors: ['1', '4'],
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800'
  },
  {
    id: '4',
    title: 'Digital Marketing Masterclass',
    description: 'Learn advanced digital marketing strategies from industry experts. Hands-on workshops included.',
    category: 'Marketing',
    date: '2024-09-05',
    location: 'Los Angeles, CA',
    expectedAttendees: 800,
    budget: 20000,
    status: 'draft',
    organizer: {
      name: 'Marketing Pro',
      email: 'contact@marketingpro.com'
    },
    sponsors: [],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
  },
  {
    id: '5',
    title: 'Healthcare Innovation Forum',
    description: 'Discussing the future of healthcare technology and patient care innovations.',
    category: 'Healthcare',
    date: '2024-10-12',
    location: 'Boston, MA',
    expectedAttendees: 3000,
    budget: 40000,
    status: 'active',
    organizer: {
      name: 'HealthTech Alliance',
      email: 'info@healthtech.org'
    },
    sponsors: ['2', '5'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800'
  }
]

export const mockSponsors = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    description: 'Leading provider of enterprise technology solutions',
    category: 'Technology',
    budget: 100000,
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200',
    website: 'https://techcorp.com',
    contact: {
      name: 'John Smith',
      email: 'sponsorships@techcorp.com',
      phone: '+1-555-0101'
    },
    interests: ['Technology', 'Startup', 'Innovation']
  },
  {
    id: '2',
    name: 'CloudVault Inc.',
    description: 'Secure cloud storage and infrastructure solutions',
    category: 'Technology',
    budget: 75000,
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200',
    website: 'https://cloudvault.com',
    contact: {
      name: 'Sarah Johnson',
      email: 'partnerships@cloudvault.com',
      phone: '+1-555-0102'
    },
    interests: ['Technology', 'Healthcare', 'Business']
  },
  {
    id: '3',
    name: 'EcoBrand Partners',
    description: 'Sustainable branding and marketing solutions',
    category: 'Sustainability',
    budget: 50000,
    logo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200',
    website: 'https://ecobrand.com',
    contact: {
      name: 'Michael Green',
      email: 'hello@ecobrand.com',
      phone: '+1-555-0103'
    },
    interests: ['Business', 'Sustainability', 'Marketing']
  },
  {
    id: '4',
    name: 'Venture Capital Partners',
    description: 'Early-stage venture capital firm',
    category: 'Finance',
    budget: 150000,
    logo: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=200',
    website: 'https://vcpartners.com',
    contact: {
      name: 'Emily Chen',
      email: 'invest@vcpartners.com',
      phone: '+1-555-0104'
    },
    interests: ['Startup', 'Technology', 'Finance']
  },
  {
    id: '5',
    name: 'MedTech Innovations',
    description: 'Healthcare technology and medical device solutions',
    category: 'Healthcare',
    budget: 80000,
    logo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200',
    website: 'https://medtech.com',
    contact: {
      name: 'Dr. Robert Lee',
      email: 'sponsorships@medtech.com',
      phone: '+1-555-0105'
    },
    interests: ['Healthcare', 'Technology']
  }
]

export const mockOrganizerStats = {
  totalEvents: 12,
  activeEvents: 8,
  totalSponsors: 24,
  totalRevenue: 125000,
  upcomingEvents: 5,
  pendingMatches: 3
}

export const mockSponsorStats = {
  totalEvents: 8,
  activeSponsorships: 5,
  totalInvestment: 250000,
  matchRate: 85,
  upcomingEvents: 3,
  pendingProposals: 2
}

// Event organizers (colleges, summits) – for Sponsor Dashboard logo strip
// To use images: add files to public/logos/ and set imageUrl to '/logos/filename.png'
export const mockOrganizerLogos = [
  { id: 'o1', name: 'Tech Summit', shape: 'square', imageUrl: '/logos/Event/TechSummit.jpg' },
  { id: 'o2', name: 'IIT Delhi', shape: 'square', imageUrl: '/logos/Event/IIT.png' },
  { id: 'o3', name: 'Meraki', shape: 'square', imageUrl: '/logos/Event/meraki.png' },
  { id: 'o4', name: 'BITS Pilani', shape: 'square', imageUrl: '/logos/Event/BITS.jpg' },
  { id: 'o5', name: 'E Summit', shape: 'square', imageUrl: '/logos/Event/ESummit.png' },
  { id: 'o6', name: 'NIT Trichy', shape: 'square', imageUrl: '/logos/Event/NIT.png' },
]

// Brand logos – shown on ORGANIZER DASHBOARD only (/organizer/dashboard), section "Our Sponsors"
// Files live in public/logos/Sponsort/
export const mockBrandLogos = [
  { id: 'b1', name: 'Coca Cola', shape: 'rectangle', imageUrl: '/logos/Sponsort/832_coca_cola.jpg' },
  { id: 'b2', name: 'Josh Talk', shape: 'square', imageUrl: '/logos/Sponsort/Josh_Talk_Logo.png' },
  { id: 'b3', name: 'Maybelline', shape: 'rectangle', imageUrl: '/logos/Sponsort/Maybelline.jpg' },
  { id: 'b4', name: 'Tata Group', shape: 'square', imageUrl: '/logos/Sponsort/Tata-Logo.png' },
  { id: 'b5', name: 'TEDx4450', shape: 'rectangle', imageUrl: '/logos/Sponsort/tedx4450.jpg' },
  { id: 'b6', name: 'VISA', shape: 'rectangle', imageUrl: '/logos/Sponsort/bank.png' },
]

