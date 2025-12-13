import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { store } from "@/store";
import { MainPage } from "./MainPage";

const mockFetchSites = vi.fn();
const mockAddSite = vi.fn();
const mockDeleteSite = vi.fn();
const mockGetCurrentUser = vi.fn();
const mockUpdateUser = vi.fn();

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async(importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      state: {},
      pathname: "/",
    }),
  };
});

vi.mock("@/store/sites", async(importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useFetchSitesQuery: () => mockFetchSites(),
    useAddSiteMutation: () => [mockAddSite],
    useDeleteSiteMutation: () => [mockDeleteSite],
  };
});

vi.mock("@/store/users", async(importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useGetCurrentUserQuery: () => mockGetCurrentUser(),
    useUpdateUserMutation: () => [mockUpdateUser],
  };
});

vi.mock("@/ui", async(importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    Loader: () => <div data-testid="loader">Loading...</div>,
  };
});

describe("MainPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFetchSites.mockReturnValue({
      data: [],
      isLoading: false,
    });
    mockGetCurrentUser.mockReturnValue({
      data: { uid: "user-123", sites: [] },
    });
    mockAddSite.mockResolvedValue({ data: "new-site-id" });
  });

  const renderMainPage = () => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );
  };

  test("рендерит лоадер при загрузке данных", () => {
    mockFetchSites.mockReturnValue({
      data: [],
      isLoading: true,
    });

    renderMainPage();
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  test("показывает сообщение, если сайтов нет", () => {
    renderMainPage();
    expect(screen.getByText(/Нет сайтов для отображения/i)).toBeInTheDocument();
  });

  test("рендерит список сайтов", () => {
    const mockSites = [
      {
        id: "1",
        title: "Test Site 1",
        description: "Description 1",
        createdAt: "2023-01-01T00:00:00.000Z",
        published: true,
      },
      {
        id: "2",
        title: "Test Site 2",
        description: "Description 2",
        createdAt: "2023-01-02T00:00:00.000Z",
        published: false,
      },
    ];

    mockFetchSites.mockReturnValue({
      data: mockSites,
      isLoading: false,
    });

    renderMainPage();

    expect(screen.getByText("Test Site 1")).toBeInTheDocument();
    expect(screen.getByText("Test Site 2")).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByText("Live")).toBeInTheDocument();
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  test("переход на страницу конструктора при клике на карточку сайта", () => {
    const mockSites = [
      {
        id: "site-1",
        title: "My Site",
        description: "Desc",
        createdAt: "2023-01-01",
        published: false,
      },
    ];

    mockFetchSites.mockReturnValue({
      data: mockSites,
      isLoading: false,
    });

    renderMainPage();

    fireEvent.click(screen.getByText("My Site"));

    expect(mockNavigate).toHaveBeenCalledWith("/sites/site-1");
  });

  test("удаление сайта открывает диалог подтверждения", () => {
    const mockSites = [
      {
        id: "site-1",
        title: "Delete Me",
        description: "Desc",
        createdAt: "2023-01-01",
        published: false,
      },
    ];

    mockFetchSites.mockReturnValue({
      data: mockSites,
      isLoading: false,
    });

    renderMainPage();

    const deleteButton = screen.getByText(/Удалить/i);
    fireEvent.click(deleteButton);

    expect(screen.getByText(/Вы действительно хотите удалить сайт/i)).toBeInTheDocument();

    const deleteTexts = screen.getAllByText(/Delete Me/i);
    expect(deleteTexts.length).toBeGreaterThan(0);
  });

  test("создание нового сайта", async() => {
    renderMainPage();

    const titleInput = screen.getByPlaceholderText(/Название проекта/i);
    const descInput = screen.getByPlaceholderText(/Краткое описание/i);

    fireEvent.change(titleInput, { target: { value: "New Site" } });
    fireEvent.change(descInput, { target: { value: "New Description" } });

    await waitFor(() => {
      const createButton = screen.getByRole("button", { name: /Создать сайт/i });
      expect(createButton).not.toBeDisabled();
    });

    const createButton = screen.getByRole("button", { name: /Создать сайт/i });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockAddSite).toHaveBeenCalledWith({
        newSite: expect.objectContaining({
          title: "New Site",
          description: "New Description",
        }),
        siteContent: { components: {}, layout: [] },
      });
    });

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/sites/new-site-id");
    });
  });

  test("фильтрация сайтов по поиску", async() => {
    const mockSites = [
      { id: "1", title: "Apple", description: "", createdAt: "2023-01-01", published: false },
      { id: "2", title: "Banana", description: "", createdAt: "2023-01-02", published: false },
    ];

    mockFetchSites.mockReturnValue({
      data: mockSites,
      isLoading: false,
    });

    renderMainPage();

    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/Поиск по названию/i);
    fireEvent.change(searchInput, { target: { value: "App" } });

    await waitFor(
      () => {
        expect(screen.getByText("Apple")).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });
});
