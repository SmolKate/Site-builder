import { editProfileDialog } from "@/locales";
import { Button, InputField, PasswordField } from "@/ui";
import type { EditProfileFormData } from "@/ui/types";
import type { IUser } from "@/utils/types";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Box } from "@radix-ui/themes";
import { useState, type ChangeEvent } from "react";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";

interface IProfileForm {
  currentUser: IUser | null | undefined;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<EditProfileFormData>;
  errors: FieldErrors<EditProfileFormData>;
  handleCancelClick: () => void;
  disableSubmit: boolean;
  isPasswordChanged: boolean;
}

export const ProfileForm = ({
  currentUser,
  onSubmit,
  register,
  errors,
  handleCancelClick,
  disableSubmit,
  isPasswordChanged,
}: IProfileForm) => {
  const [isChecked, setIsChecked] = useState(false);
  const handleChangeCheck = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(target.checked);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="dialog-email">
        <Box className="dialog-email__label">Электронная почта</Box>
        <Box className="dialog-email__content">
          <div>{currentUser?.email}</div>
          <div className="dialog-email__icon" title={editProfileDialog.emailTooltip}>
            <InfoCircledIcon />
          </div>
        </Box>
      </div>

      <InputField
        label="Имя"
        register={register}
        fieldName="firstName"
        placeholder=""
        errors={errors}
      />
      <InputField
        label="Фамилия"
        register={register}
        fieldName="lastName"
        placeholder=""
        errors={errors}
      />
      <input
        name="checkbox"
        type="checkbox"
        id="isChangePass"
        className="dialog-checkbox"
        checked={isChecked}
        onChange={handleChangeCheck}
      />
      <label htmlFor="isChangePass" className="dialog-checkbox__label">
        Хотите поменять пароль?
      </label>
      {isChecked && (
        <>
          <PasswordField
            label="Пароль"
            register={register}
            fieldName="password"
            placeholder=""
            errors={errors}
          />
          {isPasswordChanged && (
            <>
              <PasswordField
                label="Подтвердите пароль"
                register={register}
                fieldName="confirmPassword"
                placeholder=""
                errors={errors}
              />
              <PasswordField
                label="текущий пароль"
                register={register}
                fieldName="currentPassword"
                placeholder=""
                errors={errors}
              />
            </>
          )}
        </>
      )}

      <div className="main-dialog__footer">
        <Button buttonText="Сохранить" variant="primary" type="submit" disabled={disableSubmit} />
        <Button
          buttonText="Отменить"
          type="button"
          variant="secondary"
          onClick={handleCancelClick}
        />
      </div>
    </form>
  );
};
