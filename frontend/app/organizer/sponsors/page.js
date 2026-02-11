import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'
import SponsorCard from '@/components/SponsorCard'
import { mockSponsors } from '@/lib/mockData'

export default function OrganizerSponsorsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <div className="flex-1 flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Find Sponsors</h1>
              <p className="text-gray-600">Browse sponsors looking to partner with events like yours</p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4">
              <select className="input-field w-full sm:w-auto">
                <option>All Categories</option>
                <option>Technology</option>
                <option>Business</option>
                <option>Healthcare</option>
              </select>
              <select className="input-field w-full sm:w-auto">
                <option>Budget Range</option>
                <option>₹0 - ₹40 Lakh</option>
                <option>₹40 Lakh - ₹80 Lakh</option>
                <option>₹80 Lakh+</option>
              </select>
              <input
                type="text"
                placeholder="Search sponsors..."
                className="input-field w-full sm:w-auto flex-1"
              />
            </div>

            {/* Sponsors Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockSponsors.map((sponsor) => (
                <SponsorCard key={sponsor.id} sponsor={sponsor} />
              ))}
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  )
}

