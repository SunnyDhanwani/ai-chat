import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { authFeature } from "../features/auth/authApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authFeature.reducerPath]: authFeature.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authFeature.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
