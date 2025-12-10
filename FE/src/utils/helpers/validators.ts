import * as yup from "yup";
import { validationMessages } from "@/locales";

// Очищает ввод, оставляя только буквы (латиница/кириллица), цифры и дефис
const COMMON_REGEX = /^[a-zA-Zа-яА-ЯёЁ0-9- ]+$/;
const EMAIL_REGEX = /^[a-zA-Zа-яА-ЯёЁ0-9!@#$%^&*()-_=+.]+$/;
const PASSWORD_REGEX = /^[a-zA-Zа-яА-ЯёЁ0-9!@#$%^&*()-_=+]+$/;

// Константы валидации
const MIN_PASSWORD_LENGTH = 6;
const MIN_TEXT_LENGTH = 2;
const MAX_TEXT_LENGTH = 15;

export const emailSchema = () =>
  yup
    .string()
    .trim()
    .required(validationMessages.email.required)
    .matches(EMAIL_REGEX, validationMessages.common.notSpecialSymbols)
    .email(validationMessages.email.invalid);

export const passwordSchema = (minLength: number = MIN_PASSWORD_LENGTH) =>
  yup
    .string()
    .trim()
    .required(validationMessages.password.required)
    .matches(PASSWORD_REGEX, validationMessages.common.notSpecialSymbols)
    .min(minLength, validationMessages.password.minLength(minLength));

export const passwordSchemaEdit = (minLength: number = MIN_PASSWORD_LENGTH) =>
  yup.string().trim().min(minLength, validationMessages.password.minLength(minLength));

export const firstNameSchema = (params?: { minLength?: number }) => {
  const { minLength = MIN_TEXT_LENGTH } = params ?? {};
  return yup
    .string()
    .trim()
    .required(validationMessages.firstName.required)
    .matches(COMMON_REGEX, validationMessages.common.notSpecialSymbols)
    .min(minLength, validationMessages.firstName.minLength(minLength));
};

export const lastNameSchema = (params?: { minLength?: number }) => {
  const { minLength = MIN_TEXT_LENGTH } = params ?? {};
  return yup
    .string()
    .trim()
    .required(validationMessages.lastName.required)
    .matches(COMMON_REGEX, validationMessages.common.notSpecialSymbols)
    .min(minLength, validationMessages.lastName.minLength(minLength));
};

export const confirmPasswordSchema = (minLength: number = MIN_PASSWORD_LENGTH) =>
  yup
    .string()
    .trim()
    .oneOf([yup.ref("password")], validationMessages.confirmPassword.invalid)
    .required(validationMessages.confirmPassword.required)
    .min(minLength, validationMessages.password.minLength(minLength));

export const requiredTextSchema = (params?: { minLength?: number; maxLength?: number }) => {
  const { minLength = MIN_TEXT_LENGTH, maxLength = MAX_TEXT_LENGTH } = params ?? {};
  return yup
    .string()
    .trim()
    .required(validationMessages.text.required)
    .matches(COMMON_REGEX, validationMessages.common.notSpecialSymbols)
    .min(minLength, validationMessages.text.minLength(minLength))
    .max(maxLength, validationMessages.text.maxLength(maxLength));
};

// Комбинированные схемы

export const loginSchema = yup.object({
  email: emailSchema(),
  password: passwordSchema(),
});

export const signupSchema = yup.object({
  firstName: firstNameSchema(),
  lastName: lastNameSchema(),
  email: emailSchema(),
  password: passwordSchema(),
  confirmPassword: confirmPasswordSchema(),
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

export const getEditProfileSchema = (isPasswordChanged: boolean) => {
  const baseSchema = yup.object({
    firstName: requiredTextSchema(),
    lastName: requiredTextSchema(),
    email: emailSchema(),
  });

  if (isPasswordChanged) {
    return baseSchema.concat(
      yup.object({
        password: passwordSchema(),
        confirmPassword: confirmPasswordSchema(),
        currentPassword: passwordSchema(),
      })
    );
  }

  return baseSchema;
};
