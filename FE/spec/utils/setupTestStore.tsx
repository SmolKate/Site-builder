import { configureStore } from "@reduxjs/toolkit";
import { rootReducer, RootState } from "../../src/store";
import { sitesMiddleware } from "../../src/store/sites";

export const setupTestStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    devTools: true,
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat([
      sitesMiddleware
    ]),
    preloadedState,
  });
};
