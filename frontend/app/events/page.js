'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [attendees, setAttendees] = useState("");
const [type, setType] = useState("");
const [audience, setAudience] = useState("");
const [reach, setReach] = useState("");
const [experience, setExperience] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) return

    fetch('http://localhost:5000/api/auth/me', {
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

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('http://localhost:5000/api/events')
        const data = await res.json()
        if (data.success) setEvents(data.events)
      } catch (err) {
        console.error('Failed to fetch events', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const handleDelete = async (e, eventId) => {
    e.preventDefault()
    e.stopPropagation()

    const token = localStorage.getItem('authToken')
    if (!token) {
      alert('Please login as organizer')
      return
    }

    if (!window.confirm('Are you sure you want to delete this event?')) return

    const res = await fetch(`http://localhost:5000/api/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || 'Failed to delete event')
      return
    }

    setEvents(prev => prev.filter(e => e._id !== eventId))
  }

  return (
    <div
      className="min-h-screen flex flex-col text-gray-900 bg-gradient-to-b from-[#F8FBFF] via-white to-[#F3F7FF]"
    >
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
            {events.map(event => (
              <div
                key={event._id}
                className="
                  rounded-xl
                  shadow-lg
                  backdrop-blur-md
                  p-6
                  transition-all
                  duration-200
                  hover:scale-105
                  hover:shadow-indigo-500/30
                  flex
                  flex-col
                  justify-between
                "
                style={{
                  background: 'linear-gradient(to bottom, rgba(17, 24, 39, 0.96), rgba(31, 41, 55, 0.92), rgba(55, 65, 81, 0.88))'
                }}
              >
                <Link href={`/events/${event._id}`} className="block focus:outline-none text-gray-100">
                  <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {event.title}
                  </h2>

                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="text-sm text-gray-400 space-y-1">
                    <p>Location: {event.location}</p>
                    <p>Date: {new Date(event.date).toDateString()}</p>
                    <p>Budget: ₹{event.budget?.toLocaleString()}</p>
                    
                  </div>

                  <p className="text-sm text-gray-400 mt-2">
                    Organizer: {event.organizer?.name}
                  </p>
                </Link>

                {user?.role === 'organizer' && user?._id === event.organizer?._id && (
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, event._id)}
                    className="mt-4 text-sm bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg w-full"
                  >
                    Delete Event
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
