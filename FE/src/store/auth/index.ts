import { authApiSlice } from "./api";

export const {
  useLoginUserMutation,
  useLogoutUserMutation,
  useRegisterUserMutation,
  useGetAuthStatusQuery,
} = authApiSlice;
export const authMiddleware = authApiSlice.middleware;
export const authReducerPath = authApiSlice.reducerPath;
export default authApiSlice.reducer;
