import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, InputField, PasswordField } from "@/ui";
import { loginSchema, type LoginFormData } from "@/utils/helpers";
import { useLoginUserMutation } from "@/store/auth";
import { authMessages } from "@/locales";
import "../authStyles.scss";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });
  const [loginUser] = useLoginUserMutation();
  const [loginError, setLoginError] = useState<null | string>(null);
  const [accessError, setAccessError] = useState<null | string>(null);
  const allFields = watch();

  const onSubmit = (values: LoginFormData) => {
    const { email, password } = values;

    loginUser({ email, password })
      .unwrap()
      .then(() => navigate("/", { state: {}, replace: true }))
      .catch(() => setLoginError(authMessages.loginError));
  };

  useEffect(() => {
    setLoginError(null);
  }, [JSON.stringify(allFields)]);

  useEffect(() => {
    if (location.state?.privateRedirect) {
      setAccessError(location.state?.message);
      navigate(location.pathname, {
        state: {},
        replace: true,
      });
    }
  }, [location.key]);

  useEffect(() => {
    if (accessError && (allFields.email || allFields.password)) {
      setAccessError(null);
    }
  }, [accessError, allFields.email, allFields.password]);

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-page__inner">
          <h2 className="auth-page__title">Войти</h2>

          <form className="auth-page__form" onSubmit={handleSubmit(onSubmit)}>
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
            <Button buttonText="Войти" disabled={!isValid} />
          </form>

          {loginError && <p className="auth-page__error">{loginError}</p>}
          {accessError && <p className="auth-page__error">{accessError}</p>}

          <p className="text-center">
            Нет аккаунта? <Link to="/signup">Зарегистрироваться</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
