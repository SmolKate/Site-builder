import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, InputField, PasswordField } from "@/ui";
import { signupSchema, type SignupFormData } from "@/utils/helpers";
import "../authStyles.scss";

export const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
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
  const password = watch("password");

  const onSubmit = () => {
    navigate(from, { replace: true });
  };

  useEffect(() => {
    if (touchedFields.confirmPassword) {
      trigger("confirmPassword");
    }
  }, [password, trigger]);

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

          <p className="text-center">
            Есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
