import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from 'vitest'
import type { FieldErrors, FieldValues } from "react-hook-form";
import { ThemeProvider } from "@/context/ThemeContext";
import { useForm } from "@/utils/mocks";
import { TVariant } from "../types";
import InputField, { type IInputFieldProps} from "./InputField";

const renderInputField = (props: Omit<IInputFieldProps<FieldValues>, "register" | "errors"> & {errorMessage?: string}) => {
  const { register } = useForm();
  const {
    errorMessage,
    fieldName,
    label,
    placeholder,
    type,
    wrapperClassName,
    inputClassName,
    errorClassName,
    isDisabled,
    variant
  } = props;

  const errors = {[fieldName]: {message: errorMessage}} as FieldErrors<FieldValues>

  return render(
    <ThemeProvider>
      <InputField
        register={register}
        label={label}
        errors={errorMessage ? errors : undefined}
        fieldName={fieldName}
        placeholder={placeholder}
        type={type}
        wrapperClassName={wrapperClassName}
        inputClassName={inputClassName}
        errorClassName={errorClassName}
        isDisabled={isDisabled}
        variant={variant}
      />
    </ThemeProvider>
  );
};

describe("InputField", () => {
  test("renders placeholder", () => {
    const placeholder = "test placeholder";
    renderInputField({
      errorMessage: "",
      fieldName: "",
      placeholder,
    });

    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });

  test("renders error message", () => {
    const errorMessage = "test message";
    renderInputField({
      errorMessage,
      fieldName: "",
      placeholder: "",
    });

    expect(screen.getByTestId("input-error-text")).toHaveTextContent(errorMessage);
  });

  test("renders disabled input", () => {
    renderInputField({
      fieldName: "",
      placeholder: "",
      isDisabled: true,
    });

    expect(screen.getByRole("textbox")).toHaveAttribute("disabled");
  });


  test("renders secondary variant", () => {
    const container = renderInputField({
      fieldName: "",
      placeholder: "",
      variant: TVariant.SECONDARY,
    });

    expect(container.container.firstChild).toHaveClass(`field__wrapper--${TVariant.SECONDARY}`);
  });

  test("renders label", () => {
    const testLabel = "test label";
    renderInputField({
      fieldName: "fieldName",
      placeholder: "",
      label: testLabel,
    });

    expect(screen.getByLabelText(testLabel)).toBeInTheDocument();
  });

  test("renders custom classnames", () => {
    const errorMessage = "test message";
    const wrapperClassName = "test-wrapper";
    const inputClassName = "test-input";
    const errorClassName = "test-error";
    const container = renderInputField({
      errorMessage,
      fieldName: "",
      placeholder: "",
      wrapperClassName,
      inputClassName,
      errorClassName,
    });

    const errorElement = screen.getByTestId("input-error-text");
    const inputElement = screen.getByRole("textbox");

    expect(errorElement).toHaveClass(errorClassName);
    expect(inputElement).toHaveClass(inputClassName);
    expect(container.container.firstChild).toHaveClass(wrapperClassName);
  });
});