import { sitesApiSlice } from "./api";

export const {
  useFetchSitesQuery,
  useAddSiteMutation,
  useDeleteSiteMutation,
  useUpdateSiteMutation,
} = sitesApiSlice;
export const sitesMiddleware = sitesApiSlice.middleware;
export const sitesReducerPath = sitesApiSlice.reducerPath;
export default sitesApiSlice.reducer;
