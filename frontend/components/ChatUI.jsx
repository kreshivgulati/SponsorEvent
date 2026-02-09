"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function ChatUI({ chatId, role, token }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  /**
   * 1️⃣ Fetch chat history
   */
  useEffect(() => {
    setLoading(true);

    fetch(`http://localhost:5000/routes/chat/${chatId}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [chatId, token]);

  /**
   * 2️⃣ Socket join + receive messages
   */
  useEffect(() => {
    socket.emit("join-chat", chatId);

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [chatId]);

  /**
   * 3️⃣ Auto-scroll
   */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * 4️⃣ Send message
   * - Save to backend
   * - Then emit via socket
   */
  const sendMessage = async () => {
    if (!text.trim()) return;

    const res = await fetch(
      `http://localhost:5000/routes/chat/${chatId}/message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      }
    );

    const msg = await res.json();

    setMessages((prev) => [...prev, msg]);
    socket.emit("send-message", { chatId, message: msg });

    setText("");
  };

  if (loading) return <p>Loading chat…</p>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`mb-2 flex ${
              m.senderRole === role ? "justify-end" : "justify-start"
            }`}
          >
            <span className="inline-block px-3 py-2 bg-gray-200 rounded">
              {m.text}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 flex gap-2 border-t">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded px-3"
          placeholder="Type a message"
        />
        <button onClick={sendMessage} className="px-4 bg-black text-white">
          Send
        </button>
      </div>
    </div>
  );
}
