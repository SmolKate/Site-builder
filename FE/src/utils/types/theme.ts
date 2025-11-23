import type { THEME_ENUM } from "@/utils/constants";

export type ThemeValue = (typeof THEME_ENUM)[keyof typeof THEME_ENUM];
