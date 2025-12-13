import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "@/config";
import type { IUser } from "@/utils/types";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getAuth, removeAuth, removeUser, setAuth, setUser } from "@/utils/helpers";
import { FirebaseError } from "firebase/app";
import { authApiErrors } from "@/locales";
import { usersApiSlice } from "../users/api";
import { sitesApiSlice } from "../sites/api";

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
    registerUser: builder.mutation<{ uid: string }, IRegisterProps>({
      async queryFn(userData, api) {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            userData.email,
            userData.password
          );
          const user = userCredential.user;

          const userDoc: IUser = {
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            sites: [],
            avatarURL: `https://api.dicebear.com/9.x/avataaars/svg?seed=${(Math.random() + 1)
              .toString(36)
              .substring(7)}`,
            createdAt: Timestamp.now().toMillis(),
            updatedAt: Timestamp.now().toMillis(),
          };

          await setDoc(doc(db, "users", user.uid), userDoc);

          setUser(user.uid);
          setAuth();
          api.dispatch(usersApiSlice.util.invalidateTags(["CurrentUser"]));
          api.dispatch(sitesApiSlice.util.invalidateTags(["Sites"]));
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
    loginUser: builder.mutation<ILoginResponse, ILoginProps>({
      async queryFn(credentials, api) {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          const user = userCredential.user;

          const userDoc = await getDoc(doc(db, "users", user.uid));
          let userData = null;

          if (userDoc.exists()) {
            userData = userDoc.data();
            setUser(user.uid);
            setAuth();
          }
          api.dispatch(usersApiSlice.util.invalidateTags(["CurrentUser"]));
          api.dispatch(sitesApiSlice.util.invalidateTags(["Sites"]));

          return {
            data: {
              uid: user.uid,
              email: user.email!,
              displayName: user.displayName || userData?.firstName + " " + userData?.lastName,
            },
          };
        } catch (error) {
          const { message, code } = error as IAuthError;
          let errorMessage = authApiErrors.loginPrefix;

          if (error instanceof FirebaseError) {
            switch (error.code) {
              case "auth/user-not-found":
                errorMessage = authApiErrors.notFound;
                break;
              case "auth/wrong-password":
                errorMessage = authApiErrors.wrongPassword;
                break;
              default:
                errorMessage = `${authApiErrors.loginPrefix} ${error.code}`;
            }
          } else if (error instanceof Error) {
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

    logoutUser: builder.mutation<void, void>({
      async queryFn(_, api) {
        try {
          await signOut(auth);
          removeAuth();
          removeUser();
          api.dispatch(usersApiSlice.util.invalidateTags(["CurrentUser"]));
          api.dispatch(sitesApiSlice.util.invalidateTags(["Sites"]));
          return { data: undefined };
        } catch (error) {
          return {
            error: {
              message: authApiErrors.logout,
              error,
            },
          };
        }
      },
      invalidatesTags: ["Auth"],
    }),

    getAuthStatus: builder.query<{ isAuth: boolean }, void>({
      queryFn: () => {
        const isAuth = getAuth();
        return { data: { isAuth: !!isAuth } };
      },

      providesTags: ["Auth"],
    }),
  }),
});
