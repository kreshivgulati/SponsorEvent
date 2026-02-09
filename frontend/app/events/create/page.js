'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function CreateEventPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    budget: '',
  })

  const [loading, setLoading] = useState(false)

  // ✅ Block non-logged-in users
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login as organizer')
      router.push('/login')
    }
  }, [router])

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        alert('Session expired. Please login again.')
        router.push('/login')
        return
      }

      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          date: formData.date,
          location: formData.location,
          budget: Number(formData.budget),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || 'Failed to create event')
        return
      }

      alert('✅ Event created successfully!')
      router.push('/events')

    } catch (err) {
      console.error(err)
      alert('Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />

      <div className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/events" className="text-primary-500 mb-4 inline-block">
            ← Back to Events
          </Link>

          <h1 className="text-4xl font-bold mb-6">Create New Event</h1>

          <form
            onSubmit={handleSubmit}
            className="bg-gray-900 p-8 rounded-xl space-y-6"
          >
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              className="input-field"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Event Description"
              className="input-field"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="date"
              className="input-field"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              className="input-field"
              value={formData.location}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="budget"
              placeholder="Budget (INR)"
              className="input-field"
              value={formData.budget}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}
