import "@testing-library/jest-dom/vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { UniversalPopover } from "../UniversalPopover";
import type { PopoverButtonConfig, UniversalPopoverProps } from "../types";

const baseProps: UniversalPopoverProps = {
  isOpen: true,
  title: "Тестовый попап",
  onClose: vi.fn(),
};

const renderPopup = (props?: Partial<UniversalPopoverProps>) =>
  render(<UniversalPopover {...baseProps} {...props} />);

describe("UniversalPopup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("рендерит заголовок и текст", () => {
    renderPopup({ bodyText: "Привет!" });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Тестовый попап")).toBeInTheDocument();
    expect(screen.getByText("Привет!")).toBeInTheDocument();
  });

  it("не рендерится, когда isOpen=false", () => {
    renderPopup({ isOpen: false, bodyText: "Привет!" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("Привет!")).not.toBeInTheDocument();
  });

  it("использует children вместо bodyText, если они переданы", () => {
    renderPopup({
      bodyText: "Этот текст не должен отображаться",
      children: <span>Контент через children</span>,
    });

    expect(screen.getByText("Контент через children")).toBeInTheDocument();
    expect(screen.queryByText("Этот текст не должен отображаться")).not.toBeInTheDocument();
  });

  it("вызывает onClose при клике по кнопке закрытия", async() => {
    const onClose = vi.fn();
    renderPopup({ onClose });

    const user = userEvent.setup();
    const closeButton = screen.getByRole("button", { name: "Закрыть" });

    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("рендерит экшн-кнопки и вызывает их обработчики", async() => {
    const primaryHandler = vi.fn();
    const secondaryHandler = vi.fn();

    const primaryButton: PopoverButtonConfig = {
      label: "Ок",
      onClick: primaryHandler,
      variant: "primary",
    };

    const secondaryButton: PopoverButtonConfig = {
      label: "Отмена",
      onClick: secondaryHandler,
    };

    renderPopup({ primaryButton, secondaryButton });

    const user = userEvent.setup();

    await user.click(screen.getByText("Ок"));
    await user.click(screen.getByText("Отмена"));

    expect(primaryHandler).toHaveBeenCalledTimes(1);
    expect(secondaryHandler).toHaveBeenCalledTimes(1);
  });
});
