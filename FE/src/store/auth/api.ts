import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "@/config";
import type { IUser } from "@/utils/types";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getAuth, removeAuth, removeUser, setAuth, setUser } from "@/utils/helpers";
import { FirebaseError } from "firebase/app";
import { usersApiSlice } from "../users/api";
import { sitesApiSlice } from "../sites/api";

// Тип для ответа при авторизации
interface ILoginResponse {
  uid: string;
  email: string;
  displayName?: string;
}

interface ILoginProps {
  email: string;
  password: string;
}

interface IRegisterProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface IAuthError {
  message: string;
  code: string;
}

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    // Регистрация пользователя (создание в Authentication + Firestore)
    registerUser: builder.mutation<{ uid: string }, IRegisterProps>({
      async queryFn(userData, api) {
        try {
          // Создаем пользователя в Firebase Authentication
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            userData.email,
            userData.password
          );
          const user = userCredential.user;

          //  Создаем запись в Firestore
          const userDoc: IUser = {
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            sites: [],
            avatarURL: `https://api.dicebear.com/9.x/avataaars/svg?seed=${(Math.random() + 1)
              .toString(36)
              .substring(7)}`,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          };

          await setDoc(doc(db, "users", user.uid), userDoc);

          setUser(user.uid);
          setAuth();
          api.dispatch(
            usersApiSlice.util.invalidateTags(["CurrentUser"])
          );
          api.dispatch(
            sitesApiSlice.util.invalidateTags(["Sites"])
          );
          return { data: { uid: user.uid } };
        } catch (error) {
          const { message, code } = error as IAuthError;

          return {
            error: {
              message,
              code,
            },
          };
        }
      },
      invalidatesTags: ["Auth"],
    }),
    // Авторизация пользователя
    loginUser: builder.mutation<ILoginResponse, ILoginProps>({
      async queryFn(credentials, api) {
        try {
          // Авторизуем пользователя через Firebase Authentication
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          const user = userCredential.user;

          // Получаем дополнительные данные пользователя из Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          let userData = null;

          if (userDoc.exists()) {
            userData = userDoc.data();
            setUser(user.uid);
            setAuth();
          }
          api.dispatch(
            usersApiSlice.util.invalidateTags(["CurrentUser"])
          );
          api.dispatch(
            sitesApiSlice.util.invalidateTags(["Sites"])
          );

          return {
            data: {
              uid: user.uid,
              email: user.email!,
              displayName: user.displayName || userData?.firstName + " " + userData?.lastName,
            },
          };
        } catch (error) {
          const { message, code } = error as IAuthError;
          let errorMessage = "Ошибка авторизации:";

          // Проверяем, является ли ошибка FirebaseError
          if (error instanceof FirebaseError) {
            // Более конкретные сообщения об ошибках
            switch (error.code) {
            case "auth/user-not-found":
              errorMessage = "Пользователь не найден";
              break;
            case "auth/wrong-password":
              errorMessage = "Неверный пароль";
              break;
            default:
              errorMessage = `Ошибка авторизации: ${error.code}`;
            }
          } else if (error instanceof Error) {
            // Обычная JavaScript ошибка
            errorMessage = message;
          }

          return {
            error: {
              message: errorMessage,
              code,
            },
          };
        }
      },
      invalidatesTags: ["Auth"],
    }),

    // Выход пользователя
    logoutUser: builder.mutation<void, void>({
      async queryFn(_, api) {
        try {
          await signOut(auth);
          removeAuth();
          removeUser();
          api.dispatch(
            usersApiSlice.util.invalidateTags(["CurrentUser"])
          );
          api.dispatch(
            sitesApiSlice.util.invalidateTags(["Sites"])
          );
          return { data: undefined };
        } catch (error) {
          return {
            error: {
              message: "Ошибка выхода:",
              error,
            },
          };
        }
      },
      invalidatesTags: ["Auth"],
    }),

    // Проверка статуса аутентификации
    getAuthStatus: builder.query<{ isAuth: boolean }, void>({
      queryFn: () => {
        const isAuth = getAuth();
        return { data: { isAuth: !!isAuth } };
      },

      providesTags: ["Auth"],
    }),
  }),
});
