import * as Popover from "@radix-ui/react-popover";
import "./RaPopover.scss";

export const RaPopover = () => {
  return (
    <div className="main-popover">
      <Popover.Root>
        <Popover.Trigger className="main-popover__trigger">
          More info
        </Popover.Trigger>
        <Popover.Portal>
          {/* Добавляем обертку с CSS переменными внутри портала */}
          <div className="main-popover__portal-wrapper">
            <Popover.Content 
              className="main-popover__content" 
              sideOffset={5}
            >
              <div className="main-popover__header">
                <h3 className="main-popover__title">Detailed Information</h3>
                <Popover.Close className="main-popover__close" aria-label="Close">
                  ×
                </Popover.Close>
              </div>
              <div className="main-popover__body">
                <p className="main-popover__text">
                  Some more info… This is the detailed content that appears in the popover.
                  You can add any content here including forms, lists, etc.
                </p>
              </div>
              <Popover.Arrow className="main-popover__arrow" />
            </Popover.Content>
          </div>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};
