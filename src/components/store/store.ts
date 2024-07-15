import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authFeature } from "../features/auth/authApi";
import chatSlice from "../features/chat/chatSlice";
import authSlice from "../features/auth/authSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { chatFeature } from "../features/chat/chatApi";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "chat"],
};

const rootReducer = combineReducers({
  auth: authSlice,
  chat: chatSlice,
  [authFeature.reducerPath]: authFeature.reducer,
  [chatFeature.reducerPath]: chatFeature.reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authFeature.middleware, chatFeature.middleware),
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store, persistor };
