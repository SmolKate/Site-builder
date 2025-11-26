const Tag = {
  BUTTON: "button",
  DIV: "div",
  H1: "h1",
  H2: "h2",
  H3: "h3",
  H4: "h4",
  H5: "h5",
  H6: "h6",
  P: "p",
  SPAN: "span",
} as const;

type TTag = (typeof Tag)[keyof typeof Tag];

interface IBlock {
  id: number;
  name: string;
  tag: TTag;
  link?: string;
}

interface ILayoutConfigItem {
  i: string;
  style: {
    [key: string]: string;
  };
  htmlAttr: Omit<IBlock, "id">;
}

export { Tag, type TTag, type IBlock, type ILayoutConfigItem };
