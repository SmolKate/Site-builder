import { useAppDispatch } from "@/store";
import { login } from "@/store/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, InputField, PasswordField } from "@/ui";
import { loginSchema, type LoginFormData } from "@/utils/helpers";
import "../authStyles.scss";

export const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = () => {
    dispatch(login());
    navigate(from, { replace: true });
  };

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

          <p className="text-center">
            Нет аккаунта? <Link to="/signup">Зарегистрироваться</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
