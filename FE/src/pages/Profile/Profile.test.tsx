import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { messages } from "@/locales";
import { Profile } from "./Profile";

const mockUser = {
  firstName: "John",
  lastName: "Doe",
  avatarURL: "https://example.com/avatar.jpg",
  email: "john.doe@example.com",
};

let mockIsLoading = false;

vi.mock("@/store/users", () => ({
  useGetCurrentUserQuery: () => ({
    data: mockUser,
    isLoading: mockIsLoading,
  }),
}));

const renderProfile = (options?: { user?: typeof mockUser; isLoading?: boolean }) => {
  const { user = mockUser, isLoading = false } = options || {};

  // update mock values before render
  ((mockUser.firstName = user.firstName),
    (mockUser.lastName = user.lastName),
    (mockUser.avatarURL = user.avatarURL),
    (mockUser.email = user.email));

  mockIsLoading = isLoading;

  return render(<Profile />);
};

describe("Profile", () => {
  test("renders loading state when data is loading", () => {
    renderProfile({ isLoading: true });

    expect(screen.getByText(messages.loading)).toBeInTheDocument();
  });

  test("renders user name, email and avatar when data is loaded", () => {
    const user = {
      firstName: "Alice",
      lastName: "Smith",
      avatarURL: "https://example.com/alice.jpg",
      email: "alice.smith@example.com",
    };

    const { container } = renderProfile({ user, isLoading: false });

    const fullName = `${user.firstName} ${user.lastName}`;

    expect(screen.getByText(fullName)).toBeInTheDocument();
    expect(screen.getByText(user.email)).toBeInTheDocument();
    const initials = user.firstName.charAt(0).toUpperCase() + user.lastName.charAt(0).toUpperCase();
    expect(screen.getByText(initials)).toBeInTheDocument();

    expect(container.querySelector(".profile-wrapper")).toBeInTheDocument();
    expect(container.querySelector(".profile-card__settings-icon")).toBeInTheDocument();
  });
});
