'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Sidebar({ type = 'organizer' }) {
  const pathname = usePathname()
  // Always start false so server and initial client render match (avoids hydration error).
  // Auth is read in useEffect after mount.
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      setIsLoggedIn(!!token)
    }
    checkAuth()
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  if (!isLoggedIn) return null

  const organizerLinks = [
    { href: '/organizer/dashboard', label: 'Dashboard'  },
    { href: '/organizer/events', label: 'My Events' },
    { href: '/events/create', label: 'Create Event' },
    { href: '/organizer/sponsors', label: 'Find Sponsors'},
    { href: '/organizer/analytics', label: 'Analytics'},
    { href: '/organizer/notification', label: 'Notification'},
  ]

  const sponsorLinks = [
    { href: '/sponsor/dashboard', label: 'Dashboard' },
    { href: '/sponsor/events', label: 'Browse Events' },
    { href: '/sponsor/proposals', label: 'My Proposals'},
    { href: '/sponsor/analytics', label: 'Analytics' },
  ]

  const links = type === 'organizer' ? organizerLinks : sponsorLinks

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 shadow-lg h-screen sticky top-0">
      <div className="p-6">
        <h2 className="text-xl font-bold text-primary-400 mb-6">
          {type === 'organizer' ? 'Organizer' : 'Sponsor'} Portal
        </h2>
        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === link.href
                  ? 'bg-primary-600 text-white font-semibold'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}

