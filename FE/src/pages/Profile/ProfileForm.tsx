import { editProfileDialog, profileMessages } from "@/locales";
import { Button, InputField, PasswordField } from "@/ui";
import type { EditProfileFormData } from "@/ui/types";
import type { IUser } from "@/utils/types";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Box } from "@radix-ui/themes";
import { useEffect, useState, type ChangeEvent } from "react";
import {
  type FieldErrors,
  type UseFormClearErrors,
  type UseFormRegister,
  type UseFormResetField,
} from "react-hook-form";

interface IProfileForm {
  currentUser: IUser | null | undefined;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<EditProfileFormData>;
  errors: FieldErrors<EditProfileFormData>;
  handleCancelClick: () => void;
  disableSubmit: boolean;
  isPasswordChanged: boolean;
  resetField: UseFormResetField<EditProfileFormData>;
  clearErrors: UseFormClearErrors<EditProfileFormData>;
}

export const ProfileForm = ({
  currentUser,
  onSubmit,
  register,
  errors,
  handleCancelClick,
  disableSubmit,
  isPasswordChanged,
  resetField,
  clearErrors,
}: IProfileForm) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (!isChecked) {
      resetField("password");
      resetField("confirmPassword");
      resetField("currentPassword");
      clearErrors(["password", "confirmPassword", "currentPassword"]);
    }
  }, [isChecked, resetField, clearErrors]);

  const handleChangeCheck = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(target.checked);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="dialog-email">
        <Box className="dialog-email__label">{profileMessages.emailLabel}</Box>
        <Box className="dialog-email__content">
          <div>{currentUser?.email}</div>
          <div className="dialog-email__icon" title={editProfileDialog.emailTooltip}>
            <InfoCircledIcon />
          </div>
        </Box>
      </div>

      <InputField
        label={profileMessages.labels.firstName}
        register={register}
        fieldName="firstName"
        placeholder=""
        errors={errors}
      />
      <InputField
        label={profileMessages.labels.lastName}
        register={register}
        fieldName="lastName"
        placeholder=""
        errors={errors}
      />
      <div className="dialog-change-pass">
        <input
          name="checkbox"
          type="checkbox"
          id="isChangePass"
          className="dialog-checkbox"
          checked={isChecked}
          onChange={handleChangeCheck}
        />
        <label htmlFor="isChangePass" className="dialog-checkbox__label">
          {profileMessages.changePasswordQuestion}
        </label>
      </div>
      {isChecked && (
        <>
          <PasswordField
            label={profileMessages.labels.password}
            register={register}
            fieldName="password"
            placeholder=""
            errors={errors}
          />
          {isPasswordChanged && (
            <>
              <PasswordField
                label={profileMessages.labels.confirmPassword}
                register={register}
                fieldName="confirmPassword"
                placeholder=""
                errors={errors}
              />
              <PasswordField
                label={profileMessages.labels.currentPassword}
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
        <Button
          buttonText={profileMessages.actions.save}
          variant="primary"
          type="submit"
          disabled={disableSubmit}
        />
        <Button
          buttonText={profileMessages.actions.cancel}
          type="button"
          variant="secondary"
          onClick={handleCancelClick}
        />
      </div>
    </form>
  );
};
