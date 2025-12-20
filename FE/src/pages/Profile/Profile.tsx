import { Avatar } from "radix-ui";
import { Box, Flex } from "@radix-ui/themes";
import { GearIcon } from "@radix-ui/react-icons";
import type { IUser } from "@/utils/types";
import { messages } from "@/locales";
import { useGetCurrentUserQuery } from "@/store/users";
import "./styles.scss";

export const Profile = () => {
  const { data: getCurrentUser, isLoading } = useGetCurrentUserQuery();

  if (isLoading) return messages.loading;

  const { firstName, lastName, avatarURL, email } = getCurrentUser as IUser;

  return (
    <Box className="profile-wrapper">
      <Box className="profile-card">
        <Box className="profile-card__settings-btn">
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
