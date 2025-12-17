export type BlockType =
  | "text"
  | "button"
  | "container"
  | "heading"
  | "image"
  | "video"
  | "divider"
  | "quote"
  | "list"
  | "numList"
  | "input"
  | "link"
  | "page";

export const BLOCK_TYPES = {
  TEXT: "text",
  BUTTON: "button",
  CONTAINER: "container",
  HEADING: "heading",
  IMAGE: "image",
  VIDEO: "video",
  DIVIDER: "divider",
  QUOTE: "quote",
  LIST: "list",
  NUM_LIST: "numList",
  INPUT: "input",
  LINK: "link",
  PAGE: "page",
} as const;

export const COMMON_ACCEPT_DATA: BlockType[] = [
  BLOCK_TYPES.BUTTON,
  BLOCK_TYPES.TEXT,
  BLOCK_TYPES.HEADING,
  BLOCK_TYPES.IMAGE,
  BLOCK_TYPES.VIDEO,
  BLOCK_TYPES.DIVIDER,
  BLOCK_TYPES.QUOTE,
  BLOCK_TYPES.LIST,
  BLOCK_TYPES.NUM_LIST,
  BLOCK_TYPES.INPUT,
  BLOCK_TYPES.LINK,
  BLOCK_TYPES.CONTAINER,
];
export type SectionVariant = "default" | "two-columns" | "three-columns";

export interface IBlockStyles {
  [key: string]: string;
}

export interface IBlock {
  id: string;
  type: BlockType;
  variant?: SectionVariant;
  parentId: string | null;
  childrenIds: string[];
  content?: string;
  props: {
    text?: string;
    [key: string]: unknown;
  };
  style: IBlockStyles;
}
export interface ILayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}
export interface BuilderState {
  components: Record<string, IBlock>;
  layout: ILayoutItem[];
  selectedId: string | null;
  siteTitle: string;
  siteDescription: string;
  siteBackgroundColor: string;
}
