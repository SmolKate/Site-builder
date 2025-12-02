import { usersApiSlice } from "./api";

export const {
  useGetUsersQuery,
  useUpdateUserMutation,
  useGetCurrentUserQuery,
  useDeleteUserMutation,
} = usersApiSlice;
export const usersMiddleware = usersApiSlice.middleware;
export const usersReducerPath = usersApiSlice.reducerPath;
export default usersApiSlice.reducer;
