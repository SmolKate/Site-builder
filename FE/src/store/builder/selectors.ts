import { createSelector } from "@reduxjs/toolkit";
import { type RootState } from "../index";

const selectComponents = (state: RootState) => state.builder.components;

export const selectComponentById = (state: RootState, id: string) =>
  state.builder.components[id];

export const selectLayout = (state: RootState) => state.builder.layout;

export const selectSelectedId = (state: RootState) => state.builder.selectedId;

export const selectSelectedComponent = createSelector(
  [selectComponents, selectSelectedId],
  (components, selectedId) => {
    if (!selectedId) return null;
    return components[selectedId];
  },
);
