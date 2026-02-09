'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'
import EventCard from '@/components/EventCard'
import { mockEvents } from '@/frontend/lib/mockData'
import Link from 'next/link'

export default function OrganizerEventsPage() {
  const myEvents = mockEvents

  // Smooth scroll handler
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  // Navigation items configuration
  const navItems = [
    { label: 'Find Events', sectionId: 'find-events' },
    { label: 'Connect & Negotiate', sectionId: 'connect-sponsors' },
    { label: 'Privacy & Payments', sectionId: 'secure-transactions' },
    { label: 'Register for Free', sectionId: 'find-events', isCTA: true }
  ]

  return (
    <div
      className="
        min-h-screen
        flex
        flex-col
        text-gray-900
        bg-gradient-to-b
        from-[#F8FBFF]
        via-white
        to-[#F3F7FF]
      "
    >
      <Navbar />
      
      <div className="flex-1 flex">
        <Sidebar type="organizer" />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Horizontal Navigation Bar */}
            <nav className="mb-8 bg-gray-900 rounded-lg border border-gray-800 p-4">
              <div className="flex flex-wrap items-center justify-center gap-4">
                {navItems.map((item) => (
                  <button
                    key={item.sectionId + item.label}
                    onClick={() => scrollToSection(item.sectionId)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      item.isCTA
                        ? 'btn-cta-gradient-dark'
                        : 'text-gray-300 hover:text-primary-400 hover:bg-gray-800'
                    }`}
                  >
                    {item.isCTA ? <span className="text-gradient">{item.label}</span> : item.label}
                  </button>
                ))}
              </div>
            </nav>

            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">My Events</h1>
                <p className="text-gray-600">Manage all your events and track sponsorship progress</p>
              </div>
              <Link href="/events/create" className="btn-cta-gradient">
                <span className="text-gradient">Create Event</span>
              </Link>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4">
              <select className="input-field w-full sm:w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Draft</option>
                <option>Completed</option>
              </select>
              <select className="input-field w-full sm:w-auto">
                <option>All Categories</option>
                <option>Technology</option>
                <option>Business</option>
                <option>Startup</option>
              </select>
            </div>

            {/* Events Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Content Sections */}
            <section id="secure-transactions" className="mt-20 py-12">
              <div className="card">
                <h2 className="text-3xl font-bold mb-4">Privacy & Payments</h2>
                <p className="text-gray-400 mb-6">
                  Secure transactions and privacy protection for all your sponsorship deals.
                </p>
                {/* Add your first image here */}
                <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">First Image Placeholder</span>
                </div>
              </div>
            </section>

            <section id="connect-sponsors" className="mt-20 py-12">
              <div className="card">
                <h2 className="text-3xl font-bold mb-4">Connect & Negotiate</h2>
                <p className="text-gray-400 mb-6">
                  Connect with sponsors and negotiate deals seamlessly through our platform.
                </p>
                {/* Add your second image here */}
                <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Second Image Placeholder</span>
                </div>
              </div>
            </section>

            <section id="find-events" className="mt-20 py-12">
              <div className="card">
                <h2 className="text-3xl font-bold mb-4">Find Events</h2>
                <p className="text-gray-400 mb-6">
                  Discover and register for events that match your interests and goals.
                </p>
                {/* Add your third image here */}
                <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Third Image Placeholder</span>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  )
}

