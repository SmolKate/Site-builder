import { Avatar } from "radix-ui";
import { Box, Flex } from "@radix-ui/themes";
import { GearIcon } from "@radix-ui/react-icons";
import type { IUser } from "@/utils/types";
import { editProfileDialog, messages } from "@/locales";
import { useGetCurrentUserQuery, useUpdateUserMutation } from "@/store/users";
import { useForm } from "react-hook-form";
import { getEditProfileSchema } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { RaDialog } from "@/components/Dialog";
import "./styles.scss";
import { ProfileForm } from "./ProfileForm";
import type { EditProfileFormData } from "@/ui/types";

export const Profile = () => {
  const [open, setOpenDialog] = useState(false);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const { data: currentUser, isLoading } = useGetCurrentUserQuery();
  const [updateUser, { error: updateUserError }] = useUpdateUserMutation();

  const editProfileSchema = useMemo(
    () => getEditProfileSchema(isPasswordChanged),
    [isPasswordChanged]
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    trigger,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormData>({
    resolver: yupResolver(editProfileSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (currentUser) {
      reset({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
      });
    }
  }, [currentUser, reset]);

  // Обработка ошибок от сервера
  useEffect(() => {
    if (updateUserError) {
      setError("currentPassword", {
        type: "server",
        message: editProfileDialog.errorPassword,
      });
    }
  }, [updateUserError, setError]);

  // Получаем значения полей для сравнения
  const formValues: EditProfileFormData = watch();

  // Проверяем, изменились ли поля по сравнению с исходными данными
  const isFirstNameChanged = currentUser && formValues.firstName !== currentUser.firstName;
  const isLastNameChanged = currentUser && formValues.lastName !== currentUser.lastName;
  useEffect(() => {
    const subscription = watch((value) => {
      setIsPasswordChanged(!!value.password || !!value.confirmPassword);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Проверяем совпадение паролей
  const isPasswordMatching = () => {
    if (!isPasswordChanged) return true;
    return formValues.password === formValues.confirmPassword;
  };

  // Проверяем, заполнено ли поле текущего пароля при изменении пароля
  const isCurrentPasswordFilled = () => {
    if (!isPasswordChanged) return true;
    return !!formValues.currentPassword && formValues.currentPassword.trim().length > 0;
  };

  // Проверяем, есть ли изменения для отправки
  const hasChanges = () => {
    const hasNameChanges = isFirstNameChanged || isLastNameChanged;
    return isPasswordChanged ? hasNameChanges || isPasswordChanged : hasNameChanges;
  };

  // Проверяем, можно ли отправлять форму
  const isSubmitEnabled = () => {
    if (!hasChanges) return false;
    if (isPasswordChanged && (!isPasswordMatching || !isCurrentPasswordFilled)) {
      return false;
    }
    return true;
  };

  if (isLoading) return messages.loading;
  const { firstName, lastName, avatarURL, email } = currentUser as IUser;

  const onSubmit = async (data: EditProfileFormData) => {
    clearErrors();
    if (isPasswordChanged) {
      const isValid = await trigger(["password", "confirmPassword", "currentPassword"]);
      if (!isValid) return;
    }

    if (currentUser) {
      updateUser({
        uid: currentUser?.uid,
        updates: data,
      })
        .unwrap()
        .then(() => handleToggleDialog());
    }
  };

  const handleToggleDialog = () => {
    setOpenDialog((prev) => !prev);
  };
  const handleCancelClick = () => {
    reset();
    handleToggleDialog();
  };

  const disableSubmit = !isSubmitEnabled || isSubmitting;

  return (
    <Box className="profile-wrapper">
      <Box className="profile-card">
        <RaDialog
          open={open}
          onClose={handleToggleDialog}
          title={editProfileDialog.title}
          description={editProfileDialog.description}
          content={
            <ProfileForm
              currentUser={currentUser}
              onSubmit={handleSubmit(onSubmit)}
              register={register}
              errors={errors}
              handleCancelClick={handleCancelClick}
              disableSubmit={disableSubmit}
              isPasswordChanged={isPasswordChanged}
            />
          }
        />
        <Box className="profile-card__settings-btn" onClick={handleToggleDialog}>
          <GearIcon className="profile-card__settings-icon" />
        </Box>
        <Avatar.Root className="profile-card__avatar-root">
          <Avatar.Image
            className="profile-card__avatar-image"
            src={avatarURL}
            alt={`${firstName} ${lastName}`}
          />
          <Avatar.Fallback className="profile-card__avatar-fallback">
            {firstName?.charAt(0).toUpperCase() + lastName?.charAt(0).toUpperCase()}
          </Avatar.Fallback>
        </Avatar.Root>
        <Flex direction="column">
          <h3 className="profile-name">{`${firstName} ${lastName}`}</h3>
          <p className="profile-email">{email}</p>
        </Flex>
      </Box>
    </Box>
  );
};
