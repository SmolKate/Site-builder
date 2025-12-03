import { Avatar } from "radix-ui";
import { Box, Flex } from "@radix-ui/themes";
import { GearIcon } from "@radix-ui/react-icons";
import type { IUser } from "@/utils/types";
import { editProfileDialog, messages } from "@/locales";
import { useGetCurrentUserQuery, useUpdateUserMutation } from "@/store/users";
import { Button, InputField } from "@/ui";
import { useForm } from "react-hook-form";
import { editProfileSchema, type EditProfileFormData } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useUpdateSiteMutation } from "@/store/sites";
import { RaDialog } from "@/components/Dialog";
import "./styles.scss";

export const Profile = () => {
  const [open, setOpenDialog] = useState(false);
  const { data: currentUser, isLoading } = useGetCurrentUserQuery();
  const [updateUser] = useUpdateUserMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitSuccessful, isSubmitting, isDirty },
  } = useForm<EditProfileFormData>({
    resolver: yupResolver(editProfileSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    if (currentUser) {
      reset({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
      });
    }
  }, [currentUser, reset]);

  if (isLoading) return messages.loading;

  const { firstName, lastName, avatarURL, email } = currentUser as IUser;

  const onSubmit = (data: EditProfileFormData) => {
    const { firstName, lastName, email } = data;
    if (currentUser) {
      updateUser({ uid: currentUser?.uid, updates: { firstName, lastName } });
    }
    handleToggleDialog();
  };

  const handleToggleDialog = () => {
    setOpenDialog((prev) => !prev);
  };
  const handleCancelClick = () => {
    reset();
    handleToggleDialog();
  };

  return (
    <Box className="profile-wrapper">
      <Box className="profile-card">
        <RaDialog
          open={open}
          onClose={handleToggleDialog}
          title={editProfileDialog.title}
          description={editProfileDialog.description}
          content={
            <form onSubmit={handleSubmit(onSubmit)}>
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
              <InputField
                label="Электронная почта"
                register={register}
                fieldName="email"
                placeholder=""
                errors={errors}
              />

              {/* <PasswordField
                label="Пароль"
                register={register}
                fieldName="password"
                placeholder=""
                errors={errors}
              /> */}
              <div className="main-dialog__footer">
                <Button
                  buttonText="Сохранить"
                  variant="primary"
                  type="submit"
                  disabled={!isValid || isSubmitting || !isDirty}
                />
                <Button
                  buttonText="Отменить"
                  type="button"
                  variant="secondary"
                  onClick={handleCancelClick}
                />
              </div>
            </form>
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
      {/* <button onClick={handleUpdateSiteClick}>обновить сайт</button> */}
    </Box>
  );
};
