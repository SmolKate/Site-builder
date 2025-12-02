import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import type { FieldErrors, FieldValues } from "react-hook-form";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/context/ThemeContext";
import { useForm } from "@/utils/mocks";
import PasswordField, { type IPasswordFieldProps} from "./PasswordField";
import { TVariant } from "../types";

type TRenderPasswordFieldProps = Omit<IPasswordFieldProps<FieldValues>, "register" | "errors"> & {errorMessage?: string}

const renderPasswordField = (props: TRenderPasswordFieldProps) => {
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
    variant
  } = props;

  const errors = {[fieldName]: {message: errorMessage}} as FieldErrors<FieldValues>;

  return render(
    <ThemeProvider>
      <PasswordField
        register={register}
        label={label}
        errors={errorMessage ? errors : undefined}
        fieldName={fieldName}
        placeholder={placeholder}
        type={type}
        wrapperClassName={wrapperClassName}
        inputClassName={inputClassName}
        errorClassName={errorClassName}
        variant={variant}
      />
    </ThemeProvider>
  );
};

describe("PasswordField", () => {
  test("renders placeholder", () => {
    const placeholder = "test placeholder";
    renderPasswordField({
      errorMessage: "",
      fieldName: "",
      placeholder,
    });

    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });

  test("renders error message", () => {
    const errorMessage = "test message";
    renderPasswordField({
      errorMessage,
      fieldName: "",
      placeholder: "",
    });

    expect(screen.getByTestId("input-error-text")).toHaveTextContent(errorMessage);
  });

  test("renders secondary variant", () => {
    const container = renderPasswordField({
      fieldName: "",
      placeholder: "",
      variant: TVariant.SECONDARY,
    });

    expect(container.container.firstChild).toHaveClass(`field__wrapper--${TVariant.SECONDARY}`);
  });

  test("renders label", () => {
    const testLabel = "test label";
    renderPasswordField({
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
    const testPlaceholder = "test placeholder";

    const container = renderPasswordField({
      errorMessage,
      fieldName: "",
      placeholder: testPlaceholder,
      wrapperClassName,
      inputClassName,
      errorClassName,
    });

    const errorElement = screen.getByTestId("input-error-text");
    const inputElement = screen.getByPlaceholderText(testPlaceholder);

    expect(errorElement).toHaveClass(errorClassName);
    expect(inputElement).toHaveClass(inputClassName);
    expect(container.container.firstChild).toHaveClass(wrapperClassName);
  });

  test("click password toggle", async() => {
    const testPlaceholder = "test placeholder";
    renderPasswordField({
      fieldName: "fieldName",
      placeholder: testPlaceholder,
    });

    const inputElement = screen.getByPlaceholderText(testPlaceholder);
    expect(inputElement).toHaveAttribute("type", "password");
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Show password");
    await userEvent.click(screen.getByRole("button"));
    expect(inputElement).toHaveAttribute("type", "text");
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Hide password");
  });
});