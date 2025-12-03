import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { ThemeProvider } from "@/context/ThemeContext";
import { Header } from "./Header";

let mockIsAuthenticated = false;
const mockLogout = vi.fn();

vi.mock("@/store/auth", () => ({
  useGetAuthStatusQuery: () => ({ data: mockIsAuthenticated }),
  useLogoutUserMutation: () => [mockLogout],
}));

const renderHeader = (options?: { isAuthenticated?: boolean; initialEntries?: string[] }) => {
  const { isAuthenticated = false, initialEntries = ["/login"] } = options || {};

  mockIsAuthenticated = isAuthenticated;

  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <Header />
      </MemoryRouter>
    </ThemeProvider>
  );
};

describe("Header", () => {
  test("renders navigation items", () => {
    renderHeader();

    expect(screen.getByText(/Main/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Login page/i)).toBeInTheDocument();
  });

  test("highlights Login page link when on /login route", () => {
    renderHeader({ initialEntries: ["/login"] });

    const loginPageLink = screen.getByText(/Login page/i);
    expect(loginPageLink).toHaveClass("auth-header__link--pill-active");
  });

  test("shows login and register buttons when user is not authenticated", () => {
    renderHeader({ isAuthenticated: false });

    expect(screen.getByRole("button", { name: /^Login$/i })).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.queryByText(/Logout/i)).not.toBeInTheDocument();
  });

  test("shows logout button when user is authenticated", () => {
    renderHeader({ isAuthenticated: true });

    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Login$/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Register/i)).not.toBeInTheDocument();
  });

  test("toggles theme label on click", () => {
    renderHeader();

    const toggleButton = screen.getByRole("button", { name: /Light|Dark/i });
    const initialText = toggleButton.textContent;

    fireEvent.click(toggleButton);

    expect(toggleButton.textContent).not.toBe(initialText);
  });
});
