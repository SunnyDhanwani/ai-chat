import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chat, ChatMessage } from "../../../types/types";
import { Like } from "../../../types/enum";

interface ChatState {
  data: Chat[];
}

const initialState: ChatState = {
  data: [],
};

const ChatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessageToChatId: (
      state,
      {
        payload: { message, chatId },
      }: PayloadAction<{ message: ChatMessage; chatId: string }>
    ) => {
      const chatIndex = state.data.findIndex((el) => el.id === chatId);

      if (chatIndex === -1) {
        const newChat: Chat = {
          id: chatId,
          messages: [message],
          conversationEnded: false,
          feedback: "",
          rating: -1,
        };
        state.data = [...state.data, newChat];
      } else {
        state.data[chatIndex] = {
          ...state.data[chatIndex],
          id: chatId,
          messages: [...state.data[chatIndex].messages, message],
        };
      }
    },

    updateLikeOfMessage: (
      state: ChatState,
      {
        payload: { messageId, chatId, like },
      }: PayloadAction<{ messageId: string; chatId: string; like: Like | null }>
    ) => {
      const chatIndex = state.data.findIndex((el) => el.id === chatId);
      if (chatIndex === -1) return;

      const messageIndex = state.data[chatIndex].messages.findIndex(
        (el) => el.id === messageId
      );
      if (messageIndex === -1) return;

      state.data[chatIndex].messages[messageIndex].like = like;
    },

    markEndOfConversation: (
      state: ChatState,
      { payload: { chatId } }: PayloadAction<{ chatId: string }>
    ) => {
      const chatIndex = state.data.findIndex((el) => el.id === chatId);
      if (chatIndex === -1) return;

      state.data[chatIndex].conversationEnded = true;
    },

    updateRatingeOfMessage: (
      state: ChatState,
      {
        payload: { messageId, chatId, rating },
      }: PayloadAction<{ messageId: string; chatId: string; rating: number }>
    ) => {
      const chatIndex = state.data.findIndex((el) => el.id === chatId);
      if (chatIndex === -1) return;

      const messageIndex = state.data[chatIndex].messages.findIndex(
        (el) => el.id === messageId
      );
      if (messageIndex === -1) return;

      state.data[chatIndex] = {
        ...state.data[chatIndex],
        messages: state.data[chatIndex].messages.map((msg, index) =>
          index === messageIndex ? { ...msg, rating } : msg
        ),
        rating,
      };
    },

    addFeedback: (
      state: ChatState,
      {
        payload: { chatId, feedback },
      }: PayloadAction<{ chatId: string; feedback: string }>
    ) => {
      const chatIndex = state.data.findIndex((el) => el.id === chatId);
      if (chatIndex === -1) return;

      state.data[chatIndex] = {
        ...state.data[chatIndex],
        feedback: feedback,
      };
    },
  },
});

export const {
  addMessageToChatId,
  updateLikeOfMessage,
  updateRatingeOfMessage,
  addFeedback,
  markEndOfConversation,
} = ChatSlice.actions;
export default ChatSlice.reducer;
