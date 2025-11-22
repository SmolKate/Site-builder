import * as yup from 'yup';

export const emailSchema = yup
  .string()
  .required('Email обязателен для заполнения')
  .email('Введите корректный email адрес');

export const passwordSchema = yup
  .string()
  .required('Пароль обязателен для заполнения')
  .min(5, 'Пароль должен содержать минимум 5 символов');

export const nameSchema = yup
  .string()
  .required('Имя обязательно для заполнения')
  .min(2, 'Имя должно содержать минимум 2 символа')
  .max(15, 'Имя не должно превышать 15 символов');

// Комбинированные схемы

export const loginSchema = yup.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupSchema = yup.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});

export const profileSchema = yup.object({
  name: nameSchema,
  email: emailSchema,
});

// Типы для TypeScript
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type SignupFormData = yup.InferType<typeof signupSchema>;
export type ProfileFormData = yup.InferType<typeof profileSchema>;
