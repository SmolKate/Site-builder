export type BlockType = "text" | "button" | "container" | "heading" | "image";
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
  siteTitle: string
  siteDescription: string
}
