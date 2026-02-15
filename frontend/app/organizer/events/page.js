"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import EventCard from "@/components/EventCard";
import Link from "next/link";

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/events/organizer`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
        const data = await res.json();

        if (data.success) {
          setEvents(data.events);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-gradient-to-b from-[#F8FBFF] via-white to-[#F3F7FF]">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">

            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">My Events</h1>
                <p className="text-gray-600">
                  Manage all your events and track sponsorship progress
                </p>
              </div>
              <Link href="/events/create" className="btn-cta-gradient">
                <span className="text-gradient">Create Event</span>
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-10 text-gray-500">
                Loading events...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.length > 0 ? (
                  events.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500 py-10">
                    No events found. Create your first event 🚀
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}