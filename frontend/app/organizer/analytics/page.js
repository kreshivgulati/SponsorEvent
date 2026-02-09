import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'

export default function OrganizerAnalyticsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <div className="flex-1 flex">
        <Sidebar type="organizer" />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Analytics</h1>
              <p className="text-gray-600">Track your event performance and sponsorship metrics</p>
            </div>

            {/* Analytics Content */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">Sponsorship Revenue</h2>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                  <p className="text-gray-500">Chart visualization would go here</p>
                </div>
              </div>
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">Event Performance</h2>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                  <p className="text-gray-500">Chart visualization would go here</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Key Metrics</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Avg. Sponsorship Value</div>
                  <div className="text-2xl font-bold">₹37 Lakh</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Conversion Rate</div>
                  <div className="text-2xl font-bold">68%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Response Time</div>
                  <div className="text-2xl font-bold">2.3 days</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Top Category</div>
                  <div className="text-2xl font-bold">Technology</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  )
}

