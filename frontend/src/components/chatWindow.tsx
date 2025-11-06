import { useEffect, useState } from "react";
import { getConversation, addMessage, createConversation } from "../api/chatApi";
import { Conversation, Message } from "../types";

interface ChatWindowProps {
  conversationId: number | null;
  user: string;
  onNewConversation?: (id: number) => void;
}

export default function ChatWindow({ conversationId, user, onNewConversation }: ChatWindowProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const loadConversation = async () => {
    if (!conversationId) {
      setConversation(null);
      setMessages([]);
      return;
    }
    const data = await getConversation(conversationId);
    setConversation(data);
    setMessages(data.messages);
  };

  useEffect(() => {
    loadConversation();
  }, [conversationId]);

  const sendMessage = async () => {
    if (!msg.trim()) return;

    const userMessage: Message = {
      id: Date.now(), 
      sender: user,
      content: msg,
    };

   
    setMessages((prev) => [...prev, userMessage]);
    setMsg("");

    let conv = conversation;

    if (!conversationId) {
      const newConv = await createConversation(msg.slice(0, 40));
      if (onNewConversation) onNewConversation(newConv.id);
      setConversation(newConv);
      conv = newConv;
    }

    if (!conv) return;

    await addMessage(conv.id, { sender: user, content: msg });

    setLoading(true);
    setTimeout(async () => {
      const botResponse = "This is a static response from your backend (mock AI 🤖)";
      const botMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        content: botResponse,
      };

      setMessages((prev) => [...prev, botMessage]);

      await addMessage(conv!.id, { sender: "bot", content: botResponse });
      setLoading(false);
    }, 700); 
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-50">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((m) => (
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
                <li>
                  Built using <strong>Django REST Framework</strong> & <strong>React</strong> + <strong>Tailwind</strong>
                </li>
                <li>Real-time chat experience powered by <strong>Gemini API</strong> (mocked)</li>
                <li>Conversations stored securely in <strong>PostgreSQL</strong></li>
                <li>Auth handled via <strong>JWT tokens</strong></li>
              </ul>
            </div>
            <p className="mt-6 text-gray-400 text-sm italic animate-typing overflow-hidden whitespace-nowrap border-r-2 border-gray-400 pr-2">
              Start chatting by typing below 👇
            </p>
          </div>
        )}
        {loading && (
          <div className="text-left">
            <div className="inline-block px-3 py-2 rounded-lg bg-gray-200 text-gray-500 italic animate-pulse">
              Bot is typing...
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t flex gap-2 bg-white">
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type your query..."
          className="border flex-1 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 text-white"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={!msg.trim() || loading}
          className={`px-4 rounded text-white transition ${
            msg.trim() && !loading
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
