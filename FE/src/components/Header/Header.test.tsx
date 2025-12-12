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
      <MemoryRouter initialEntries={initialEntries}>
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe("Header", () => {
  test("рендерит навигационные ссылки", () => {
    renderHeader();

    expect(screen.getByText(/Главная/i)).toBeInTheDocument();
    expect(screen.getByText(/Профиль/i)).toBeInTheDocument();
    const loginLinks = screen.getAllByText(/Войти/i);
    expect(loginLinks.length).toBeGreaterThan(0);
  });

  test("подсвечивает ссылку 'Войти' на роуте /login", () => {
    renderHeader({ initialEntries: ["/login"] });

    const loginElements = screen.getAllByText(/Войти/i);

    const activeLink = loginElements.find((el) => el.tagName === "A");

    expect(activeLink).toBeInTheDocument();
    expect(activeLink).toHaveClass("auth-header__link--pill-active");
  });

  test("показывает кнопки Войти и Зарегистрироваться, когда пользователь не авторизован", () => {
    renderHeader({ isAuthenticated: false });

    const loginButton = screen.getByRole("button", { name: /Войти/i });
    expect(loginButton).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Зарегистироваться/i })).toBeInTheDocument();

    expect(screen.queryByText(/Выйти/i)).not.toBeInTheDocument();
  });

  test("показывает кнопку Выйти, когда пользователь авторизован", () => {
    renderHeader({ isAuthenticated: true });

    expect(screen.getByRole("button", { name: /Выйти/i })).toBeInTheDocument();

    expect(screen.queryByRole("button", { name: /Зарегистироваться/i })).not.toBeInTheDocument();
  });

  test("кнопка переключения темы кликается без ошибок", () => {
    renderHeader();

    const toggleButton = screen.getByRole("button", { name: /Переключить на/i });
    fireEvent.click(toggleButton);

    expect(toggleButton).toBeInTheDocument();
  });
});
