import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { Profile } from "./Profile";
import type { ReactNode } from "react";

const mockGetCurrentUser = vi.fn();
const mockUpdateUser = vi.fn();

vi.mock("@/store/users", async(importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useGetCurrentUserQuery: () => mockGetCurrentUser(),
    useUpdateUserMutation: () => [mockUpdateUser, { error: null }],
  };
});

vi.mock("@/components/Dialog", () => ({
  RaDialog: ({
    open,
    title,
    content,
  }: {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    content: ReactNode;
  }) =>
    open ? (
      <div data-testid="profile-dialog">
        <h2>{title}</h2>
        <div>{content}</div>
      </div>
    ) : null,
}));

vi.mock("@radix-ui/react-icons", () => ({
  GearIcon: () => <span data-testid="gear-icon">Gear</span>,
  InfoCircledIcon: () => <span data-testid="info-icon">Info</span>,
  EyeOpenIcon: () => <span>Eye Open</span>,
  EyeClosedIcon: () => <span>Eye Closed</span>,
}));

vi.mock("@radix-ui/themes", () => ({
  Box: ({
    children,
    className,
    onClick,
  }: {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
  }) => (
    <div className={className} onClick={onClick}>
      {children}
    </div>
  ),
  Flex: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@radix-ui/react-avatar", () => ({
  Root: ({ children }: { children: ReactNode }) => (
    <span className="profile-card__avatar-root">{children}</span>
  ),
  Image: () => null,
  Fallback: ({ children }: { children: ReactNode }) => (
    <span className="profile-card__avatar-fallback">{children}</span>
  ),
}));

describe("Profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetCurrentUser.mockReturnValue({
      data: {
        uid: "user-123",
        firstName: "Иван",
        lastName: "Иванов",
        email: "ivan@example.com",
        avatarURL: null,
      },
      isLoading: false,
    });

    mockUpdateUser.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({ data: "success" }),
    });
  });

  const renderProfile = () => {
    const mockStore = configureStore({
      reducer: {
        users: (state = {}) => state,
      },
    });

    return render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      </Provider>
    );
  };

  test("отображает информацию о пользователе", () => {
    renderProfile();

    expect(screen.getByText("Иван Иванов")).toBeInTheDocument();
    expect(screen.getByText("ivan@example.com")).toBeInTheDocument();
  });

  test("отображает аватар с инициалами", () => {
    renderProfile();

    const avatarRoot = document.querySelector(".profile-card__avatar-root");
    const avatarFallback = document.querySelector(".profile-card__avatar-fallback");

    expect(avatarRoot).toBeInTheDocument();
    expect(avatarFallback).toBeInTheDocument();
    expect(screen.getByText("ИИ")).toBeInTheDocument();
  });

  test("показывает лоадер при загрузке данных", () => {
    mockGetCurrentUser.mockReturnValue({
      data: null,
      isLoading: true,
    });

    renderProfile();

    expect(screen.getByText("Загрузка...")).toBeInTheDocument();
  });

  test("открывает диалог редактирования профиля", async() => {
    renderProfile();

    const editButton = screen.getByTestId("gear-icon");
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByTestId("profile-dialog")).toBeInTheDocument();
    });
  });

  test("редактирование имени и фамилии", async() => {
    renderProfile();

    const editButton = screen.getByTestId("gear-icon");
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByTestId("profile-dialog")).toBeInTheDocument();
    });

    const firstNameInput = screen.getByDisplayValue("Иван");
    const lastNameInput = screen.getByDisplayValue("Иванов");

    fireEvent.change(firstNameInput, { target: { value: "Петр" } });
    fireEvent.change(lastNameInput, { target: { value: "Петров" } });

    const submitButton = screen.getByRole("button", { name: "Сохранить" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({
        uid: "user-123",
        updates: expect.objectContaining({
          firstName: "Петр",
          lastName: "Петров",
        }),
      });
    });
  });

  test("закрытие диалога отменяет изменения", async() => {
    renderProfile();

    const editButton = screen.getByTestId("gear-icon");
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByTestId("profile-dialog")).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole("button", { name: "Отменить" });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByTestId("profile-dialog")).not.toBeInTheDocument();
    });

    expect(mockUpdateUser).not.toHaveBeenCalled();
  });
});
