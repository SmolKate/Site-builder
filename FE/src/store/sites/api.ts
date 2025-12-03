import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/config";
import type { ISiteDTO } from "@/utils/types";

interface IUpdateSiteProps {
  id: string;
  updates: Partial<ISiteDTO>;
}
interface IAddSite {
  newSite: ISiteDTO;
  siteContent: ISiteDTO;
}

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

    addSite: builder.mutation<string, IAddSite>({
      async queryFn({ newSite, siteContent }) {
        try {
          const newSiteContent = await addDoc(collection(db, "siteContent"), siteContent);
          const site = await addDoc(collection(db, "sites"), {
            ...newSite,
            siteContentId: newSiteContent.id,
          });

          return { data: site.id };
        } catch (error) {
          return {
            error: { message: "Упс, ошибка создания сайта:", error },
          };
        }
      },
      invalidatesTags: ["Sites"],
    }),

    updateSite: builder.mutation<void, IUpdateSiteProps>({
      async queryFn({ id, updates }) {
        try {
          const siteRef = doc(db, "sites", id);

          console.log();
          await updateDoc(siteRef, {
            ...updates,
            updatedAt: new Date().toISOString(),
          });

          return { data: undefined };
        } catch (error) {
          return {
            error: {
              message: "Ошибка обновления сайта:",
              error,
            },
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
