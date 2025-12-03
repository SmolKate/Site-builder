import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { TButtonSize, TButtonVariant } from "../types";
import { Button } from ".";

describe("Button", () => {
  test("does not render without buttonText", () => {
    const { container } = render(<Button />);

    expect(container.firstChild).toBeNull();
  });

  test("renders with provided buttonText", () => {
    const text = "Click me";

    render(<Button buttonText={text} />);

    expect(
      screen.getByRole("button", {
        name: text,
      })
    ).toBeInTheDocument();
  });

  test("applies default variant and size classes", () => {
    const text = "Default button";

    render(<Button buttonText={text} />);

    const button = screen.getByRole("button", { name: text });

    expect(button).toHaveClass(
      `ui-button`,
      `ui-button--${TButtonVariant.PRIMARY}`,
      `ui-button--${TButtonSize.MEDIUM}`
    );
  });

  test("applies provided variant and size classes", () => {
    const text = "Danger small";

    render(<Button buttonText={text} variant={TButtonVariant.DANGER} size={TButtonSize.SMALL} />);

    const button = screen.getByRole("button", { name: text });

    expect(button).toHaveClass(
      `ui-button--${TButtonVariant.DANGER}`,
      `ui-button--${TButtonSize.SMALL}`
    );
  });

  test("merges custom className with base classes", () => {
    const text = "With class";
    const extraClass = "extra-class";

    render(<Button buttonText={text} className={extraClass} />);

    const button = screen.getByRole("button", { name: text });

    expect(button).toHaveClass("ui-button");
    expect(button).toHaveClass(extraClass);
  });

  test("handles click events", async() => {
    const text = "Clickable";
    const handleClick = vi.fn();

    render(<Button buttonText={text} onClick={handleClick} />);

    await userEvent.click(screen.getByRole("button", { name: text }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
