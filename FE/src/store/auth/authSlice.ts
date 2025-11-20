import { createSlice } from "@reduxjs/toolkit";
import type { IAuthState } from "@/utils/types";

const initialState: IAuthState = {
  isAuthenticated: !!localStorage.getItem("isAuth"),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
      localStorage.setItem("isAuth", "true");
    },
    logout: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem("isAuth");
    },
  },
});
