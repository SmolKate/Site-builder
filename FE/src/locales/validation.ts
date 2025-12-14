export const validationMessages = {
  email: {
    required: "Электронная почта обязательна для заполнения",
    invalid: "Введите корректную электронную почту",
  },
  password: {
    required: "Пароль обязателен для заполнения",
    minLength: (minLength: number) => `Пароль должен содержать минимум ${minLength} символов`,
  },
  firstName: {
    required: "Имя обязательно для заполнения",
    minLength: (minLength: number) => `Имя должно содержать минимум ${minLength} символа`,
  },
  lastName: {
    required: "Фамилия обязательна для заполнения",
    minLength: (minLength: number) => `Фамилия должна содержать минимум ${minLength} символа`,
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
    notSpecialSymbols: "Поле не может содержать специальные символы",
  },
};
