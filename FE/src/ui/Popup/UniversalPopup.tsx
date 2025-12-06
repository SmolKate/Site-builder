import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/ui/Button";
import { useLockScroll } from "./useLockScroll";
import type { PopupButtonConfig, UniversalPopupProps } from "./types";
import "./styles.scss";

const renderButton = (config?: PopupButtonConfig) => {
  if (!config) {
    return null;
  }

  const { id, label, variant, size, ...rest } = config;

  return (
    <Button
      key={id ?? label}
      buttonText={label}
      variant={variant}
      size={size}
      {...rest}
    />
  );
};

export const UniversalPopup = ({
  isOpen,
  onClose,
  title,
  bodyText,
  children,
  primaryButton,
  secondaryButton,
  closeOnOverlay = true,
  closeOnEsc = true,
  showCloseIcon = true,
  className = "",
}: UniversalPopupProps) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const descriptionId = bodyText ? `${titleId}-description` : undefined;

  useLockScroll(isOpen);

  useEffect(() => {
    if (!isOpen || !closeOnEsc) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeOnEsc, onClose]);

  const handleOverlayMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!closeOnOverlay) {
      return;
    }

    if (event.target === overlayRef.current) {
      onClose();
    }
  };

  const bodyContent =
    children ??
    (bodyText ? <p className="ui-popup__text">{bodyText}</p> : null);

  if (!isOpen) {
    return null;
  }

  const panelClassName = ["ui-popup__panel", className]
    .filter(Boolean)
    .join(" ");

  const hasActions = Boolean(primaryButton || secondaryButton);

  return createPortal(
    <div className="ui-popup" role="presentation">
      <div
        className="ui-popup__overlay"
        ref={overlayRef}
        onMouseDown={handleOverlayMouseDown}
      >
        <div
          className={panelClassName}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
        >
          <header className="ui-popup__header">
            <h3 id={titleId} className="ui-popup__title">
              {title}
            </h3>
            {showCloseIcon ? (
              <button
                className="ui-popup__close"
                aria-label="Закрыть окно"
                onClick={onClose}
              >
                ×
              </button>
            ) : null}
          </header>

          {bodyText ? (
            <div id={descriptionId} className="ui-popup__body">
              {bodyContent}
            </div>
          ) : (
            <div className="ui-popup__body">{bodyContent}</div>
          )}

          {hasActions ? (
            <footer className="ui-popup__footer">
              {renderButton(secondaryButton)}
              {renderButton(primaryButton)}
            </footer>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
};
