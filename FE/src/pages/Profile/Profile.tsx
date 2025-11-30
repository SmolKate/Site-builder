import { Avatar } from "radix-ui";
import type { IUserProfile } from "@/utils/types";
import { Box, Flex } from "@radix-ui/themes";
import { GearIcon } from "@radix-ui/react-icons";
import "./styles.scss";

// временно, пока без БЭКА
const user: IUserProfile = {
  id: "",
  firstName: "Вася",
  lastName: "Пупкин",
  avatarURL: "",
  sites: [],
  email: "test@mail.ru",
  createdAt: "",
  updatedAt: "",
};

export const Profile = () => {
  const { firstName, lastName, avatarURL, email } = user;

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
