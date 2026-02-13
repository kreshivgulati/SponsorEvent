import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'
import EventCard from '@/components/EventCard'
import Link from 'next/link'
import { connectDB } from '@/lib/mongoose'
import Event from '@/models/Event'

export default async function OrganizerEventsPage() {

  // Connect to DB
  await connectDB()

  // Fetch events (later filter by organizerId)
  const events = await Event.find().sort({ createdAt: -1 }).lean()

  return (
    <div
      className="
        min-h-screen
        flex
        flex-col
        text-gray-900
        bg-gradient-to-b
        from-[#F8FBFF]
        via-white
        to-[#F3F7FF]
      "
    >
      <Navbar />
      
      <div className="flex-1 flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">

            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">My Events</h1>
                <p className="text-gray-600">
                  Manage all your events and track sponsorship progress
                </p>
              </div>
              <Link href="/events/create" className="btn-cta-gradient">
                <span className="text-gradient">Create Event</span>
              </Link>
            </div>

            {/* Filters (UI only for now) */}
            <div className="mb-6 flex flex-wrap gap-4">
              <select className="input-field w-full sm:w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Draft</option>
                <option>Completed</option>
              </select>
              <select className="input-field w-full sm:w-auto">
                <option>All Categories</option>
                <option>Technology</option>
                <option>Business</option>
                <option>Startup</option>
              </select>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.length > 0 ? (
                events.map((event) => (
                  <EventCard key={event._id.toString()} event={event} />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-10">
                  No events found. Create your first event 🚀
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  )
}
