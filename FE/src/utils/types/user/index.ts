import type { LANGUAGE_ENUM, THEME_ENUM } from "@/utils/constants";
import type { FieldValue } from "firebase/firestore";

export interface IUser {
  uid?: string;
  email: string;
  firstName: string;
  lastName: string;
  sites: string[];
  avatarURL: string;
  createdAt: FieldValue;
  updatedAt: FieldValue;
  preferences?: {
    theme: typeof THEME_ENUM;
    language: typeof LANGUAGE_ENUM;
  };
}
