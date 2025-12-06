import * as Popover from "@radix-ui/react-popover";
import { Button } from "@/ui/Button";
import type { PopoverButtonConfig, UniversalPopoverProps } from "./types";
import "./styles.scss";

const renderButton = (config?: PopoverButtonConfig) => {
  if (!config) return null;

  const { id, label, variant, size, ...rest } = config;

  return <Button id={id} buttonText={label} variant={variant} size={size} {...rest} />;
};

export const UniversalPopover = ({
  isOpen,
  onClose,
  title,
  bodyText,
  children,
  primaryButton,
  secondaryButton,
  showCloseIcon = true,
  className = "",
}: UniversalPopoverProps) => {
  const hasActions = Boolean(primaryButton || secondaryButton);
  const bodyContent = children ?? (bodyText ? <p className="ui-popover__text">{bodyText}</p> : null);

  return (
    <Popover.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Popover.Trigger className="ui-popover__trigger"></Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={`ui-popover__content ${className}`.trim()} sideOffset={8}>
          <header className="ui-popover__header">
            <h2 className="ui-popover__title">{title}</h2>
            {showCloseIcon && (
              <button
                type="button"
                className="ui-popover__close"
                aria-label="Закрыть"
                onClick={onClose}
              >
                ×
              </button>
            )}
          </header>

          <div className="ui-popover__body">{bodyContent}</div>

          {hasActions && (
            <footer className="ui-popover__footer">
              {secondaryButton && renderButton(secondaryButton)}
              {primaryButton && renderButton(primaryButton)}
            </footer>
          )}

          <Popover.Arrow className="ui-popover__arrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
