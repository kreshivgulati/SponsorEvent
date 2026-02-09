// app/(private)/sponsor/chat/[organizerId]/page.tsx
import ChatUI from "@/components/ChatUI";
import { redirect } from "next/navigation";

/**
 * SERVER COMPONENT
 * Responsible ONLY for:
 * - Auth validation
 * - Chat creation/fetch
 * - Passing data to ChatUI
 */
export default async function SponsorChat({
  params,
}: {
  params: { organizerId: string };
}) {
  const token = getToken(); // ⬅️ replace with your token retrieval logic
  const role = "sponsor";

  if (!token) redirect("/login");

  /**
   * Create or fetch chat
   * sponsor ↔ organizer only
   */
  const res = await fetch(`${process.env.API_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      otherUserId: params.organizerId,
    }),
    cache: "no-store", // IMPORTANT for real-time correctness
  });

  if (!res.ok) {
    redirect("/select-role");
  }

  const chat = await res.json();

  return (
    <ChatUI
      chatId={chat._id}
      role={role}
      token={token}
    />
  );
}

/**
 * Example helper
 * Replace with cookies(), headers(), or auth provider
 */
function getToken() {
  // e.g. cookies().get("token")?.value
  return process.env.DEV_TOKEN || null;
}
