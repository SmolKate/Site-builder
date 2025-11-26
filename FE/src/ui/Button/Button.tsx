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
      className={`ui-button ui-button--${variant} ui-button--${size} ${className}`}
      {...restProps}
    >
      {buttonText}
    </button>
  );
};

export default Button;
