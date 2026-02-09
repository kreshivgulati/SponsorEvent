import Link from 'next/link'
import Image from 'next/image'

export default function EventCard({ event }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <Link href={`/events/${event.id}`} className="card card-light block hover:scale-105 transition-transform duration-200">
      <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            event.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {event.status}
          </span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-2 line-clamp-2">{event.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
          {event.category}
        </span>
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{event.location}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
        <div>
          <div className="text-xs text-gray-500">Budget</div>
          <div className="font-semibold">{formatCurrency(event.budget)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Attendees</div>
          <div className="font-semibold">{event.expectedAttendees.toLocaleString()}</div>
        </div>
      </div>
    </Link>
  )
}

