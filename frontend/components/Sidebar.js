'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Sidebar() {
  const pathname = usePathname()
  const [role, setRole] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setRole(payload.role)
    } catch (err) {
      console.error('Invalid token')
    }
  }, [])

  if (!role) return null

  const isOrganizerRoute = pathname.startsWith('/organizer')
  const isSponsorRoute = pathname.startsWith('/sponsor')

  // 🚀 ONLY show sidebar if role matches route
  if (
    (role === 'organizer' && isOrganizerRoute) ||
    (role === 'sponsor' && isSponsorRoute)
  ) {
    const organizerLinks = [
      { href: '/organizer/dashboard', label: 'Dashboard' },
      { href: '/organizer/events', label: 'My Events' },
      { href: '/events/create', label: 'Create Event' },
      { href: '/organizer/sponsors', label: 'Find Sponsors' },
      { href: '/organizer/analytics', label: 'Analytics' },
      { href: '/organizer/notification', label: 'Notification' },
    ]

    const sponsorLinks = [
      { href: '/sponsor/dashboard', label: 'Dashboard' },
      { href: '/sponsor/events', label: 'Browse Events' },
      { href: '/sponsor/proposals', label: 'My Proposals' },
      { href: '/sponsor/analytics', label: 'Analytics' },
      { href: '/sponsor/chats', label: 'My Chats' },
    ]

    const links = role === 'organizer' ? organizerLinks : sponsorLinks

    return (
      <aside className="w-64 bg-gray-900 border-r border-gray-800 shadow-lg h-screen sticky top-0">
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary-400 mb-6">
            {role === 'organizer' ? 'Organizer' : 'Sponsor'} Portal
          </h2>

          <nav className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  pathname === link.href
                    ? 'bg-primary-600 text-white font-semibold'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    )
  }

  // ❌ Role does NOT match route → no sidebar
  return null
}
