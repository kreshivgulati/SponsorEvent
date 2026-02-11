"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export default function SponsorChatsPage() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/chats/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setChats(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FBFF]">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar  />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Chats</h1>
              <p className="text-gray-600">
                Conversations with organizers
              </p>
            </div>

            {loading && (
              <p className="text-gray-500">Loading chats...</p>
            )}

            {!loading && chats.length === 0 && (
              <div className="bg-white rounded-lg p-6 shadow">
                <p className="text-gray-500">No chats yet</p>
              </div>
            )}

            <div className="space-y-4">
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() =>
                    router.push(`/sponsor/chat/${chat._id}`)
                  }
                  className="bg-white rounded-lg p-5 shadow cursor-pointer hover:bg-gray-50"
                >
                  <p className="font-semibold">
                    Event: {chat.event?.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Organizer: {chat.organizer?.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
