import { useEffect, useState } from "react";
import { getConversation, addMessage, createConversation } from "../api/chatApi";
import { Conversation } from "../types";

interface ChatWindowProps {
  conversationId: number | null;
  user: string;
  onNewConversation?: (id: number) => void;
}

export default function ChatWindow({ conversationId, user, onNewConversation }: ChatWindowProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [msg, setMsg] = useState("");

  const loadConversation = async () => {
    if (!conversationId) {
      setConversation(null);
      return;
    }
    const data = await getConversation(conversationId);
    setConversation(data);
  };

  useEffect(() => {
    loadConversation();
  }, [conversationId]);

  const sendMessage = async () => {
    if (!msg.trim()) return;

    let conv = conversation;

    if (!conversationId) {
      conv = await createConversation(msg.slice(0, 40));
      if (onNewConversation) onNewConversation(conv.id);
      setConversation(conv);
    }

    await addMessage(conv!.id, { sender: user, content: msg });
    setMsg("");
    loadConversation();
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-50">
      {/* Messages or Intro Section */}
      <div className="flex-1 p-4 overflow-y-auto">
        {conversation && conversation.messages.length > 0 ? (
          conversation.messages.map((m) => (
            <div key={m.id} className={`mb-3 ${m.sender === user ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block px-3 py-2 rounded-lg ${
                  m.sender === user ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center mt-16 text-gray-600 animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-4"> Chat Bot </h2>
            <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-lg text-left text-gray-700">
              <ul className="list-disc list-inside space-y-2">
                <li>Built using <strong>Django REST Framework</strong> & <strong>React</strong> <strong>, Tailwind</strong></li>
                <li>Real-time chat experience powered by <strong>Gemini API</strong></li>
                <li>All conversations stored securely in <strong>PostgreSQL</strong></li>
                <li>Authentication managed via <strong>JWT tokens</strong></li>
                <li>Designed for the <strong>Full Stack Developer Assignment</strong></li>
              </ul>
            </div>
            <p className="mt-6 text-gray-400 text-sm italic">
              Start chatting by typing below 👇
            </p>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-3 border-t flex gap-2 bg-white">
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type your message..."
          className="border flex-1 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={!msg.trim()}
          className={`px-4 rounded text-white transition ${
            msg.trim()
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
