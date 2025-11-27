import { Outlet } from "react-router-dom";
import { Box, Flex } from "@radix-ui/themes";
import { Header } from "@/components";
import "./styles.scss";

export const MainLayout = () => {
  return (
    <Flex direction="column" className="main-layout">
      <Box className="main-layout__header">
        <Header />
      </Box>

      <Box className="main-layout__content">
        <Outlet />
      </Box>
    </Flex>
  );
};
