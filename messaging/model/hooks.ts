"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import type { Conversation, Message, TypingIndicator } from "./types";
import { TYPING_TIMEOUT_MS } from "./constants";

/** Manage active conversation state */
export function useActiveConversation() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const activeConversation = useMemo(() => conversations.find((c) => c.id === activeId) ?? null, [conversations, activeId]);

  const updateConversation = useCallback((id: string, updates: Partial<Conversation>) => {
    setConversations((prev) => prev.map((c) => c.id === id ? { ...c, ...updates } : c));
  }, []);

  return { activeId, setActiveId, activeConversation, conversations, setConversations, updateConversation };
}

/** Message list with pagination */
export function useMessageList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  const addMessage = useCallback((msg: Message) => setMessages((prev) => [...prev, msg]), []);
  const prependMessages = useCallback((msgs: Message[], nextCursor?: string) => {
    setMessages((prev) => [...msgs, ...prev]);
    setCursor(nextCursor);
    if (!nextCursor) setHasMore(false);
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, ...updates } : m));
  }, []);

  const removeMessage = useCallback((id: string) => setMessages((prev) => prev.filter((m) => m.id !== id)), []);

  const reset = useCallback(() => { setMessages([]); setHasMore(true); setCursor(undefined); }, []);

  return { messages, hasMore, cursor, addMessage, prependMessages, updateMessage, removeMessage, reset };
}

/** Typing indicators */
export function useTypingIndicators() {
  const [typing, setTyping] = useState<TypingIndicator[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const addTyping = useCallback((indicator: TypingIndicator) => {
    const key = `${indicator.conversationId}:${indicator.userId}`;
    setTyping((prev) => prev.some((t) => t.conversationId === indicator.conversationId && t.userId === indicator.userId) ? prev : [...prev, indicator]);

    const existing = timersRef.current.get(key);
    if (existing) clearTimeout(existing);
    timersRef.current.set(key, setTimeout(() => {
      setTyping((prev) => prev.filter((t) => !(t.conversationId === indicator.conversationId && t.userId === indicator.userId)));
      timersRef.current.delete(key);
    }, TYPING_TIMEOUT_MS));
  }, []);

  const getTyping = useCallback((conversationId: string) => typing.filter((t) => t.conversationId === conversationId), [typing]);

  useEffect(() => () => timersRef.current.forEach((t) => clearTimeout(t)), []);

  return { typing, addTyping, getTyping };
}

/** Unread count aggregation */
export function useTotalUnread(conversations: Conversation[]): number {
  return useMemo(() => conversations.reduce((sum, c) => sum + c.unreadCount, 0), [conversations]);
}
