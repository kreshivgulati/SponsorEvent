'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import EventCard from '@/components/EventCard'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  // Get logged in user
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) return

     fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setUser(data.user)
      })
      .catch(() => {})
  }, [])

  // Fetch events
 useEffect(() => {
  async function fetchEvents() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events`
      );

      const data = await res.json();

      if (data.success) {
        setEvents(data.events);
        console.log(data.events);
      }
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  }

  fetchEvents();
}, []);

  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-gradient-to-b from-[#F8FBFF] via-white to-[#F3F7FF]">
      <Navbar />

      <div className="flex-1 px-6 py-12 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Browse Events</h1>

          {user?.role === 'organizer' && (
            <Link
              href="/events/create"
              className="bg-indigo-600 text-white px-5 py-2.5 text-sm font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              Create Event
            </Link>
          )}
        </div>

        {loading && (
          <p className="text-gray-600">Loading events...</p>
        )}

        {!loading && events.length === 0 && (
          <p className="text-gray-600">No events found.</p>
        )}

        {!loading && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}