export const dynamic = "force-dynamic";
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'
import SponsorCard from '@/components/SponsorCard'

async function getSponsors() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/sponsors`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch sponsors");
    }

    const data = await res.json();
    return data.sponsors || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function OrganizerSponsorsPage() {
  const sponsors = await getSponsors()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Find Sponsors</h1>
              <p className="text-gray-600">
                Browse sponsors looking to partner with events like yours
              </p>
            </div>

            {/* Filters (UI only for now) */}
            <div className="mb-6 flex flex-wrap gap-4">
              <select className="input-field w-full sm:w-auto">
                <option>All Categories</option>
              </select>

              <select className="input-field w-full sm:w-auto">
                <option>Budget Range</option>
              </select>

              <input
                type="text"
                placeholder="Search sponsors..."
                className="input-field w-full sm:w-auto flex-1"
              />
            </div>

            {/* Sponsors Grid */}
            {sponsors.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sponsors.map((sponsor) => (
                  <SponsorCard
                    key={sponsor._id}
                    sponsor={sponsor}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                No sponsors found in database.
              </div>
            )}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  )
}