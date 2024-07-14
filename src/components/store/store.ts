import { configureStore } from "@reduxjs/toolkit";
import { authFeature } from "../features/auth/authApi";
import chatSlice from "../features/chat/chatSlice";
import authSlice from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    chat: chatSlice,
    [authFeature.reducerPath]: authFeature.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authFeature.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
