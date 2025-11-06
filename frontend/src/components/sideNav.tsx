import { useEffect, useState } from "react";
import { getConversations, createConversation } from "../api/chatApi";
import { Conversation } from "../types";

interface SideNavProps {
  onSelect: (id: number) => void;
  activeId?: number | null;
}

export default function SideNav({ onSelect, activeId }: SideNavProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // ✅ Load user’s past chats
  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      console.error("❌ Failed to load conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // ✅ Create new chat (instant + update history)
  const handleNewChat = async () => {
    try {
      setCreating(true);
      const newConv = await createConversation("New Conversation");
      
      // Instantly add to sidebar list
      setConversations((prev) => [newConv, ...prev]);

      // Auto-select it for chat window
      onSelect(newConv.id);

      // Refresh in background for consistency
      setTimeout(loadConversations, 1000);
    } catch (err) {
      console.error("❌ Failed to create new chat:", err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="bg-white w-64 border-r h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold">History</h2>
        <button
          onClick={handleNewChat}
          disabled={creating}
          className={`${
            creating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white text-sm px-2 py-1 rounded`}
        >
          + New
        </button>
      </div>

      {/* Chat list */}
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <p className="p-4 text-gray-500 text-sm">Loading chats...</p>
        ) : conversations.length === 0 ? (
          <p className="p-4 text-gray-400 text-sm italic">No past chats yet.</p>
        ) : (
          conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`px-4 py-2 cursor-pointer border-b text-sm truncate transition ${
                c.id === activeId
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "hover:bg-blue-50 hover:rounded-lg hover:shadow-sm text-gray-700"
              }`}
            >
              {c.title || "Untitled Conversation"}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
