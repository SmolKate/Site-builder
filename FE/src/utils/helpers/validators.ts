import * as yup from "yup";
import { validationErrors } from "./validationErrors";

// Очищает ввод, оставляя только буквы (латиница/кириллица), цифры и дефис
const COMMON_REGEX = /^[a-zA-Zа-яА-ЯёЁ0-9-]+$/;
const EMAIL_REGEX = /^[a-zA-Zа-яА-ЯёЁ0-9!@#$%^&*()-_=+.]+$/;
const PASSWORD_REGEX = /^[a-zA-Zа-яА-ЯёЁ0-9!@#$%^&*()-_=+]+$/;

// Константы валидации
const MIN_PASSWORD_LENGTH = 5;
const MIN_TEXT_LENGTH = 2;
const MAX_TEXT_LENGTH = 15;

export const emailSchema = () =>
  yup
    .string()
    .trim()
    .required(validationErrors.email.required)
    .matches(EMAIL_REGEX, validationErrors.common.notSpecialSymbols)
    .email(validationErrors.email.invalid);

export const passwordSchema = (minLength: number = MIN_PASSWORD_LENGTH) =>
  yup
    .string()
    .trim()
    .required(validationErrors.password.required)
    .matches(PASSWORD_REGEX, validationErrors.common.notSpecialSymbols)
    .min(minLength, validationErrors.password.minLength(minLength));

export const requiredTextSchema = (params?: { minLength?: number; maxLength?: number }) => {
  const { minLength = MIN_TEXT_LENGTH, maxLength = MAX_TEXT_LENGTH } = params ?? {};
  return yup
    .string()
    .trim()
    .required(validationErrors.text.required)
    .matches(COMMON_REGEX, validationErrors.common.notSpecialSymbols)
    .min(minLength, validationErrors.text.minLength(minLength))
    .max(maxLength, validationErrors.text.maxLength(maxLength));
};

// Комбинированные схемы

export const loginSchema = yup.object({
  email: emailSchema(),
  password: passwordSchema(),
});

export const signupSchema = yup.object({
  email: emailSchema(),
  password: passwordSchema(),
  name: requiredTextSchema(),
});

export const profileSchema = yup.object({
  name: requiredTextSchema(),
  email: emailSchema(),
});

export const siteSchema = yup.object({
  title: requiredTextSchema(),
  description: requiredTextSchema({ maxLength: 150 }),
});

// Типы для TypeScript
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type SignupFormData = yup.InferType<typeof signupSchema>;
export type ProfileFormData = yup.InferType<typeof profileSchema>;
export type SiteFormData = yup.InferType<typeof siteSchema>;
