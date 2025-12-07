import type { ISiteContentDTO, ISiteDTO } from "@/utils/types";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config";

interface IUpdateSiteProps {
  id: string;
  updatesSite: Partial<ISiteDTO>;
  updatesContent: Partial<ISiteContentDTO>;
}
interface IAddSite {
  newSite: Omit<ISiteDTO, "id">;
  siteContent: ISiteContentDTO;
}

export const sitesApiSlice = createApi({
  reducerPath: "sitesApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Sites", "SIteById"],
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

    fetchSiteById: builder.query<{ siteInfo: ISiteDTO; siteContent: ISiteContentDTO }, string>({
      async queryFn(siteId) {
        try {
          const siteDoc = await getDoc(doc(db, "sites", siteId));
          const siteInfo = siteDoc.data() as ISiteDTO;
          const siteContentDoc = await getDoc(
            doc(db, "siteContent", siteDoc.data()?.siteContentId)
          );
          const siteContent = siteContentDoc.data() as ISiteContentDTO;

          return { data: { siteContent, siteInfo } };
        } catch (error) {
          return {
            error: { message: "Ошибка получения данных о сайтах:", error },
          };
        }
      },
      providesTags: ["SIteById"],
    }),

    addSite: builder.mutation<string, IAddSite>({
      async queryFn({ newSite, siteContent }) {
        try {
          const { id } = await addDoc(collection(db, "siteContent"), siteContent);
          const siteRef = doc(db, "sites", id);
          await setDoc(siteRef, {
            ...newSite,
            siteContentId: id,
          });

          return { data: id };
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
      async queryFn({ id, updatesSite = {}, updatesContent = {} }) {
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
      invalidatesTags: ["SIteById"],
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
