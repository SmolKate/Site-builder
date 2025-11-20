import { FC, ReactNode } from "react";
import { Provider } from "react-redux";
import { render, RenderOptions } from "@testing-library/react";
import { setupTestStore } from "./setupTestStore";
import type { RootState, AppStore } from "../../src/store";

interface IRenderWithProvidersOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

interface IWrapperProps {
  children: ReactNode;
}

export const renderWithProviders = (
  ui: ReactNode,
  {
    preloadedState,
    store = setupTestStore(preloadedState),
    ...renderOptions
  }: IRenderWithProvidersOptions = {}
) => {
  const Wrapper: FC<IWrapperProps> = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};
