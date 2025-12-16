import { Avatar } from "radix-ui";
import { Box, Flex } from "@radix-ui/themes";
import { GearIcon } from "@radix-ui/react-icons";
import type { IUser } from "@/utils/types";
import { editProfileDialog } from "@/locales";
import { useGetCurrentUserQuery, useUpdateUserMutation } from "@/store/users";
import { useForm } from "react-hook-form";
import { getEditProfileSchema } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { RaDialog } from "@/components/Dialog";
import "./styles.scss";
import { ProfileForm } from "./ProfileForm";
import type { EditProfileFormData } from "@/ui/types";
import Loader, { LVariant, LSize } from "@/ui/Loader/Loader";

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
    resetField,
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

  useEffect(() => {
    if (updateUserError) {
      setError("currentPassword", {
        type: "server",
        message: editProfileDialog.errorPassword,
      });
    }
  }, [updateUserError, setError]);

  const formValues: EditProfileFormData = watch();

  const isFirstNameChanged = currentUser && formValues.firstName !== currentUser.firstName;

  const isLastNameChanged = currentUser && formValues.lastName !== currentUser.lastName;

  useEffect(() => {
    const subscription = watch((value) => {
      setIsPasswordChanged(!!value.password || !!value.confirmPassword);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const isPasswordMatching = () => {
    if (!isPasswordChanged) return true;

    return formValues.password === formValues.confirmPassword;
  };

  const isCurrentPasswordFilled = () => {
    if (!isPasswordChanged) return true;

    return !!formValues.currentPassword && formValues.currentPassword.trim().length > 0;
  };

  const hasChanges = () => {
    const hasNameChanges = isFirstNameChanged || isLastNameChanged;

    return isPasswordChanged ? hasNameChanges || isPasswordChanged : hasNameChanges;
  };

  const isSubmitEnabled = () => {
    if (!hasChanges()) return false;

    if (isPasswordChanged && (!isPasswordMatching() || !isCurrentPasswordFilled())) {
      return false;
    }

    return true;
  };

  if (isLoading) {
    return (
      <Box className="profile-wrapper">
        <Loader variant={LVariant.SPINNER} size={LSize.MD} className="profile-loader" />
      </Box>
    );
  }

  const { firstName, lastName, avatarURL, email } = currentUser as IUser;

  const onSubmit = async (data: EditProfileFormData) => {
    clearErrors();

    if (isPasswordChanged) {
      const isValid = await trigger(["password", "confirmPassword", "currentPassword"]);

      if (!isValid) return;
    }

    const { password, confirmPassword, currentPassword, ...rest } = data;

    const updates: Partial<EditProfileFormData> = {
      ...rest,
      ...(isPasswordChanged && {
        password,
        confirmPassword,
        currentPassword,
      }),
    };

    if (currentUser) {
      updateUser({
        uid: currentUser?.uid,
        updates,
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

  const disableSubmit = !isSubmitEnabled() || isSubmitting;

  return (
    <Box className="profile-wrapper">
      <Box className="profile-card">
        <RaDialog
          open={open}
          onClose={handleToggleDialog}
          title={editProfileDialog.title}
          content={
            <ProfileForm
              currentUser={currentUser as IUser}
              onSubmit={handleSubmit(onSubmit)}
              register={register}
              errors={errors}
              handleCancelClick={handleCancelClick}
              disableSubmit={disableSubmit}
              isPasswordChanged={isPasswordChanged}
              resetField={resetField}
              clearErrors={clearErrors}
            />
          }
        />

        <Box className="profile-card__settings-btn" onClick={handleToggleDialog}>
          <GearIcon className="profile-card__settings-icon" />
        </Box>

        <Avatar.Root className="profile-card__avatar-root">
          <Avatar.Image
            className="profile-card__avatar-image"
            src={avatarURL ?? undefined}
            alt={`${firstName} ${lastName}`}
          />
          <Avatar.Fallback className="profile-card__avatar-fallback">
            {firstName?.charAt(0).toUpperCase()}
            {lastName?.charAt(0).toUpperCase()}
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
