import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/config";
import type { ISiteDTO } from "@/utils/types";

interface IUpdateSiteProps {
  id: string;
  updatesSite: Partial<ISiteDTO>;
  updatesContent: Partial<ISiteDTO>;
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

    addSite: builder.mutation<{ siteId: string; siteContentId: string }, IAddSite>({
      async queryFn({ newSite, siteContent }) {
        try {
          const newSiteContent = await addDoc(collection(db, "siteContent"), siteContent);
          const site = await addDoc(collection(db, "sites"), {
            ...newSite,
            siteContentId: newSiteContent.id,
          });

          return { data: { siteId: site.id, siteContentId: newSiteContent.id } };
        } catch (error) {
          return {
            error: { message: "Упс, ошибка создания сайта:", error },
          };
        }
      },
      invalidatesTags: ["Sites"],
    }),

    getSiteContent: builder.query({
      async queryFn(id: string) {
        try {
          const contentSiteDoc = await getDoc(doc(db, "siteContent", id));
          let contentData = null;
          if (contentSiteDoc.exists()) {
            contentData = {
              id: contentSiteDoc.id,
              ...contentSiteDoc.data(),
            };
          }

          return { data: contentData };
        } catch (error) {
          return {
            error: {
              message: "Ошибка получения данных о контенте сайта:",
              error,
            },
          };
        }
      },
      providesTags: ["Sites"],
    }),

    updateSite: builder.mutation<void, IUpdateSiteProps>({
      async queryFn({ id, updatesSite, updatesContent }) {
        try {
          const siteRef = doc(db, "sites", id);
          const siteDoc = await getDoc(doc(db, "sites", id));
          const siteContentRef = doc(db, "siteContent", siteDoc.data()?.siteContentId);

          await updateDoc(siteRef, {
            ...updatesSite,
            updatedAt: new Date().toISOString(),
          });

          await updateDoc(siteContentRef, {
            ...updatesContent,
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
