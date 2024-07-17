import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearAllGlobalItems, setGlobalItem } from "../../../utils/helper";

interface AuthState {
  _id: string;
  token: string | null;
  email: string;
}

const initialState: AuthState = {
  _id: "",
  token: null,
  email: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      clearAllGlobalItems();
      state.token = null;
    },
    login: (
      state,
      {
        payload: { token, email },
      }: PayloadAction<{ token: string; email: string }>
    ) => {
      setGlobalItem("authToken", token);
      state.token = token;
      state.email = email;
    },
  },
});

export const { logout, login: loginAction } = authSlice.actions;
export default authSlice.reducer;
