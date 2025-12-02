import { type BlockType } from "@/store/builder/types";

export type FieldType = "color" | "number" | "text" | "select";
export type FieldTarget = "style" | "props" | "variant";

export interface PropertyField {
  type: FieldType;
  label: string;
  key: string;
  target: FieldTarget;
  options?: Array<{ value: string; label: string }>;
  defaultValue?: string | number;
}

export interface BlockPropertiesConfig {
  common: PropertyField[];
  specific: Record<BlockType, PropertyField[]>;
}

export const PROPERTIES_CONFIG: BlockPropertiesConfig = {
  common: [
    {
      type: "color",
      label: "Фон",
      key: "backgroundColor",
      target: "style",
      defaultValue: "#ffffff",
    },
    {
      type: "number",
      label: "Внутренний отступ (px)",
      key: "padding",
      target: "style",
      defaultValue: 20,
    },
    {
      type: "number",
      label: "Скругление углов (px)",
      key: "borderRadius",
      target: "style",
      defaultValue: 0,
    },
  ],
  specific: {
    container: [
      {
        type: "select",
        label: "Макет",
        key: "variant",
        target: "variant",
        options: [
          { value: "default", label: "Вертикальный стек" },
          { value: "two-columns", label: "2 колонки" },
          { value: "three-columns", label: "3 колонки" },
        ],
      },
    ],
    image: [
      {
        type: "text",
        label: "URL изображения",
        key: "src",
        target: "props",
        defaultValue: "https://via.placeholder.com/400x250",
      },
      {
        type: "text",
        label: "Альтернативный текст",
        key: "alt",
        target: "props",
        defaultValue: "Новое изображение",
      },
    ],
    heading: [
      {
        type: "select",
        label: "Уровень заголовка",
        key: "level",
        target: "props",
        options: [
          { value: "1", label: "H1 - Главный заголовок" },
          { value: "2", label: "H2 - Заголовок секции" },
          { value: "3", label: "H3 - Подзаголовок" },
          { value: "4", label: "H4 - Малый заголовок" },
          { value: "5", label: "H5 - Очень малый заголовок" },
          { value: "6", label: "H6 - Лейбл" },
        ],
        defaultValue: "2",
      },
      {
        type: "color",
        label: "Цвет текста",
        key: "color",
        target: "style",
        defaultValue: "#000000",
      },
      {
        type: "select",
        label: "Выравнивание",
        key: "textAlign",
        target: "style",
        options: [
          { value: "left", label: "Слева" },
          { value: "center", label: "По центру" },
          { value: "right", label: "Справа" },
        ],
        defaultValue: "left",
      },
    ],
    button: [
      {
        type: "text",
        label: "Текст кнопки",
        key: "text",
        target: "props",
        defaultValue: "Кнопка",
      },
      {
        type: "color",
        label: "Цвет текста",
        key: "color",
        target: "style",
        defaultValue: "#000000",
      },
    ],
    text: [],
  },
};
