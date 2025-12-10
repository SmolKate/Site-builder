import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, InputField, PasswordField } from "@/ui";
import { signupSchema, type SignupFormData } from "@/utils/helpers";
import { useRegisterUserMutation } from "@/store/auth";
import { authMessages, authPageMessages } from "@/locales";
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
          <h2 className="auth-page__title">{authPageMessages.signup.title}</h2>

          <form className="auth-page__form" onSubmit={handleSubmit(onSubmit)}>
            <InputField
              register={register}
              errors={errors}
              fieldName="firstName"
              label={authPageMessages.signup.firstNameLabel}
              placeholder={authPageMessages.signup.firstNamePlaceholder}
            />
            <InputField
              register={register}
              errors={errors}
              fieldName="lastName"
              label={authPageMessages.signup.lastNameLabel}
              placeholder={authPageMessages.signup.lastNamePlaceholder}
            />
            <InputField
              register={register}
              errors={errors}
              fieldName="email"
              label={authPageMessages.signup.emailLabel}
              placeholder={authPageMessages.signup.emailPlaceholder}
            />
            <PasswordField
              register={register}
              errors={errors}
              fieldName="password"
              label={authPageMessages.signup.passwordLabel}
              placeholder={authPageMessages.signup.passwordPlaceholder}
            />
            <PasswordField
              register={register}
              errors={errors}
              fieldName="confirmPassword"
              label={authPageMessages.signup.confirmPasswordLabel}
              placeholder={authPageMessages.signup.confirmPasswordPlaceholder}
            />
            <Button buttonText={authPageMessages.signup.submit} disabled={!isValid} />
          </form>

          {registerError && <p className="auth-page__error">{registerError}</p>}

          <p className="text-center">
            {authPageMessages.signup.linkText} <Link to="/login">{authPageMessages.signup.linkCta}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
