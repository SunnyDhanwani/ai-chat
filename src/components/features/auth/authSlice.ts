import { createSlice } from "@reduxjs/toolkit";
import { clearGlobalItem, setGlobalItem } from "../../../utils/helper";

interface AuthState {
  _id: string;
  token: string | null;
}

const initialState: AuthState = {
  _id: "",
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      clearGlobalItem()
      state.token = null;
    },
    login: (state, { payload: token }) => {      
      setGlobalItem("authToken", token);
      state.token = token;
    },
  },
});

export const { logout, login: loginAction } = authSlice.actions;
export default authSlice.reducer;
