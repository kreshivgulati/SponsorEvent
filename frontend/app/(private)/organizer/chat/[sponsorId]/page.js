// app/(private)/organizer/chat/[sponsorId]/page.js
import ChatUI from "@/components/ChatUI";

export default function OrganizerChat({ params }) {
  const chatId = "FETCH_OR_CREATE_CHAT_ID";
  const user = { role: "organizer" };

  return <ChatUI chatId={chatId} user={user} />;
}
