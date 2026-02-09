'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  // 🔹 Always sync auth state
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      setIsLoggedIn(!!token)
    }

    checkAuth()
    window.addEventListener('storage', checkAuth)

    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('storage', checkAuth)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };
  
  return (
    <nav
      className={`sticky top-0 z-50 bg-white transition-shadow ${
        scrolled ? 'shadow-md' : 'border-b'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-gray-900">SponsorMatch</span>
            <span className="text-xs font-medium text-gray-500">by LinkLogic</span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <Link href="/events" className="hover:text-gray-900">Events</Link>
            <Link href="/organizer/dashboard" className="hover:text-gray-900">Organizers</Link>
            <Link href="/sponsor/dashboard" className="hover:text-gray-900">Sponsors</Link>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link href="/login" className="text-sm hover:text-gray-900">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="btn-cta-gradient rounded-full text-sm"
                >
                  <span className="text-gradient">Create Free Account</span>
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="text-red-600 font-semibold text-sm"
              >
                Logout
              </button>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-6 py-4 space-y-4 text-gray-700">
            <Link href="/events" onClick={() => setIsOpen(false)}>Events</Link>
            <Link href="/organizer/dashboard" onClick={() => setIsOpen(false)}>Organizers</Link>
            <Link href="/sponsor/dashboard" onClick={() => setIsOpen(false)}>Sponsors</Link>

            {!isLoggedIn ? (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)}>Login</Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="btn-cta-gradient block text-center py-2 rounded-full"
                >
                  <span className="text-gradient">Create Free Account</span>
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="block w-full text-left text-red-600 font-semibold"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
