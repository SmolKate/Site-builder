import { type BlockType } from "@/store/builder/types";

interface BlockConfig {
  content?: string;
  props?: Record<string, unknown>;
  style?: Record<string, unknown>;
}

export const BLOCK_DEFAULTS: Record<BlockType, BlockConfig> = {
  text: {
    content: "Начните вводить текст...",
    style: {},
    props: {},
  },
  heading: {
    content: "Новый заголовок",
    props: { level: 2 },
    style: { fontWeight: "bold" },
  },
  image: {
    props: {
      src: "https://via.placeholder.com/400x250",
      alt: "Новое изображение",
    },
    style: {},
  },
  button: {
    props: { text: "Кнопка" },
    style: {
      backgroundColor: "#007bff",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "4px",
    },
  },
  container: {
    style: {
      backgroundColor: "#5aa7c6ff",
      padding: "0",
      display: "grid", 
      gap: "15px",
      alignItems: "center",
      justifyItems: "center",
      height: "100%",
      width: "100%",
      minHeight: "fit-content",
    },
    props: {},
  },
};

export const DEFAULT_SECTION_LAYOUT = {
  w: 12,
  h: 10,
  x: 0,
  y: Infinity,
};
