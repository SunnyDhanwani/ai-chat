import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearGlobalItem, setGlobalItem } from "../../../utils/helper";
import { Chat, ChatMessage } from "../../../types/types";
import { v4 as uuid } from "uuid";

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
  },
});

export const { addMessageToChatId } = ChatSlice.actions;
export default ChatSlice.reducer;
