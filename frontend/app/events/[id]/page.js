"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { mockEvents, mockSponsors } from "@/frontend/lib/mockData";
import Link from "next/link";
import SponsorCard from "@/components/SponsorCard";

export default function EventDetailsPage({ params }) {
  const router = useRouter();

  // ⚠️ eventId must match MongoDB _id for backend chat
  const event = mockEvents.find(e => e.id === params.eventId);
  const eventSponsors = mockSponsors.filter(s =>
    event?.sponsors?.includes(s.id)
  );

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
          <Link href="/events" className="btn-primary">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  // ======================
  // START CHAT (SPONSOR)
  // ======================
  const startChat = async () => {
    const token = localStorage.getItem("token"); // ✅ MUST MATCH auth-callback

    if (!token) {
      alert("Please login as sponsor");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/chats/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: event.id, // ⚠️ must be MongoDB _id
          initialMessage: "Hi! I'm interested in sponsoring this event.",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to start chat");
        return;
      }

      // ✅ redirect to chat screen
      router.push(`/chats/${data.chat._id}`);
    } catch (err) {
      console.error(err);
      alert("Server error while starting chat");
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-black">
        {/* Hero */}
        <div className="relative h-96 w-full">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute bottom-0 p-8 text-white max-w-7xl mx-auto">
            <span className="bg-green-600 px-3 py-1 rounded-full text-sm">
              {event.category}
            </span>
            <h1 className="text-4xl font-bold mt-3">{event.title}</h1>
          </div>
        </div>

        {/* CHAT BUTTON */}
        <div className="max-w-7xl mx-auto px-4 mt-6">
          <button
            onClick={startChat}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            💬 Message Organizer
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-8">
          {/* MAIN */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <p>{event.description}</p>
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Event Details</h2>
              <p>Date: {formatDate(event.date)}</p>
              <p>Location: {event.location}</p>
              <p>Attendees: {event.expectedAttendees}</p>
              <p>Budget: {formatCurrency(event.budget)}</p>
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Organizer</h2>
              <p>{event.organizer.name}</p>
              <p>{event.organizer.email}</p>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="card sticky top-20">
            <h3 className="text-xl font-bold mb-4">
              Sponsorship Opportunity
            </h3>
            <p className="mb-6">
              Connect with the organizer to discuss partnerships.
            </p>
          </div>
        </div>

        {/* SPONSORS */}
        {eventSponsors.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 pb-12">
            <h2 className="text-3xl font-bold mb-6">Current Sponsors</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {eventSponsors.map((s) => (
                <SponsorCard key={s.id} sponsor={s} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
