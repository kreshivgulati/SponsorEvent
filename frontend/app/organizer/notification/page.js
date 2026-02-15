"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function OrganizerNotificationsPage() {
  const router = useRouter(); // ✅ hook inside component

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

 const startChat = async (notification) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/chats`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sponsorId: notification.sponsor._id,
          eventId: notification.event._id,
        }),
      }
    );

    if (!res.ok) throw new Error("Failed to create chat");

    const chat = await res.json();

    router.push(`/organizer/chat/${chat._id}`);
  } catch (err) {
    console.error("Chat start failed", err);
    alert("Could not start chat");
  }
};

      

 useEffect(() => {
  const token = localStorage.getItem("token");

  fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/interests/organizer`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      setNotifications(data.interests || []);
      setLoading(false);
    })
    .catch(() => setLoading(false));
}, []);
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FBFF]">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar  />

        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Notifications</h1>
              <p className="text-gray-600">
                Sponsor interests for your events
              </p>
            </div>

            {loading && (
              <p className="text-gray-500">Loading notifications...</p>
            )}

            {!loading && notifications.length === 0 && (
              <div className="bg-white rounded-lg p-6 shadow">
                <p className="text-gray-500">No sponsor interests yet</p>
              </div>
            )}

            <div className="space-y-4">
              {notifications.map((n) => (
                <div
                  key={n._id}
                  className="bg-white rounded-lg p-5 shadow flex justify-between items-center"
                >
                  <div>
                    <p className="text-gray-900 font-medium">
                      <span className="font-semibold">
                        {n.sponsor.name}
                      </span>{" "}
                      (<span className="text-blue-600">
                        {n.sponsor.email}
                      </span>) is interested in{" "}
                      <span className="font-semibold">
{n.event?.title || "Deleted Event"}                      </span>
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Status:{" "}
                      <span className="capitalize">{n.status}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => startChat(n)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Chat
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
