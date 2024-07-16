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
        const newChat: Chat = { id: chatId, messages: [message] };
        state.data = [...state.data, newChat];
      } else {
        state.data[chatIndex] = {
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
  },
});

export const { addMessageToChatId, updateLikeOfMessage } = ChatSlice.actions;
export default ChatSlice.reducer;
