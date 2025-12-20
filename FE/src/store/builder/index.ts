import { builderSlice } from "./builderSlice";
export * from "./selectors";
export const builderReducer = builderSlice.reducerPath;

export const {
  addSection,
  updateLayout,
  addBlockToContainer,
  selectComponent,
  updateComponent,
  deleteComponent,
  updateSectionDimensions,
} = builderSlice.actions;
export default builderSlice.reducer;
