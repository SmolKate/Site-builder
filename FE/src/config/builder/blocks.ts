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
    style: { fontWeight: "bold", color: "#04031c" },
  },
  image: {
    props: {
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE3CETL_OertJKScoHfblxs6CBrKGVCmVESw&s",
      alt: "Новое изображение",
    },
    style: {},
  },
  button: {
    props: { 
      text: "Кнопка",
      actionType: "none",
      actionValue: "",
      openInNewTab: "0"
    },
    style: {
      backgroundColor: "#007bff",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "4px",
      display: "inline-block", 
      textAlign: "center",
      border: "none",
      textDecoration: "none" 
    },
  },
  container: {
    style: {
      backgroundColor: "#5aa7c6",
      padding: "0",
      display: "grid",
      alignItems: "center",
      justifyItems: "center",
      height: "100%",
      width: "100%",
      minHeight: "fit-content",
    },
    props: {},
  },
  page: {
    props: {
      hasSidebar: "1",
      headerText: "Header Section",
      footerText: "Footer Section",
    },
    style: {
      backgroundColor: "#ffffff",
      sidebarWidth: "250px",
      sidebarBg: "#f0f0f0",
      headerBg: "#333333",
      headerColor: "#ffffff",
      footerBg: "#333333",
      footerColor: "#ffffff",
      padding: "0",
      gap: undefined,
      gridTemplateColumns: undefined,
    },
  },

  video: {
    props: {
      src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    style: {
      width: "100%",
      height: "315px",
      borderRadius: "8px",
    },
  },
  divider: {
    props: {},
    style: {
      width: "50px",  
      height: "2px", 
      backgroundColor: "#e0e0e0",
      padding: "0"
    },
  },
  quote: {
    props: {
      text: "Великие дела нужно совершать, а не обдумывать бесконечно.",
      author: "Юлий Цезарь",
    },
    style: {
      borderLeft: "4px solid #007bff",
      padding: "10px 20px",
      backgroundColor: "#f9f9f9",
      fontStyle: "italic",
      color: "#555",
    },
  },
  list: {
    content: `
      <ul>
        <li>Первый пункт списка</li>
        <li>Второй пункт списка</li>
        <li>Третий пункт списка</li>
      </ul>
    `,
    props: {},
    style: {
      color: "#333",
      lineHeight: "1.5",
    },
  },
  input: {
    props: {
      placeholder: "Введите ваш email...",
      type: "text",
    },
    style: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "14px",
    },
  },
  link: {
    props: {
      text: "Подробнее...",
      href: "#",
    },
    style: {
      color: "#007bff",
      textDecoration: "underline",
      cursor: "pointer",
    },
  },
};

export const DEFAULT_SECTION_LAYOUT = {
  w: 12,
  h: 10,
  x: 0,
  y: Infinity,
};

export const DEFAULT_PAGE_LAYOUT = {
  w: 12,
  h: 15, 
  x: 0,
  y: Infinity,
};