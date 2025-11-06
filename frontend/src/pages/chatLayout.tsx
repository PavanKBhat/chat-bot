import { useState } from "react";
import SideNav from "../components/sideNav";
import ChatWindow from "../components/chatWindow";

export default function ChatLayout() {
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const user = localStorage.getItem("username") || "User"; // example — adjust based on your auth setup

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideNav
        activeId={activeConversationId}
        onSelect={(id) => setActiveConversationId(id)} 
      />

      {/* Chat window */}
      <div className="flex-1 flex flex-col">
        <ChatWindow
          conversationId={activeConversationId}
          user={user}
          onNewConversation={(id) => setActiveConversationId(id)} 
        />
      </div>
    </div>
  );
}
