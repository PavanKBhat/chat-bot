import { Conversation, Message } from "../types";

const BASE_URL = "http://localhost:8000/api";

export async function getConversations(): Promise<Conversation[]> {
  const res = await fetch(`${BASE_URL}/conversations/`);
  const data = await res.json();
  return data.results || data;
}

export async function getConversation(id: number): Promise<Conversation> {
  const res = await fetch(`${BASE_URL}/conversations/${id}/`);
  return res.json();
}

export async function createConversation(title = "New Chat"): Promise<Conversation> {
  const res = await fetch(`${BASE_URL}/conversations/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return res.json();
}

export async function addMessage(
  conversationId: number,
  data: { sender: string; content: string }
): Promise<Message> {
  const res = await fetch(`${BASE_URL}/conversations/${conversationId}/messages/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
