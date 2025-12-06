import * as Dialog from "@radix-ui/react-dialog";
import "./RaDialog.scss";
import { useRef } from "react";

interface IRaDialog {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  content: React.ReactElement;
}

export const RaDialog = ({ open, onClose, title, description, content }: IRaDialog) => {
  const startAutoFocusRef = useRef<HTMLDivElement>(null);
  return (
    <div className="main-dialog">
      <Dialog.Root open={open}>
        <Dialog.Portal>
          <div className="main-dialog__portal-wrapper">
            <Dialog.Overlay className="main-dialog__overlay" />
            <Dialog.Content
              className="main-dialog__content"
              onOpenAutoFocus={(e) => {
                e.preventDefault();
                startAutoFocusRef.current?.focus();
              }}
            >
              <div className="main-dialog__header" ref={startAutoFocusRef}>
                <Dialog.Title className="main-dialog__title">{title}</Dialog.Title>
                {description && (
                  <Dialog.Description className="main-dialog__description">
                    {description}
                  </Dialog.Description>
                )}
              </div>

              <div className="main-dialog__body ">{content}</div>

              <Dialog.Close asChild>
                <button className="main-dialog__close-button" aria-label="Close" onClick={onClose}>
                  ×
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};
