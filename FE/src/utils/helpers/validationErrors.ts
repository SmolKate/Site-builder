export const validationErrors = {
  email: {
    required: "Email обязателен для заполнения",
    invalid: "Введите корректный email адрес",
  },
  password: {
    required: "Пароль обязателен для заполнения",
    minLength: (minLength: number) =>
      `Пароль должен содержать минимум ${minLength} символа`,
  },
  text: {
    required: "Поле обязательно для заполнения",
    minLength: (minLength: number) =>
      `Поле должно содержать минимум ${minLength} символа`,
    maxLength: (maxLength: number) =>
      `Поле не должно превышать ${maxLength} символов`,
  },
  common: {
    notSpecialSymbols: "Не может содержать специальные символы",
  }
};
