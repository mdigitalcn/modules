import type { Meta, StoryObj } from "@storybook/react";
import { useActiveConversation, useMessageList, useTypingIndicators, useTotalUnread } from "./model/hooks";
import { PRESENCE_CONFIG, MESSAGE_STATUS_LABELS } from "./model/constants";
import type { Conversation, Message } from "./model/types";

const mockConversations: Conversation[] = [
  { id: "c1", type: "direct", participants: [{ id: "u1", name: "Alice", presence: "online" }, { id: "u2", name: "Bob", presence: "away" }], unreadCount: 3, createdAt: "2025-01-01", updatedAt: "2025-12-20", lastMessage: { id: "m1", conversationId: "c1", senderId: "u1", content: "Hey, how's it going?", type: "text", status: "read", createdAt: new Date(Date.now() - 60000).toISOString() } },
  { id: "c2", type: "group", name: "Project Team", participants: [{ id: "u1", name: "Alice" }, { id: "u3", name: "Charlie" }, { id: "u4", name: "Diana" }], unreadCount: 0, createdAt: "2025-01-01", updatedAt: "2025-12-19", isPinned: true },
  { id: "c3", type: "direct", participants: [{ id: "u5", name: "Eve", presence: "offline" }], unreadCount: 12, isMuted: true, createdAt: "2025-01-01", updatedAt: "2025-12-18" },
];

const mockMessages: Message[] = [
  { id: "m1", conversationId: "c1", senderId: "u1", content: "Hey! Ready for the meeting?", type: "text", status: "read", createdAt: new Date(Date.now() - 300000).toISOString() },
  { id: "m2", conversationId: "c1", senderId: "me", content: "Almost! Give me 5 minutes", type: "text", status: "delivered", createdAt: new Date(Date.now() - 240000).toISOString() },
  { id: "m3", conversationId: "c1", senderId: "u1", content: "Sure, no rush 👍", type: "text", status: "sent", createdAt: new Date(Date.now() - 180000).toISOString() },
];

function ConversationListDemo() {
  const { activeId, setActiveId, conversations, setConversations } = useActiveConversation();
  const totalUnread = useTotalUnread(conversations.length ? conversations : mockConversations);

  if (!conversations.length) setConversations(mockConversations);

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 360 }}>
      <div style={{ padding: 12, background: "#f9fafb", borderRadius: 8, marginBottom: 12, fontSize: 13 }}>
        Total unread: <strong>{totalUnread}</strong>
      </div>
      {(conversations.length ? conversations : mockConversations).map((conv) => (
        <div
          key={conv.id}
          onClick={() => setActiveId(conv.id)}
          style={{
            display: "flex", alignItems: "center", gap: 12, padding: 12, cursor: "pointer",
            borderRadius: 8, marginBottom: 4,
            background: activeId === conv.id ? "#eff6ff" : "transparent",
          }}
        >
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, position: "relative" }}>
            {conv.type === "group" ? "👥" : conv.participants[0]?.name[0]}
            {conv.type === "direct" && conv.participants[0]?.presence && (
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: PRESENCE_CONFIG[conv.participants[0].presence]?.color ?? "#6b7280", border: "2px solid white" }} />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14, display: "flex", gap: 4, alignItems: "center" }}>
              {conv.isPinned && "📌"}{conv.isMuted && "🔇"}{conv.name ?? conv.participants.map((p) => p.name).join(", ")}
            </div>
            {conv.lastMessage && (
              <div style={{ fontSize: 13, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conv.lastMessage.content}</div>
            )}
          </div>
          {conv.unreadCount > 0 && (
            <div style={{ background: "#3b82f6", color: "white", borderRadius: 10, padding: "2px 8px", fontSize: 12, fontWeight: 600 }}>{conv.unreadCount}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function MessageListDemo() {
  const { messages, addMessage, updateMessage, removeMessage, reset } = useMessageList();

  if (!messages.length) mockMessages.forEach((m) => addMessage(m));

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 400 }}>
      <div style={{ maxHeight: 300, overflowY: "auto", marginBottom: 16 }}>
        {messages.map((msg) => {
          const isMine = msg.senderId === "me";
          return (
            <div key={msg.id} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start", marginBottom: 8 }}>
              <div style={{ maxWidth: "75%", padding: "8px 12px", borderRadius: 12, background: isMine ? "#3b82f6" : "#f3f4f6", color: isMine ? "white" : "#111" }}>
                <div style={{ fontSize: 14 }}>{msg.content}</div>
                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2, textAlign: "right" }}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  {isMine && ` · ${MESSAGE_STATUS_LABELS[msg.status]}`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => addMessage({ id: `m-${Date.now()}`, conversationId: "c1", senderId: "me", content: "New message! 🎉", type: "text", status: "sending", createdAt: new Date().toISOString() })}
          style={{ padding: "6px 12px", background: "#3b82f6", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
        >
          Send Message
        </button>
        <button onClick={reset} style={{ padding: "6px 12px", border: "1px solid #d1d5db", borderRadius: 6, background: "white", cursor: "pointer", fontSize: 13 }}>Reset</button>
      </div>
    </div>
  );
}

function TypingDemo() {
  const { typing, addTyping, getTyping } = useTypingIndicators();

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 400 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["Alice", "Bob", "Charlie"].map((name) => (
          <button
            key={name}
            onClick={() => addTyping({ conversationId: "c1", userId: name.toLowerCase(), userName: name })}
            style={{ padding: "6px 12px", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
          >
            {name} starts typing
          </button>
        ))}
      </div>
      <div style={{ minHeight: 24, fontSize: 13, color: "#6b7280", fontStyle: "italic" }}>
        {getTyping("c1").length > 0
          ? `${getTyping("c1").map((t) => t.userName).join(", ")} ${getTyping("c1").length === 1 ? "is" : "are"} typing...`
          : "No one is typing"}
      </div>
      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>Typing indicators auto-clear after 3 seconds</div>
    </div>
  );
}

const meta: Meta = {
  title: "Modules/Messaging",
  parameters: { layout: "padded" },
};
export default meta;

export const ConversationList: StoryObj = { render: () => <><h3 style={{ fontFamily: "system-ui", marginBottom: 16 }}>Conversations</h3><ConversationListDemo /></> };
export const Messages: StoryObj = { render: () => <><h3 style={{ fontFamily: "system-ui", marginBottom: 16 }}>Message List</h3><MessageListDemo /></> };
export const TypingIndicators: StoryObj = { render: () => <><h3 style={{ fontFamily: "system-ui", marginBottom: 16 }}>Typing Indicators</h3><TypingDemo /></> };

export const PresenceStatuses: StoryObj = {
  render: () => (
    <div style={{ fontFamily: "system-ui" }}>
      <h3 style={{ marginBottom: 16 }}>Presence Config</h3>
      {Object.entries(PRESENCE_CONFIG).map(([key, config]) => (
        <div key={key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: config.color }} />
          <span style={{ fontWeight: 600 }}>{config.label}</span>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>({key})</span>
        </div>
      ))}
    </div>
  ),
};
