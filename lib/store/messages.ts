import { create } from "zustand";
import { MESSAGES_LIMIT } from "../constant/messagesLimit";

export type Imessage = {
  created_at: string;
  id: string;
  is_edited: boolean;
  sent_by: string;
  text: string;
  users: {
    avatar_url: string;
    created_at: string;
    display_name: string;
    id: string;
  } | null;
};

interface MessageState {
  hasMore: boolean;
  page: number;
  messages: Imessage[];
  actionMessage: Imessage | undefined;
  optimisticIds: string[];
  setOptimisticIds: (id: string) => void;
  setActionMessage: (message: Imessage | undefined) => void;
  addMessage: (message: Imessage) => void;
  optimisticDeleteMessage: (messageId: string) => void;
  optimisticUpdatedeMessage: (message: Imessage) => void;
  setMessages: (messages: Imessage[]) => void;
}

export const useMessages = create<MessageState>()((set) => ({
  hasMore: true,
  page: 1,
  messages: [],
  optimisticIds: [],
  setMessages: (messages) => {
    set((state) => ({
      messages: [...messages, ...state.messages],
      page: state.page + 1,
      hasMore: messages.length >= MESSAGES_LIMIT,
    }));
  },
  setOptimisticIds: (id: string) =>
    set((state) => ({ optimisticIds: [...state.optimisticIds, id] })),
  actionMessage: undefined,
  setActionMessage: (message) => set(() => ({ actionMessage: message })),
  addMessage: (newMessage: Imessage) => {
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },
  optimisticDeleteMessage: (messageId: string) => {
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== messageId),
    }));
  },
  optimisticUpdatedeMessage: (updatedMessage) => {
    set((stale) => {
      return {
        messages: stale.messages.filter((message) => {
          if (message.id === updatedMessage.id) {
            (message.text = updatedMessage.text),
              (message.is_edited = updatedMessage.is_edited);
          }
          return message;
        }),
      };
    });
  },
}));
