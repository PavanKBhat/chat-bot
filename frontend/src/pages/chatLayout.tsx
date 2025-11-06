import { useState } from "react";
import TopNav from "../components/topNav";
import SideNav from "../components/sideNav";
import ChatWindow from "../components/chatWindow"
interface ChatLayoutProps {
  user: string;
  onLogout: () => void;
  onLogin: () => void;
}

export default function ChatLayout({ user, onLogout, onLogin }: ChatLayoutProps) {
  const [selectedConv, setSelectedConv] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-screen">
      <TopNav user={user} onLogout={onLogout} onLogin={onLogin}/>
      <div className="flex flex-1 overflow-hidden">
        <SideNav onSelect={setSelectedConv} />
        <ChatWindow conversationId={selectedConv} user={user} />
      </div>
    </div>
  );
}
