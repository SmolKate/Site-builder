import type { ReactNode } from "react";
import type { TButtonSizeKeys, TButtonVariantKeys } from "@/ui/types";

export interface PopoverButtonConfig
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  id?: string;
  label: string;
  variant?: TButtonVariantKeys;
  size?: TButtonSizeKeys;
}

export interface UniversalPopoverProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  bodyText?: string;
  children?: ReactNode;
  primaryButton?: PopoverButtonConfig;
  secondaryButton?: PopoverButtonConfig;
  showCloseIcon?: boolean;
  className?: string;
}
