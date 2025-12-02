import { sitesApiSlice } from "./api";

export const {
  useFetchSitesQuery,
  useFetchSiteByIdQuery,
  useAddSiteMutation,
  useDeleteSiteMutation,
  useUpdateSiteMutation,
  useGetSiteContentQuery,
} = sitesApiSlice;
export const sitesMiddleware = sitesApiSlice.middleware;
export const sitesReducerPath = sitesApiSlice.reducerPath;
export default sitesApiSlice.reducer;
