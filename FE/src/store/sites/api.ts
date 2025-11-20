import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "@/config";
import type { ISiteDTO } from "@utils/types";

export const sitesApiSlice = createApi({
  reducerPath: "sitesApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Sites"],
  endpoints: (builder) => ({
    fetchSites: builder.query<ISiteDTO[], void>({
      async queryFn() {
        try {
          const querySnapshot = await getDocs(collection(db, "sites"));
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as ISiteDTO[];

          return { data };
        } catch (error) {
          return {
            error: { message: "Ошибка получения данных о сайтах:", error },
          };
        }
      },
      providesTags: ["Sites"],
    }),

    addSite: builder.mutation<void, Omit<ISiteDTO, "id">>({
      async queryFn(newSite) {
        try {
          await addDoc(collection(db, "sites"), newSite);

          return { data: undefined };
        } catch (error) {
          return {
            error: { message: "Упс, ошибка создания сайта:", error },
          };
        }
      },
      invalidatesTags: ["Sites"],
    }),

    deleteSite: builder.mutation<void, string>({
      async queryFn(siteId) {
        try {
          await deleteDoc(doc(db, "sites", siteId));

          return { data: undefined };
        } catch (error) {
          return {
            error: { message: "Ошибка удаления сайта:", error },
          };
        }
      },
      invalidatesTags: ["Sites"],
    }),
  }),
});
