import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, InputField, PasswordField } from "@/ui";
import { signupSchema, type SignupFormData } from "@/utils/helpers";
import { useRegisterUserMutation } from "@/store/auth";
import { authMessages } from "@/locales";
import "../authStyles.scss";

export const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    watch,
    trigger,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
    mode: "onChange",
  });
  const [registerUser] = useRegisterUserMutation();
  const [registerError, setRegisterError] = useState<null | string>(null);
  const allFields = watch();
  const password = watch("password");

  const onSubmit = (data: SignupFormData) => {
    const { firstName, lastName, email, password } = data;

    registerUser({
      firstName,
      lastName,
      email,
      password,
    })
      .unwrap()
      .then(() => navigate("/", { state: {}, replace: true }))
      .catch(() => setRegisterError(authMessages.registerError));
  };

  useEffect(() => {
    if (touchedFields.confirmPassword) {
      trigger("confirmPassword");
    }
  }, [password, trigger]);

  useEffect(() => {
    setRegisterError(null);
  }, [JSON.stringify(allFields)]);

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-page__inner">
          <h2 className="auth-page__title">Зарегистрироваться</h2>

          <form className="auth-page__form" onSubmit={handleSubmit(onSubmit)}>
            <InputField
              register={register}
              errors={errors}
              fieldName="firstName"
              label="Имя"
              placeholder="Введите имя..."
            />
            <InputField
              register={register}
              errors={errors}
              fieldName="lastName"
              label="Фамилия"
              placeholder="Введите фамилию..."
            />
            <InputField
              register={register}
              errors={errors}
              fieldName="email"
              label="Электронная почта"
              placeholder="Введите электронную почту..."
            />
            <PasswordField
              register={register}
              errors={errors}
              fieldName="password"
              label="Пароль"
              placeholder="Введите пароль..."
            />
            <PasswordField
              register={register}
              errors={errors}
              fieldName="confirmPassword"
              label="Повторить пароль"
              placeholder="Повторите пароль..."
            />
            <Button buttonText="Зарегистрироваться" disabled={!isValid} />
          </form>

          {registerError && <p className="auth-page__error">{registerError}</p>}

          <p className="text-center">
            Есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
