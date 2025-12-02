import clsx from "clsx";
import {
  TButtonSize,
  TButtonVariant,
  type TButtonSizeKeys,
  type TButtonVariantKeys,
} from "../types";
import "./styles.scss";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonText?: string;
  className?: string;
  variant?: TButtonVariantKeys;
  size?: TButtonSizeKeys;
}

const Button = (props: IButtonProps) => {
  const {
    buttonText,
    className,
    variant = TButtonVariant.PRIMARY,
    size = TButtonSize.MEDIUM,
    ...restProps
  } = props;

  if (!buttonText) return null;

  return (
    <button
      className={clsx(className, "ui-button",  `ui-button--${variant}`, `ui-button--${size}`)}
      {...restProps}
    >
      {buttonText}
    </button>
  );
};

export default Button;
