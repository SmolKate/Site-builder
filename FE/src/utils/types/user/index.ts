import type { LANGUAGE_ENUM, THEME_ENUM } from "@/utils/constants";

export interface IUser {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  sites: string[];
  avatarURL?: string;
  createdAt: string;
  updatedAt: string;
  preferences?: {
    theme: typeof THEME_ENUM;
    language: typeof LANGUAGE_ENUM;
  };
}
