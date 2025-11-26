import {
  type UseFormRegister,
  type FieldValues,
  type FieldErrors,
  type Path,
} from "react-hook-form";
import { unstable_PasswordToggleField as PasswordToggleField } from "radix-ui";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { TVariant, type TVariantKeys } from "./../types";
import "../inputStyles.scss";

type IInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  autoComplete?: "current-password" | "new-password";
};

interface IPasswordFieldProps<TFieldValues extends FieldValues> extends IInputProps {
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  fieldName: Path<TFieldValues>;
  label?: string;
  placeholder: string;
  type?: string;
  wrapperClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  variant?: TVariantKeys;
}

const PasswordField = <TFieldValues extends FieldValues>(
  props: IPasswordFieldProps<TFieldValues>
) => {
  const {
    register,
    errors,
    fieldName,
    label,
    placeholder,
    wrapperClassName = "",
    inputClassName = "",
    errorClassName = "",
    variant = TVariant.PRIMARY,
    ...inputProps
  } = props;

  const error = errors?.[fieldName]?.message as string | undefined;
  const variantClassName =
    variant === TVariant.PRIMARY ? "field__wrapper--primary" : "field__wrapper--secondary";

  return (
    <div className={`field__wrapper ${variantClassName} ${wrapperClassName}`}>
      {label && (
        <label htmlFor={fieldName} className="text-gradient-special field__label">
          {label}
        </label>
      )}
      <PasswordToggleField.Root>
        <div className="field__input-root">
          <PasswordToggleField.Input
            id={fieldName}
            {...register(fieldName)}
            className={`field__input ${inputClassName}`}
            placeholder={placeholder}
            {...inputProps}
          />
          <PasswordToggleField.Toggle className="field__input-toggle" id={`${fieldName}-toggle`}>
            <PasswordToggleField.Icon visible={<EyeOpenIcon />} hidden={<EyeClosedIcon />} />
          </PasswordToggleField.Toggle>
        </div>
      </PasswordToggleField.Root>
      {error && <div className={`field__error ${errorClassName}`}>{error}</div>}
    </div>
  );
};

export default PasswordField;
