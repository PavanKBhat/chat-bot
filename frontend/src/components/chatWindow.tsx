import { useEffect, useState, useRef } from "react";
import { getConversation, addMessage, createConversation } from "../api/chatApi";
import { Conversation, Message } from "../types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load conversation
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

  // Auto-scroll to bottom on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Send message
  const sendMessage = async () => {
    if (!msg.trim()) return;

    const userMessage: Message = { id: Date.now(), sender: user, content: msg };
    setMessages((prev) => [...prev, userMessage]);
    setMsg("");
    setLoading(true);

    let conv = conversation;

    //If conversation doesn’t exist, create once — not every message
    if (!conv) {
      const newConv = await createConversation(msg.slice(0, 40));
      setConversation(newConv);
      if (onNewConversation) onNewConversation(newConv.id);
      conv = newConv;
    }

    if (!conv) return;

    // Send message to backend
    const res = await addMessage(conv.id, { sender: user, content: msg });

    // Update chat instantly
    setMessages((prev) => [...prev, res.bot_message]);
    setLoading(false);
  };


  return (
    <div className="flex flex-col flex-1 bg-gray-50 min-w-[700px] max-w-[1000px] overflow-hidden">
      {/* Chat content area */}
      <div className="flex-1 p-4 overflow-y-auto max-w-full">
        {messages.length > 0 ? (
          messages.map((m) => (
            <div
              key={m.id}
              className={`mb-4 ${m.sender === user ? "text-right" : "text-left"}`}
            >
              <div
                className={`inline-block px-3 py-2 rounded-lg break-words max-w-[85%] overflow-hidden ${m.sender === user
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
                  }`}
              >
                <div className="overflow-x-auto">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        return !inline ? (
                          <pre className="overflow-x-auto bg-gray-900 text-white p-3 rounded-md text-sm">
                            <code {...props}>{children}</code>
                          </pre>
                        ) : (
                          <code className="bg-gray-800 text-white px-1 py-0.5 rounded">
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>

              {/*Timestamp below each message */}
              {m.created_at && (
                <p
                  className={`text-xs mt-1 text-gray-400 ${m.sender === user ? "text-right pr-1" : "text-left pl-1"
                    }`}
                >
                  {new Date(m.created_at).toLocaleString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    day: "2-digit",
                    month: "short",
                  })}
                </p>
              )}
            </div>

          ))
        ) : (
          // Default welcome screen
          <div className="flex flex-col items-center justify-center mt-16 text-gray-600 animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-4">Chat Bot</h2>
            <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-lg text-left text-gray-700">
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Built using <strong>Django REST Framework</strong> &{" "}
                  <strong>React</strong> + <strong>Tailwind</strong>
                </li>
                <li>
                  Real-time chat powered by <strong>Gemini API</strong>
                </li>
                <li>
                  Conversations stored securely in <strong>PostgreSQL</strong>
                </li>
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

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 border-t flex gap-2 bg-white">
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type your query..."
          className="border flex-1 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 text-white "
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={!msg.trim() || loading}
          className={`px-4 rounded text-white transition ${msg.trim() && !loading
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
