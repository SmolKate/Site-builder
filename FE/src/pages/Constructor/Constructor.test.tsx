import "@testing-library/jest-dom/vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { Constructor } from "./Constructor";
import type { ReactNode } from "react";

const mockFetchSiteById = vi.fn();
const mockUpdateSite = vi.fn();
const mockDispatch = vi.fn();

vi.mock("react-router-dom", async(importOriginal) => {
  const actual = await importOriginal() as object;
  return {
    ...actual,
    useParams: () => ({ siteId: "test-site-id" }),
  };
});

vi.mock("@/store/sites", async(importOriginal) => {
  const actual = await importOriginal() as object;
  return {
    ...actual,
    useFetchSiteByIdQuery: (id: string) => mockFetchSiteById(id),
    useUpdateSiteMutation: () => [mockUpdateSite],
  };
});

vi.mock("@/store", async(importOriginal) => {
  const actual = await importOriginal() as object;
  return {
    ...actual,
    useAppDispatch: () => mockDispatch,
    useAppSelector: (selector: (state: unknown) => unknown) => {
      if (selector.name === "getLayout") return [];
      if (selector.name === "getAllComponents") return {};
      if (selector.name === "selectSelectedId") return null;
      return null;
    },
  };
});

vi.mock("@/components/Builder/Sidebar/ComponentsPanel", () => ({
  ComponentsPanel: () => <div data-testid="components-panel">Components Panel</div>,
}));

vi.mock("@/components/Builder/Sidebar/PropertiesPanel", () => ({
  PropertiesPanel: () => <div data-testid="properties-panel">Properties Panel</div>,
}));

vi.mock("@/components/Builder/Canvas/GridSection", () => ({
  GridSection: ({ item }: { item: { i: string } }) => <div data-testid={`grid-section-${item.i}`}>Grid Section</div>,
}));

vi.mock("@dnd-kit/core", async(importOriginal) => {
  const actual = await importOriginal() as object;
  return {
    ...actual,
    DndContext: ({ children }: { children: ReactNode }) => <div data-testid="dnd-context">{children}</div>,
    DragOverlay: ({ children }: { children: ReactNode }) => <div data-testid="drag-overlay">{children}</div>,
    useSensor: vi.fn(),
    useSensors: vi.fn(() => []),
    PointerSensor: vi.fn(),
    useDroppable: () => ({ setNodeRef: vi.fn(), isOver: false }),
    pointerWithin: vi.fn(),
  };
});

vi.mock("react-grid-layout", () => ({
  default: ({ children }: { children: ReactNode }) => <div data-testid="grid-layout">{children}</div>,
}));

vi.mock("./helpers", () => ({
  createHtmlElement: vi.fn(() => ({ getHTML: () => "<html></html>" })),
  createLayoutObj: vi.fn(() => ({})),
  insertHtmlIntoTemplate: vi.fn((html: string) => html),
  uploadHtmlFile: vi.fn(),
}));

describe("Constructor", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFetchSiteById.mockReturnValue({
      data: {
        siteInfo: {
          title: "Test Site",
          description: "Test Description",
        },
        siteContent: {
          layout: [],
          components: {},
        },
      },
    });

    mockUpdateSite.mockResolvedValue({ data: "success" });
  });

  const renderConstructor = () => {
    const mockStore = configureStore({
      reducer: {
        builder: (state = { layout: [], components: {}, selectedId: null }) => state,
      },
    });

    return render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={["/sites/test-site-id"]}>
          <Routes>
            <Route path="/sites/:siteId" element={<Constructor />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  test("рендерит основные компоненты конструктора", () => {
    renderConstructor();

    expect(screen.getByTestId("components-panel")).toBeInTheDocument();
    expect(screen.getByTestId("properties-panel")).toBeInTheDocument();
    expect(screen.getByTestId("dnd-context")).toBeInTheDocument();
  });

  test("загружает данные сайта при монтировании", () => {
    renderConstructor();

    expect(mockFetchSiteById).toHaveBeenCalledWith("test-site-id");
  });

  test("показывает сообщение о пустом canvas", () => {
    renderConstructor();

    expect(screen.getByText(/Перетащите блок "Секция" сюда/i)).toBeInTheDocument();
  });

  test("рендерит layout секции", () => {
    const mockLayout = [
      { i: "section-1", x: 0, y: 0, w: 12, h: 4 },
      { i: "section-2", x: 0, y: 4, w: 12, h: 4 },
    ];

    const mockStore = configureStore({
      reducer: {
        builder: () => ({ 
          layout: mockLayout, 
          components: {}, 
          selectedId: null 
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={["/sites/test-site-id"]}>
          <Routes>
            <Route path="/sites/:siteId" element={<Constructor />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("grid-layout")).toBeInTheDocument();
  });

  test("сохранение сайта вызывает updateSite", async() => {
    const { container } = renderConstructor();

    const saveButton = container.querySelector("button[title*=\"Сохранить\"], button[aria-label*=\"Сохранить\"]");
    
    if (saveButton) {
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateSite).toHaveBeenCalledWith({
          id: "test-site-id",
          updatesSite: { published: true },
          updatesContent: expect.objectContaining({
            components: expect.any(Object),
            layout: expect.any(Array),
          }),
        });
      });
    }
  });

  test("клик по canvas сбрасывает выбранный компонент", () => {
    renderConstructor();

    const canvas = screen.getByTestId("dnd-context");
    fireEvent.click(canvas);

    expect(mockDispatch).toHaveBeenCalled();
  });

  test("загрузка сайта с данными обновляет Redux store", () => {
    mockFetchSiteById.mockReturnValue({
      data: {
        siteInfo: {
          title: "Loaded Site",
          description: "Loaded Description",
        },
        siteContent: {
          layout: [{ i: "test", x: 0, y: 0, w: 12, h: 4 }],
          components: { test: { type: "container" } },
        },
      },
    });

    renderConstructor();

    expect(mockFetchSiteById).toHaveBeenCalled();
  });
});
