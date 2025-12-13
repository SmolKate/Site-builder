import "@testing-library/jest-dom/vitest";

import { MemoryRouter } from "react-router-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { ThemeProvider } from "@/context/ThemeContext";
import { Header } from "./Header";
import { Provider } from "react-redux";
import { store } from "@/store";

const mockAuthState: { isAuthenticated: boolean } = { isAuthenticated: false };
const mockLogoutUser = vi.fn();

vi.mock("@/store/auth", async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useGetAuthStatusQuery: () => ({
      data: { isAuth: mockAuthState.isAuthenticated },
    }),
    useLogoutUserMutation: () => [mockLogoutUser],
  };
});

const renderHeader = (options?: { isAuthenticated?: boolean; initialEntries?: string[] }) => {
  const { isAuthenticated = false, initialEntries = ["/login"] } = options || {};

  mockAuthState.isAuthenticated = isAuthenticated;

  return render(
    <Provider store={store}>
      <ThemeProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <Header />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );
};

describe("Header", () => {
  test("рендерит навигационные ссылки", () => {
    renderHeader();

    expect(screen.getByText(/Main/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Login page/i)).toBeInTheDocument();
  });

  test("подсвечивает ссылку Login page на роуте /login", () => {
    renderHeader({ initialEntries: ["/login"] });

    const loginPageLink = screen.getByText(/Login page/i);
    expect(loginPageLink).toHaveClass("auth-header__link--pill-active");
  });

  test("показывает кнопки Login и Register, когда пользователь не авторизован", () => {
    renderHeader({ isAuthenticated: false });

    expect(screen.getByRole("button", { name: /^Login$/i })).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.queryByText(/Logout/i)).not.toBeInTheDocument();
  });

  test("показывает кнопку Logout, когда пользователь авторизован", () => {
    renderHeader({ isAuthenticated: true });

    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Login$/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Register/i)).not.toBeInTheDocument();
  });

  test("кнопка переключения темы кликается без ошибок", () => {
    renderHeader();

    const toggleButton = screen.getByRole("button", { name: /Переключить на/i });

    fireEvent.click(toggleButton);

    expect(toggleButton).toBeInTheDocument();
  });
});
