import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Login } from "./Login";

const mockNavigate = vi.fn();
const mockLoginUser = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      pathname: "/login",
      state: { from: "/profile" },
    }),
  };
});

vi.mock("@/store/auth", () => ({
  useLoginUserMutation: () => [mockLoginUser],
}));

const renderLogin = () =>
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Login />
    </MemoryRouter>
  );

describe("Login page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders email and password fields and submit button", () => {
    renderLogin();

    expect(screen.getByLabelText("Электронная почта")).toBeInTheDocument();
    expect(screen.getByLabelText("Пароль")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Войти",
      })
    ).toBeInTheDocument();
  });

  test("submits form with correct values and navigates to 'from' location", async () => {
    renderLogin();

    const emailInput = screen.getByLabelText("Электронная почта");
    const passwordInput = screen.getByLabelText("Пароль");
    const submitButton = screen.getByRole("button", { name: "Войти" });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledTimes(1);
    });

    expect(mockLoginUser).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });

    expect(mockNavigate).toHaveBeenCalledWith("/profile", { replace: true });
  });
});
