import { MAIN_DIALOG } from "@/locales/mainPage";
import { Button } from "@/ui";
import { Box, Flex } from "@radix-ui/themes";
import "./styles.scss";

interface IMainDialogContent {
  onClose: () => void;
  site: { id: string; title: string };
  onDelete: (id: string) => void;
}

export const MainDialogContent = ({ site, onDelete, onClose }: IMainDialogContent) => {
  const handleDelete = (id: string) => {
    onDelete(id);
    onClose();
  };
  return (
    <Flex>
      <Box className="dialog__content">{`${MAIN_DIALOG.notification} "${site.title}"`}</Box>
      <Box className="dialog__actions">
        <Button
          buttonText={MAIN_DIALOG.primaryButton}
          variant="danger"
          onClick={() => handleDelete(site.id)}
        />
        <Button buttonText={MAIN_DIALOG.secondaryButton} variant="secondary" onClick={onClose} />
      </Box>
    </Flex>
  );
};
