import { type BlockType } from "@/store/builder/types";

interface BlockConfig {
  content?: string;
  props?: Record<string, unknown>;
  style?: Record<string, unknown>;
}

export const BLOCK_DEFAULTS: Record<BlockType, BlockConfig> = {
  text: {
    content: "<p>Начните вводить текст...</p>",
    style: {},
    props: {},
  },
  heading: {
    content: "<h2>Новый заголовок</h2>",
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
    style: { backgroundColor: "#ffffff", padding: "0" },
    props: {},
  },
};

export const DEFAULT_SECTION_LAYOUT = {
  w: 12,
  h: 1,
  x: 0,
  y: Infinity,
};
