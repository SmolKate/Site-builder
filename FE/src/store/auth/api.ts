import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "@/config";
import type { IUser } from "@/utils/types";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { getAuth, removeAuth, removeUser, setAuth, setUser } from "@/utils/helpers";

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

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    // Регистрация пользователя (создание в Authentication + Firestore)
    registerUser: builder.mutation<{ uid: string }, IUser & { password: string }>({
      async queryFn(userData) {
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
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          await setDoc(doc(db, "users", user.uid), userDoc);

          return { data: { uid: user.uid } };
        } catch (error) {
          return {
            error: {
              message: "Ошибка регистрации пользователя:",
              error,
            },
          };
        }
      },
      invalidatesTags: ["Auth"],
    }),
    // Авторизация пользователя
    loginUser: builder.mutation<ILoginResponse, ILoginProps>({
      async queryFn(credentials) {
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

          return {
            data: {
              uid: user.uid,
              email: user.email!,
              displayName: user.displayName || userData?.firstName + " " + userData?.lastName,
            },
          };
        } catch (error) {
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
            errorMessage = error.message;
          }

          return {
            error: {
              message: errorMessage,
              error,
            },
          };
        }
      },
      invalidatesTags: ["Auth"],
    }),

    // Выход пользователя
    logoutUser: builder.mutation<void, void>({
      async queryFn() {
        try {
          await signOut(auth);
          removeAuth();
          removeUser();
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
