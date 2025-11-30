import * as Dialog from "@radix-ui/react-dialog";
import "./RaDialog.scss";

export const RaDialog = () => (
  <div className="main-dialog">
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="main-dialog__trigger">Edit profile</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <div className="main-dialog__portal-wrapper">
          <Dialog.Overlay className="main-dialog__overlay" />
          <Dialog.Content className="main-dialog__content">
            <div className="main-dialog__header">
              <Dialog.Title className="main-dialog__title">Edit profile</Dialog.Title>
              <Dialog.Description className="main-dialog__description">
                Make changes to your profile here. Click save when you're done.
              </Dialog.Description>
            </div>

            <div className="main-dialog__body">
              <fieldset className="main-dialog__fieldset">
                <label className="main-dialog__label" htmlFor="name">
                  Name
                </label>
                <input className="main-dialog__input" id="name" defaultValue="Pedro Duarte" />
              </fieldset>

              <fieldset className="main-dialog__fieldset">
                <label className="main-dialog__label" htmlFor="username">
                  Username
                </label>
                <input className="main-dialog__input" id="username" defaultValue="@peduarte" />
              </fieldset>
            </div>

            <div className="main-dialog__footer">
              <Dialog.Close asChild>
                <button className="main-dialog__save-button">Save changes</button>
              </Dialog.Close>
            </div>

            <Dialog.Close asChild>
              <button className="main-dialog__close-button" aria-label="Close">
                ×
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  </div>
);
