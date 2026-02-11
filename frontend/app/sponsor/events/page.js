"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function SponsorEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events");
        const data = await res.json();

        // backend returns { success: true, events }
        setEvents(data.events);

      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const showInterest = async (eventId) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/interests/${eventId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Interest sent to organizer");
  };

  return (
    <div
      className="min-h-screen flex flex-col text-white"
      style={{
        background:
          "linear-gradient(180deg, #021024, #052659, #5483B3, #7DA0CA, #C1E8FF)",
      }}
    >
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar  />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">
                Browse Events
              </h1>
              <p className="text-gray-300">
                Discover events seeking sponsors
              </p>
            </div>

            {loading && <p>Loading events...</p>}

            {!loading && events.length === 0 && (
              <p>No active events available</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
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
                    cursor-pointer
                  "
                  style={{
                    backgroundColor: "rgba(15, 23, 42, 0.85)",
                  }}
                  onClick={() =>
                    (window.location.href = `/events/${event._id}`)
                  }
                >
                  <h3 className="text-xl font-bold mb-2">
                    {event.title}
                  </h3>

                  <p className="text-sm text-gray-400 mb-4">
                    {event.description}
                  </p>

                  <div className="text-sm text-gray-400 space-y-1">
                    <p>
                      {formatDate(event.date)} · {event.location}
                    </p>
                    <p>
                      Budget {formatCurrency(event.budget)}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      showInterest(event._id);
                    }}
                    className="
                      mt-4
                      w-full
                      rounded-lg
                      bg-indigo-600
                      hover:bg-indigo-700
                      py-2
                      text-sm
                      font-semibold
                      text-white
                      transition
                    "
                  >
                    Show Interest
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
