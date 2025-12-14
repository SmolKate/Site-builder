import type { UseFormRegister, FieldValues, FieldErrors, Path } from "react-hook-form";
import { TVariant, type TVariantKeys } from "./../types";
import "../inputStyles.scss";

type IInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export interface IInputFieldProps<TFieldValues extends FieldValues> extends IInputProps {
  register: UseFormRegister<TFieldValues>;
  errors?: FieldErrors<TFieldValues>;
  fieldName: Path<TFieldValues>;
  label?: string;
  placeholder: string;
  type?: string;
  wrapperClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  isDisabled?: boolean;
  variant?: TVariantKeys;
}

const InputField = <TFieldValues extends FieldValues>(props: IInputFieldProps<TFieldValues>) => {
  const {
    register,
    errors,
    fieldName,
    label,
    placeholder,
    type = "text",
    wrapperClassName = "",
    inputClassName = "",
    errorClassName = "",
    isDisabled = false,
    variant = TVariant.PRIMARY,
    ...inputProps
  } = props;

  const error = errors?.[fieldName]?.message as string | undefined;

  const variantClassName =
    variant === TVariant.PRIMARY ? "field__wrapper--primary" : "field__wrapper--secondary";

  return (
    <div className={`field__wrapper ${variantClassName} ${wrapperClassName}`}>
      {label && <label htmlFor={fieldName}>{label}</label>}
      <div className="field__input-root">
        <input
          id={fieldName}
          type={type}
          {...register(fieldName)}
          className={`field__input ${inputClassName}`}
          placeholder={placeholder}
          disabled={isDisabled}
          autoComplete="off"
          {...inputProps}
        />
      </div>
      {error && (
        <div className={`field__error ${errorClassName}`} data-testid="input-error-text">
          {error}
        </div>
      )}
    </div>
  );
};

export default InputField;
