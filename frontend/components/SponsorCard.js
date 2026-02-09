import Link from 'next/link'

export default function SponsorCard({ sponsor }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="card">
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
          <img
            src={sponsor.logo}
            alt={sponsor.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">{sponsor.name}</h3>
          <p className="text-sm text-gray-600">{sponsor.category}</p>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4 line-clamp-2">{sponsor.description}</p>
      
      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-1">Budget Range</div>
        <div className="font-semibold text-primary-600">{formatCurrency(sponsor.budget)}</div>
      </div>
      
      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-2">Interests</div>
        <div className="flex flex-wrap gap-2">
          {sponsor.interests.map((interest, idx) => (
            <span key={idx} className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs">
              {interest}
            </span>
          ))}
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600 mb-2">
          <strong>Contact:</strong> {sponsor.contact.name}
        </div>
        <a 
          href={`mailto:${sponsor.contact.email}`}
          className="text-primary-600 hover:text-primary-700 text-sm"
        >
          {sponsor.contact.email}
        </a>
      </div>
    </div>
  )
}

