export interface Message {
  id: number;
  sender: string;
  content: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  title: string;
  status: string;
  started_at: string;
  ended_at?: string;
  summary?: string;
  metadata?: Record<string, any>;
  messages: Message[];
}
