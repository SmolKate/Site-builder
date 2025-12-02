import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  type BuilderState,
  type IBlock,
  type ILayoutItem,
  type BlockType,
} from "./types";
import {
  BLOCK_DEFAULTS,
  DEFAULT_SECTION_LAYOUT,
} from "@/config/builder/blocks";

interface ISiteConstructor {
  layout: ILayoutItem[];
  components: {[key: string]: IBlock};
  siteTitle: string;
  siteDescription: string;
}

const initialState: BuilderState = {
  components: {},
  layout: [],
  selectedId: null,
  siteTitle: "",
  siteDescription: "",
};

const getAllDescendantIds = (
  components: Record<string, IBlock>,
  parentId: string,
): string[] => {
  let ids: string[] = [];
  const parent = components[parentId];

  if (parent && parent.childrenIds) {
    parent.childrenIds.forEach((childId) => {
      ids.push(childId);
      ids = ids.concat(getAllDescendantIds(components, childId));
    });
  }
  return ids;
};

const createBlockData = (
  id: string,
  type: BlockType,
  props = {},
  style = {},
): IBlock => {
  const defaults = BLOCK_DEFAULTS[type] || {};
  return {
    id,
    type,
    parentId: null,
    childrenIds: [],
    props: { ...(defaults.props || {}), ...props },
    style: { ...(defaults.style || {}), ...style },
    content: defaults.content,
  };
};

export const builderSlice = createSlice({
  name: "builder",
  initialState,
  reducers: {
    addSection: {
      prepare: () => {
        const id = crypto.randomUUID();
        return { payload: { id } };
      },
      reducer: (state, action: PayloadAction<{ id: string }>) => {
        const { id } = action.payload;

        state.components[id] = createBlockData(id, "container");

        state.layout.push({
          i: id,
          ...DEFAULT_SECTION_LAYOUT,
        });
      },
    },
    updateLayout: (state, action: PayloadAction<ILayoutItem[]>) => {
      state.layout = action.payload;
    },

    updateSiteConstructor: (state, action: PayloadAction<ISiteConstructor>) => {
      const {layout, components, siteTitle, siteDescription} = action.payload;
      state.layout = layout;
      state.components = components;
      state.siteTitle = siteTitle;
      state.siteDescription = siteDescription;
    },

    resetSiteConstructor: (state) => {
      state.layout = [];
      state.components = {};
      state.siteTitle = "";
      state.siteDescription = "";
    },

    addBlockToContainer: {
      prepare: (containerId: string, type: BlockType) => {
        const id = crypto.randomUUID();
        return { payload: { containerId, type, id } };
      },
      reducer: (
        state,
        action: PayloadAction<{
          containerId: string;
          type: BlockType;
          id: string;
        }>,
      ) => {
        const { containerId, type, id } = action.payload;

        if (!state.components[containerId]) return;

        const newBlock = createBlockData(id, type);
        newBlock.parentId = containerId;

        state.components[id] = newBlock;
        state.components[containerId].childrenIds.push(id);
      },
    },

    selectComponent: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },

    updateComponent: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<IBlock> }>,
    ) => {
      const { id, changes } = action.payload;
      if (state.components[id]) {
        state.components[id] = { ...state.components[id], ...changes };
      }
    },

    deleteComponent: (state, action: PayloadAction<string>) => {
      const idToDelete = action.payload;
      const component = state.components[idToDelete];

      if (!component) return;

      if (component.type === "container") {
        state.layout = state.layout.filter((l) => l.i !== idToDelete);
      }

      if (component.parentId && state.components[component.parentId]) {
        const parent = state.components[component.parentId];
        parent.childrenIds = parent.childrenIds.filter(
          (id) => id !== idToDelete,
        );
      }

      const idsToDelete = [
        idToDelete,
        ...getAllDescendantIds(state.components, idToDelete),
      ];

      idsToDelete.forEach((id) => {
        delete state.components[id];
      });

      if (state.selectedId && idsToDelete.includes(state.selectedId)) {
        state.selectedId = null;
      }
    },

    updateSectionDimensions: (
      state,
      action: PayloadAction<{ i: string; w?: number; h?: number }>,
    ) => {
      const { i, w, h } = action.payload;
      const itemIndex = state.layout.findIndex((l) => l.i === i);

      if (itemIndex !== -1) {
        if (w !== undefined) state.layout[itemIndex].w = w;
        if (h !== undefined) state.layout[itemIndex].h = h;
      }
    },
  },
});

export const {
  addSection,
  updateLayout,
  updateSiteConstructor,
  addBlockToContainer,
  selectComponent,
  updateComponent,
  deleteComponent,
  updateSectionDimensions,
  resetSiteConstructor,
} = builderSlice.actions;

export default builderSlice.reducer;
