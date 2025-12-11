import { useEffect } from "react";
import { Button, InputField, Loader } from "@/ui";
import { LSize, LVariant } from "@/ui/Loader";
import { Box, Flex } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import { siteSchema, type SiteFormData } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { mainPageMessages } from "@/locales";
import { TVariant } from "@/ui/types";
import { useGetCurrentUserQuery, useUpdateUserMutation } from "@/store/users";
import { useUpdateSiteMutation } from "@/store/sites";
import "./styles.scss";

interface IFormDialogContent {
  onClose: () => void;
  site: { id: string; title: string, description?: string };
}

export const FormDialogContent = ({ site, onClose }: IFormDialogContent) => {
  const [updateUser] = useUpdateUserMutation();
  const { data: currentUser } = useGetCurrentUserQuery();
  const [updateSite] = useUpdateSiteMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitSuccessful, isSubmitting },
  } = useForm<SiteFormData>({
    resolver: yupResolver(siteSchema),
    mode: "onChange",
    values: {
      title: site.title,
      description: site.description || "",
    }
  });
  
  useEffect(() => {
    if (isSubmitSuccessful) {
      onClose();
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  // eslint-disable-next-line space-before-function-paren
  const onSubmit = async (data: SiteFormData) => {
    const { data: idSite } = await updateSite({
      id: site.id,
      updatesSite: { title: data.title,
        description: data.description },
    });

    if (currentUser && idSite) {
      updateUser({ uid: currentUser.uid!, updates: { sites: idSite } });
    }
  };

  return (
    <Flex>
      { isSubmitting && (
        <Box className="create-card__loader">
          <Loader variant={LVariant.DOTS} size={LSize.MD} />
        </Box>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="create-card__form">
        <InputField
          register={register}
          errors={errors}
          fieldName="title"
          placeholder={mainPageMessages.createCard.titlePlaceholder}
          variant={TVariant.SECONDARY}
        />
        <InputField
          register={register}
          errors={errors}
          fieldName="description"
          placeholder={mainPageMessages.createCard.descriptionPlaceholder}
          variant={TVariant.SECONDARY}
        />
        <Button buttonText={mainPageMessages.createCard.save} type="submit" disabled={!isValid || isSubmitting} />
      </form>
    </Flex>
  );
};
