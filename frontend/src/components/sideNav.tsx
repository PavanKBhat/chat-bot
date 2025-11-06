import { useEffect, useState } from "react";
import { getConversations, createConversation } from "../api/chatApi";
import { Conversation } from "../types";

interface SideNavProps {
  onSelect: (id: number) => void;
}

export default function SideNav({ onSelect }: SideNavProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const loadConversations = async () => {
    const data = await getConversations();
    setConversations(data);
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const handleNewChat = async () => {
    const conv = await createConversation();
    loadConversations();
    onSelect(conv.id);
  };

  return (
    <div className="bg-white w-64 border-r h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold">History</h2>
        <button
          onClick={handleNewChat}
          className="bg-blue-600 text-white text-sm px-2 py-1 rounded"
        >
          + New
        </button>
      </div>
      <div className="overflow-y-auto flex-1">
        {conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c.id)}
            className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b text-sm"
          >
            {c.title}
          </div>
        ))}
      </div>
    </div>
  );
}
