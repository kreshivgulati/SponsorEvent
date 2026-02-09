"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function OrganizerNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/interests/organizer", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data.interests || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load notifications", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FBFF]">
      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= MAIN LAYOUT ================= */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar type="organizer" />

        {/* Content */}
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                Notifications
              </h1>
              <p className="text-gray-600">
                Sponsor interests for your events
              </p>
            </div>

            {/* Loading */}
            {loading && (
              <p className="text-gray-500">
                Loading notifications...
              </p>
            )}

            {/* Empty */}
            {!loading && notifications.length === 0 && (
              <div className="bg-white rounded-lg p-6 shadow">
                <p className="text-gray-500">
                  No sponsor interests yet
                </p>
              </div>
            )}

            {/* Notifications List */}
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
  (<span className="text-blue-600">{n.sponsor.email}</span>){" "}
  is interested in{" "}
  <span className="font-semibold">
    {n.event.title}
  </span>
</p>

                    <p className="text-sm text-gray-500 mt-1">
                      Status:{" "}
                      <span className="capitalize">
                        {n.status}
                      </span>
                    </p>
                  </div>

                  {/* (future buttons go here) */}
                  {/* Accept / Reject */}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
}
