export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";
export type PresenceStatus = "online" | "away" | "busy" | "offline";

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  presence?: PresenceStatus;
  lastSeen?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "file" | "system";
  status: MessageStatus;
  attachments?: Attachment[];
  replyTo?: string;
  editedAt?: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  size: number;
  thumbnailUrl?: string;
}

export interface Conversation {
  id: string;
  type: "direct" | "group";
  name?: string;
  avatar?: string;
  participants: Participant[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
}

export interface MessagingConfig {
  baseUrl: string;
  wsUrl?: string;
  pageSize?: number;
}
