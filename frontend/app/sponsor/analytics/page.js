import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'

export default function SponsorAnalyticsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <div className="flex-1 flex">
        <Sidebar  />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Analytics</h1>
              <p className="text-gray-600">Track your sponsorship ROI and engagement metrics</p>
            </div>

            {/* Analytics Content */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">Investment Overview</h2>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                  <p className="text-gray-500">Chart visualization would go here</p>
                </div>
              </div>
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">Engagement Metrics</h2>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                  <p className="text-gray-500">Chart visualization would go here</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Key Metrics</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Avg. Investment</div>
                  <div className="text-2xl font-bold">₹52 Lakh</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Acceptance Rate</div>
                  <div className="text-2xl font-bold">85%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">ROI</div>
                  <div className="text-2xl font-bold">320%</div>
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

