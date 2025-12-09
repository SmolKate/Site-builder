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
    {
      type: "number",
      label: "Внешний отступ (px)",
      key: "margin",
      target: "style",
      defaultValue: 0,
    },
  ],
  specific: {
    container: [
      {
        type: "select",
        label: "Тип макета",
        key: "variant",
        target: "variant",
        options: [
          { value: "default", label: "Стек (Flex)" },
          { value: "two-columns", label: "Сетка (2 колонки)" },
          { value: "three-columns", label: "Сетка (3 колонки)" },
        ],
      },
      
      { 
        type: "select", 
        label: "По горизонтали (X)", 
        key: "align_x", 
        target: "style", 
        options: [
          {value: "start", label: "Слева"}, 
          {value: "center", label: "По центру"}, 
          {value: "end", label: "Справа"},
          {value: "stretch", label: "Растянуть"} 
        ] 
      },

      { 
        type: "select", 
        label: "По вертикали (Y)", 
        key: "align_y", 
        target: "style", 
        options: [
          {value: "start", label: "Сверху"}, 
          {value: "center", label: "По центру"},
          {value: "end", label: "Снизу"},
          {value: "space-between", label: "Распределить"}, 
        ] 
      }
    ],
    page: [
      { 
        type: "select", 
        label: "Сайдбар", 
        key: "hasSidebar", 
        target: "props",
        options: [{value: "1", label: "Показать"}, {value: "0", label: "Скрыть"}]
      },
      { type: "text", label: "Ширина сайдбара (px/%)", key: "sidebarWidth", target: "style" },
      {
        type: "select",
        label: "Макет центра",
        key: "variant",
        target: "variant",
        options: [
          { value: "default", label: "1 колонка" },
          { value: "two-columns", label: "2 колонки" },
          { value: "three-columns", label: "3 колонки" },
        ]
      },
      { type: "color", label: "Фон Header", key: "headerBg", target: "style" },
      { type: "color", label: "Фон Footer", key: "footerBg", target: "style" },
      { type: "color", label: "Фон Sidebar", key: "sidebarBg", target: "style" },
    ],
    image: [
      { type: "text", label: "URL изображения", key: "src", target: "props" },
      { type: "text", label: "Alt текст", key: "alt", target: "props" },
    ],
    heading: [
      {
        type: "select",
        label: "Уровень",
        key: "level",
        target: "props",
        options: [
          { value: "1", label: "H1" },
          { value: "2", label: "H2" },
          { value: "3", label: "H3" },
        ],
        defaultValue: "2",
      },
      { type: "color", label: "Цвет", key: "color", target: "style" },
      {
        type: "select",
        label: "Выравнивание",
        key: "textAlign",
        target: "style",
        options: [
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
          { value: "right", label: "Right" },
        ],
      },
    ],
    button: [
      { type: "text", label: "Текст", key: "text", target: "props" },
      { type: "color", label: "Цвет текста", key: "color", target: "style" },
    ],
    
    text: [
      { type: "color", label: "Цвет текста", key: "color", target: "style" },
      { 
        type: "select", 
        label: "Выравнивание", 
        key: "textAlign", 
        target: "style",
        options: [
          { value: "left", label: "Слева" },
          { value: "center", label: "По центру" },
          { value: "right", label: "Справа" },
          { value: "justify", label: "По ширине" },
        ]
      }
    ],

    video: [
      { type: "text", label: "Ссылка YouTube", key: "src", target: "props" },
      { type: "number", label: "Ширина", key: "width", target: "style" },
      { type: "number", label: "Высота", key: "height", target: "style" },
    ],
    divider: [
      { 
        type: "number", 
        label: "Ширина (X)", 
        key: "width", 
        target: "style" 
      },
      { 
        type: "number", 
        label: "Высота/Толщина (Y)", 
        key: "height", 
        target: "style"
      }
    ],
    quote: [
      { type: "text", label: "Текст цитаты", key: "text", target: "props" },
      { type: "text", label: "Автор", key: "author", target: "props" },
      { type: "color", label: "Цвет текста", key: "color", target: "style" },
    ],
    list: [{ type: "color", label: "Цвет текста", key: "color", target: "style" }],
    input: [
      { type: "text", label: "Placeholder", key: "placeholder", target: "props" },
      { type: "color", label: "Цвет границы", key: "borderColor", target: "style" },
    ],
    link: [
      { type: "text", label: "Текст ссылки", key: "text", target: "props" },
      { type: "text", label: "Адрес (href)", key: "href", target: "props" },
      { type: "color", label: "Цвет", key: "color", target: "style" },
      {
        type: "select",
        label: "Подчеркивание",
        key: "textDecoration",
        target: "style",
        options: [
          { value: "none", label: "Нет" },
          { value: "underline", label: "Да" },
        ],
      },
    ],
  },
};