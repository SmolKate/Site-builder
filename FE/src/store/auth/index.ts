import { authSlice } from "./authSlice";

export const authReducerPath = authSlice.reducerPath;
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
