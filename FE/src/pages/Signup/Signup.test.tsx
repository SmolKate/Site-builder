import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Signup } from "./Signup";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      pathname: "/signup",
      state: { from: "/profile" },
    }),
  };
});

const renderSignup = () =>
  render(
    <MemoryRouter initialEntries={["/signup"]}>
      <Signup />
    </MemoryRouter>
  );

describe("Signup page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders all input fields and disabled submit button by default", () => {
    renderSignup();

    expect(screen.getByLabelText("Имя")).toBeInTheDocument();
    expect(screen.getByLabelText("Фамилия")).toBeInTheDocument();
    expect(screen.getByLabelText("Электронная почта")).toBeInTheDocument();
    expect(screen.getByLabelText("Пароль")).toBeInTheDocument();
    expect(screen.getByLabelText("Повторить пароль")).toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: "Зарегистрироваться",
    });

    expect(submitButton).toBeDisabled();
  });

  test("enables submit button when form is valid and navigates to 'from' location", async () => {
    renderSignup();

    const firstNameInput = screen.getByLabelText("Имя");
    const lastNameInput = screen.getByLabelText("Фамилия");
    const emailInput = screen.getByLabelText("Электронная почта");
    const passwordInput = screen.getByLabelText("Пароль");
    const confirmPasswordInput = screen.getByLabelText("Повторить пароль");
    const submitButton = screen.getByRole("button", {
      name: "Зарегистрироваться",
    });

    await userEvent.type(firstNameInput, "Иван");
    await userEvent.type(lastNameInput, "Иванов");
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.type(confirmPasswordInput, "password123");

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    await userEvent.click(submitButton);

    expect(mockNavigate).toHaveBeenCalledWith("/profile", { replace: true });
  });

  test("shows error when passwords do not match and keeps submit button disabled", async () => {
    renderSignup();

    const passwordInput = screen.getByLabelText("Пароль");
    const confirmPasswordInput = screen.getByLabelText("Повторить пароль");
    const submitButton = screen.getByRole("button", {
      name: "Зарегистрироваться",
    });

    await userEvent.type(passwordInput, "password123");
    await userEvent.type(confirmPasswordInput, "different");

    await waitFor(() => {
      expect(screen.getByText("Пароли не совпадают")).toBeInTheDocument();
    });

    expect(submitButton).toBeDisabled();
  });

  test("renders link to login page", () => {
    renderSignup();

    const loginLink = screen.getByRole("link", { name: "Войти" });

    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
  });
});
