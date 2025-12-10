import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { getUser, removeAuth, removeUser } from "@/utils/helpers";
import type { IUser } from "@/utils/types";
import { db, auth } from "@/config";
import { usersApiErrors } from "@/locales";
import { sitesApiSlice } from "../sites/api";

interface IUpdateUserProps {
  uid: string | undefined;
  updates: Partial<
    Omit<IUser, "sites"> & {
      sites?: string; // Переопределяем тип с string[] на string
      password?: string;
      currentPassword?: string;
    }
  >;
}

export const usersApiSlice = createApi({
  reducerPath: "usersApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Users", "Auth", "CurrentUser"],
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
              message: usersApiErrors.fetchUsers,
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
              message: usersApiErrors.fetchUsers,
              error,
            },
          };
        }
      },
      providesTags: ["CurrentUser"],
    }),

    // Редактирование пользователя
    updateUser: builder.mutation<void, IUpdateUserProps>({
      async queryFn({ uid, updates }, api) {
        try {
          const userRef = doc(db, "users", uid!);
          const userDoc = await getDoc(userRef);
          if (!userDoc.exists()) {
            return {
              error: {
                message: usersApiErrors.notFound,
              },
            };
          }
          const existingUserData = userDoc.data() as IUser;
          const currentUser = auth.currentUser;

          // Проверяем, что текущий пользователь совпадает с обновляемым
          if (!currentUser) {
            throw new Error(usersApiErrors.unauthorized);
          }
          if (currentUser?.uid !== uid) {
            return {
              error: {
                message: usersApiErrors.forbidden,
              },
            };
          }

          // Обновление пароля в Firebase Authentication
          if (updates.password && updates.currentPassword) {
            try {
              // Re-authenticate пользователя
              const credential = EmailAuthProvider.credential(
                existingUserData.email,
                updates.currentPassword
              );
              await reauthenticateWithCredential(currentUser, credential);

              // Обновляем пароль в Firebase Auth
              await updatePassword(currentUser, updates.password);

              // Удаляем пароль из обновлений для Firestore
              delete updates.password;
            } catch (error: unknown) {
              return {
                error: {
                  message: usersApiErrors.changePassword,
                  error,
                },
              };
            }
          }

          if ("sites" in updates) {
            const sites = userDoc.data()?.sites;
            sites.push(updates.sites);
            if (updates.sites) {
              updates = { ...updates, sites: sites };
            }

            api.dispatch(sitesApiSlice.util.invalidateTags(["Sites"]));
          }

          await updateDoc(userRef, {
            ...updates,
            updatedAt: new Date().toISOString(),
          });

          return { data: undefined };
        } catch (error) {
          return {
            error: {
              message: usersApiErrors.updateUser,
              error,
            },
          };
        }
      },
      invalidatesTags: ["Users", "CurrentUser"],
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
              message: usersApiErrors.deleteUser,
              error,
            },
          };
        }
      },
      invalidatesTags: ["Users"],
    }),
  }),
});
