import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'

export default function SponsorProposalsPage() {
  const proposals = [
    {
      id: '1',
      eventName: 'Tech Innovation Summit 2024',
      status: 'accepted',
      amount: 50000,
      submittedDate: '2024-01-15',
      eventDate: '2024-06-15'
    },
    {
      id: '2',
      eventName: 'Startup Pitch Competition',
      status: 'pending',
      amount: 30000,
      submittedDate: '2024-02-01',
      eventDate: '2024-08-10'
    },
    {
      id: '3',
      eventName: 'Sustainable Business Conference',
      status: 'rejected',
      amount: 25000,
      submittedDate: '2024-01-20',
      eventDate: '2024-07-20'
    }
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <div className="flex-1 flex">
        <Sidebar    />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">My Proposals</h1>
              <p className="text-gray-600">Track all your sponsorship proposals and their status</p>
            </div>

            {/* Proposals List */}
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <div key={proposal.id} className="card">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-xl font-semibold">{proposal.eventName}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(proposal.status)}`}>
                          {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-semibold">Amount:</span> {formatCurrency(proposal.amount)}
                        </div>
                        <div>
                          <span className="font-semibold">Submitted:</span> {new Date(proposal.submittedDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-semibold">Event Date:</span> {new Date(proposal.eventDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-4">
                      <Link 
                        href={`/events/${proposal.id}`}
                        className="btn-secondary text-sm"
                      >
                        View Event
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  )
}

