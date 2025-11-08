import { useEffect, useState, useRef } from "react";
import { getConversations, createConversation, deleteConversation, renameConversation } from "../api/chatApi";
import { Conversation } from "../types";
interface SideNavProps {
  onSelect: (id: number) => void;
  activeId?: number | null;
}

export default function SideNav({ onSelect, activeId }: SideNavProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const menuRef = useRef<HTMLDivElement | null>(null);

  // Load all conversations
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

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
        setMenuPosition(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Create new conversation
  const handleNewChat = async () => {
    try {
      setCreating(true);
      const newConv = await createConversation("New Conversation");
      setConversations((prev) => [newConv, ...prev]);
      onSelect(newConv.id);
      setTimeout(loadConversations, 1000);
    } catch (err) {
      console.error("❌ Failed to create new chat:", err);
    } finally {
      setCreating(false);
    }
  };

  // Delete conversation
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this chat?")) return;
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (id === activeId) onSelect(0);
    } catch (err) {
      console.error("❌ Failed to delete:", err);
    } finally {
      setMenuOpenId(null);
    }
  };

  // Rename conversation
  const handleRename = async (id: number) => {
    if (!newTitle.trim()) return;
    try {
      await renameConversation(id, newTitle.trim());
      setConversations(prev =>
        prev.map(c =>
          c.id === id ? { ...c, title: newTitle.trim() } : c
        )
      );
      setEditingId(null);
      setMenuOpenId(null);
    } catch (err) {
      console.error("❌ Failed to rename:", err);
    }
  };

  return (
    <div className="bg-white w-64 border-r h-full flex flex-col relative">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold">History</h2>
        <button
          onClick={handleNewChat}
          disabled={creating}
          className={`${creating
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
              className={`relative px-4 py-2 border-b flex justify-between items-center text-sm truncate cursor-pointer ${c.id === activeId
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "hover:bg-blue-50 text-gray-700"
                }`}
            >
              {editingId === c.id ? (
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={() => handleRename(c.id)}
                  onKeyDown={(e) => e.key === "Enter" && handleRename(c.id)}
                  autoFocus
                  className="border rounded px-2 py-1 text-sm w-full focus:ring-2 focus:ring-blue-600 outline-none"
                />
              ) : (
                <span onClick={() => onSelect(c.id)} className="truncate flex-1">
                  {c.title || "Untitled Conversation"}
                </span>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = (e.target as HTMLElement).getBoundingClientRect();
                  setMenuPosition({ x: rect.right + 5, y: rect.top });
                  setMenuOpenId(menuOpenId === c.id ? null : c.id);
                }}
                className="ml-2 text-gray-500 hover:text-gray-700 opacity-60 hover:opacity-100"
              >
                ⋮
              </button>
            </div>
          ))
        )}
      </div>

      {/* Floating Context Menu */}
      {menuOpenId && menuPosition && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: menuPosition.y,
            left: menuPosition.x,
            zIndex: 1000,
          }}
          className="bg-white border shadow-lg rounded-md text-sm w-40"
        >
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              setEditingId(menuOpenId);
              const conv = conversations.find((c) => c.id === menuOpenId);
              setNewTitle(conv?.title || "");
            }}
          >
            Rename
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
            onClick={() => handleDelete(menuOpenId)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
