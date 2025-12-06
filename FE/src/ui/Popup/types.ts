import { type ReactNode } from "react";
import { type TButtonSizeKeys, type TButtonVariantKeys } from "@/ui/types";

export interface PopupButtonConfig
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  id?: string;
  label: string;
  variant?: TButtonVariantKeys;
  size?: TButtonSizeKeys;
}

export interface UniversalPopupProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  bodyText?: string;
  children?: ReactNode;
  primaryButton?: PopupButtonConfig;
  secondaryButton?: PopupButtonConfig;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  showCloseIcon?: boolean;
  className?: string;
}

export type PopupBodyContent = Pick<
  UniversalPopupProps,
  "bodyText" | "children"
>;
