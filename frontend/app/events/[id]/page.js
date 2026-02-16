"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EventDetailsPage({ params }) {
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${params.id}`
        );
        const data = await res.json();

        if (data.success) {
          setEvent(data.event);
        }
      } catch (err) {
        console.error("Failed to fetch event", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.id]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading event...</p>
      </div>
    );
  }

  // Not Found
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <Link
            href="/events"
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const startChat = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login as sponsor");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats/initiate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            eventId: event._id,
            initialMessage:
              "Hi! I'm interested in sponsoring this event.",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to start chat");
        return;
      }

      router.push(`/chats/${data.chat._id}`);
    } catch (err) {
      console.error(err);
      alert("Server error while starting chat");
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />

      {/* Hero Section */}
      {/* Hero */}
<div className="relative w-full h-[420px] overflow-hidden">
  <img
    src={event.image}
    alt={event.title}
    className="absolute inset-0 w-full h-full object-contain bg-black"
  />

  <div className="absolute inset-0 bg-black/50" />

  <div className="absolute bottom-8 left-8 text-white">
    <span className="bg-indigo-600 px-3 py-1 rounded-full text-sm">
      {event.type}
    </span>
    <h1 className="text-4xl font-bold mt-3">
      {event.title}
    </h1>
  </div>
</div>

      {/* Chat Button */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <button
          onClick={startChat}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          💬 Message Organizer
        </button>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-10">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-xl shadow border">
            <h2 className="text-2xl font-bold mb-4">
              About This Event
            </h2>
            <p className="text-gray-700">
              {event.description}
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow border space-y-3">
            <h2 className="text-2xl font-bold mb-4">
              Event Details
            </h2>
            <p>Date: {formatDate(event.startDate)} - {formatDate(event.endDate)}</p>
            <p>Location: {event.location}</p>
            <p>Budget: {formatCurrency(event.budget)}</p>
            <p>Expected Attendees: {event.attendees}</p>
            <p>Target Audience: {event.audience?.join?.(", ") || event.audience}</p>

            <div className="pt-4">
              <h3 className="font-semibold mb-2">
                Social Reach
              </h3>
              <p>Instagram: {event.socialReach?.instagram || 0}</p>
              <p>LinkedIn: {event.socialReach?.linkedin || 0}</p>
             
            </div>

            <div className="pt-4">
              <h3 className="font-semibold mb-2">
                Past Experience
              </h3>
              <p>
Recurring: {event.pastExperience?.isRecurring ? "Yes" : "No"}              </p>
              <p>
                Editions:{" "}
                {event.pastExperience?.editions || 0}
              </p>
              <p>
                Highest Attendance:{" "}
                {event.pastExperience?.highestAttendance || 0}
              </p>
              <p>
                Notable Sponsors:{" "}
                {event.pastExperience?.notableSponsors || "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow border">
            <h2 className="text-2xl font-bold mb-4">
              Organizer
            </h2>
            <p>{event.organizer?.name}</p>
            <p className="text-gray-600">
              {event.organizer?.email}
            </p>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="bg-white p-8 rounded-xl shadow border h-fit">
          <h3 className="text-xl font-bold mb-4">
            Sponsorship Opportunity
          </h3>
          <p className="text-gray-600">
            Interested in partnering with this event?
            Connect with the organizer to explore
            sponsorship opportunities.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}