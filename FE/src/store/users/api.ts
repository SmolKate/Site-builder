import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { getUser, removeAuth, removeUser } from "@/utils/helpers";
import type { IUser } from "@/utils/types";
import { db, auth } from "@/config";

interface IUpdateUserProps {
  uid: string;
  updates: Partial<IUser>;
}

export const usersApiSlice = createApi({
  reducerPath: "usersApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Users", "Auth"],
  endpoints: (builder) => ({
    getUsers: builder.query<IUser[], void>({
      async queryFn() {
        try {
          const querySnapshot = await getDocs(collection(db, "users"));
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
          })) as IUser[];

          return { data };
        } catch (error) {
          return {
            error: {
              message: "Ошибка получения данных о пользователях:",
              error,
            },
          };
        }
      },
      providesTags: ["Users"],
    }),

    getCurrentUser: builder.query<IUser | null, void>({
      async queryFn() {
        try {
          const userUid = getUser();

          if (userUid) {
            // Получаем дополнительные данные пользователя из Firestore
            const userDoc = await getDoc(doc(db, "users", userUid));
            let userData = null;

            if (userDoc.exists()) {
              userData = userDoc.data();
            }

            const user: IUser = {
              uid: userUid,
              ...userData,
            } as IUser & { uid: string };

            return { data: user };
          } else return { data: null };
        } catch (error) {
          return {
            error: {
              message: "Ошибка получения данных о пользователях:",
              error,
            },
          };
        }
      },
      providesTags: ["Users"],
    }),

    // Редактирование пользователя
    updateUser: builder.mutation<void, IUpdateUserProps>({
      async queryFn({ uid, updates }) {
        try {
          const userRef = doc(db, "users", uid);
          await updateDoc(userRef, {
            ...updates,
            updatedAt: new Date().toISOString(),
          });

          return { data: undefined };
        } catch (error) {
          return {
            error: {
              message: "Ошибка обновления пользователя:",
              error,
            },
          };
        }
      },
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<void, string>({
      async queryFn(userId) {
        try {
          // Удаляем из Firestore
          await deleteDoc(doc(db, "users", userId));

          // Удаляем из Authentication:
          const user = auth.currentUser;
          if (user && user.uid === userId) {
            await deleteUser(user);
          }
          removeAuth();
          removeUser();
          return { data: undefined };
        } catch (error) {
          return {
            error: {
              message: "Ошибка удаления пользователя:",
              error,
            },
          };
        }
      },
      invalidatesTags: ["Users"],
    }),
  }),
});
