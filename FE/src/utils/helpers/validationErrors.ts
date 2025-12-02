export const validationErrors = {
  email: {
    required: "Email обязателен для заполнения",
    invalid: "Введите корректный email адрес",
  },
  password: {
    required: "Пароль обязателен для заполнения",
    minLength: (minLength: number) => `Пароль должен содержать минимум ${minLength} символа`,
  },
  firstName: {
    required: "Имя обязательно для заполнения",
    minLength: (minLength: number) => `Имя должно содержать минимум ${minLength} символов`,
  },
  lastName: {
    required: "Фамилия обязательна для заполнения",
    minLength: (minLength: number) => `Фамилия должна содержать минимум ${minLength} символов`,
  },
  confirmPassword: {
    invalid: "Пароли не совпадают",
    required: "Повторение пароля обязательно для заполнения",
    minLength: (minLength: number) => `Пароль должен содержать минимум ${minLength} символов`,
  },
  text: {
    required: "Поле обязательно для заполнения",
    minLength: (minLength: number) => `Поле должно содержать минимум ${minLength} символа`,
    maxLength: (maxLength: number) => `Поле не должно превышать ${maxLength} символов`,
  },
  common: {
    notSpecialSymbols: "Не может содержать специальные символы",
  },
};
