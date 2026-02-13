'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const dropdownRef = useRef(null)
  const router = useRouter()

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setIsLoggedIn(false)
        setUser(null)
        return
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]))

        setIsLoggedIn(true)
        setUser({
          role: payload.role,
          email: payload.email,
        })
      } catch {
        setIsLoggedIn(false)
        setUser(null)
      }
    }

    checkAuth()
    window.addEventListener("storage", checkAuth)

    return () => window.removeEventListener("storage", checkAuth)
  }, [])

  /* ================= SCROLL SHADOW ================= */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token")
    router.replace("/login")
  }

  return (
    <nav
      className={`sticky top-0 z-50 bg-white transition-shadow ${
        scrolled ? "shadow-md" : "border-b"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-gray-900">
              SponsorMatch
            </span>
            <span className="text-xs font-medium text-gray-500">
              by LinkLogic
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <Link href="/events" className="hover:text-gray-900">Events</Link>
            <Link href="/organizer/dashboard" className="hover:text-gray-900">Organizers</Link>
            <Link href="/sponsor/dashboard" className="hover:text-gray-900">Sponsors</Link>
          </div>

          {/* RIGHT SIDE */}
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
                  <span className="text-gradient">
                    Create Free Account
                  </span>
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                {/* Avatar */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 transition text-white flex items-center justify-center font-semibold"
                >
                  {user?.role?.[0]?.toUpperCase()}
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-white border rounded-xl shadow-xl z-50 overflow-hidden">

                    {/* Header */}
                    <div className="px-4 py-4 border-b bg-gray-50">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Logged in as
                      </p>
                      <p className="font-semibold text-gray-800">
                        {user?.role?.[0]?.toUpperCase() + user?.role?.slice(1)}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {user?.email}
                      </p>
                    </div>
                    {/* About Profile */}
                    <button
                      onClick={() => router.push(`/${user.role}/profile`)}
                      className="block w-full text-left px-4 py-3 hover:bg-gray-100 transition"
                    >
                      About
                    </button>

                    {/* Dashboard */}
                    <button
                      onClick={() => {
                        setDropdownOpen(false)
                        router.push(`/${user.role}/dashboard`)
                      }}
                      className="block w-full text-left px-4 py-3 hover:bg-gray-100 transition"
                    >
                      Dashboard
                    </button>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE BUTTON */}
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
                  <span className="text-gradient">
                    Create Free Account
                  </span>
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
