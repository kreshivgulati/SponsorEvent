"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import io from "socket.io-client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export default function SponsorChatPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);

  /* ================= FETCH OLD MESSAGES ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");

    const loadMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/message/${chatId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch messages");
      }
    };

    if (chatId) loadMessages();
  }, [chatId]);

  /* ================= SOCKET SETUP ================= */
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    socketRef.current.emit("join-chat", chatId);

    socketRef.current.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [chatId]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!text.trim()) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chatId, text }),
      });

      const newMessage = await res.json();

      // Optimistic update
      setMessages((prev) => [...prev, newMessage]);
      setText("");
    } catch (err) {
      console.error("Send failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FBFF]">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar type="sponsor" />

        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6 h-[75vh] flex flex-col">

            <h1 className="text-xl font-semibold mb-4">
              Sponsor Chat
            </h1>

            {/* ================= MESSAGES ================= */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {messages.map((m) => (
                <div
                  key={m._id}
                  className={`p-2 rounded max-w-xs ${
                    m.senderRole === "sponsor"
                      ? "bg-blue-600 text-white ml-auto"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            {/* ================= INPUT ================= */}
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
