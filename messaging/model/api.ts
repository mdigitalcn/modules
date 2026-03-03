import type { Conversation, Message } from "./types";
import { MESSAGE_PAGE_SIZE } from "./constants";

export function createMessagingApi(config: { baseUrl: string; headers?: () => Record<string, string> }) {
  async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${config.baseUrl}${path}`, { ...options, headers: { "Content-Type": "application/json", ...config.headers?.(), ...options?.headers } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  return {
    getConversations: () => request<{ items: Conversation[] }>("/conversations"),
    getConversation: (id: string) => request<Conversation>(`/conversations/${id}`),
    createConversation: (participantIds: string[], name?: string) => request<Conversation>("/conversations", { method: "POST", body: JSON.stringify({ participantIds, name }) }),
    deleteConversation: (id: string) => request<void>(`/conversations/${id}`, { method: "DELETE" }),

    getMessages: (conversationId: string, cursor?: string) => request<{ items: Message[]; nextCursor?: string }>(`/conversations/${conversationId}/messages${cursor ? `?cursor=${cursor}&limit=${MESSAGE_PAGE_SIZE}` : `?limit=${MESSAGE_PAGE_SIZE}`}`),
    sendMessage: (conversationId: string, content: string, type: string = "text", replyTo?: string) => request<Message>(`/conversations/${conversationId}/messages`, { method: "POST", body: JSON.stringify({ content, type, replyTo }) }),
    editMessage: (conversationId: string, messageId: string, content: string) => request<Message>(`/conversations/${conversationId}/messages/${messageId}`, { method: "PATCH", body: JSON.stringify({ content }) }),
    deleteMessage: (conversationId: string, messageId: string) => request<void>(`/conversations/${conversationId}/messages/${messageId}`, { method: "DELETE" }),

    markAsRead: (conversationId: string) => request<void>(`/conversations/${conversationId}/read`, { method: "POST" }),
    togglePin: (conversationId: string) => request<void>(`/conversations/${conversationId}/pin`, { method: "POST" }),
    toggleMute: (conversationId: string) => request<void>(`/conversations/${conversationId}/mute`, { method: "POST" }),
  };
}

export type MessagingApi = ReturnType<typeof createMessagingApi>;
