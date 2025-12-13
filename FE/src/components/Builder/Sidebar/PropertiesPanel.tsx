import { useAppSelector, useAppDispatch } from "@/store";
import { updateComponent } from "@/store/builder/builderSlice";
import { getAllComponents, selectSelectedComponent, selectSelectedId } from "@/store/builder";
import { type SectionVariant, type IBlock } from "@/store/builder/types";
import {
  PROPERTIES_CONFIG,
  type FieldTarget,
  type PropertyField,
} from "@/config/builder/propertiesConfig";
import { PropertyFieldComponent } from "../Properties/PropertyFields";
import "./PropertiesPanel.scss";

const toCssValue = (val: string) => {
  if (val === "start") return "flex-start";
  if (val === "end") return "flex-end";
  return val;
};

const fromCssValue = (val: unknown) => {
  const str = String(val);
  if (str === "flex-start") return "start";
  if (str === "flex-end") return "end";
  return str;
};

const getBlockLabel = (block: IBlock): string => {
  const typeMap: Record<string, string> = {
    container: "Контейнер",
    text: "Текст",
    heading: "Заголовок",
    button: "Кнопка",
    image: "Изображение",
    video: "Видео",
    divider: "Разделитель",
    quote: "Цитата",
    list: "Список",
    input: "Поле ввода",
    link: "Ссылка",
    page: "Страница"
  };

  const typeName = typeMap[block.type] || block.type;
  
  let contentPreview = "";
  if (block.props.text) contentPreview = String(block.props.text);
  else if (block.props.headerText) contentPreview = String(block.props.headerText);
  else if (block.content) {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = block.content;
    contentPreview = tmp.textContent || tmp.innerText || "";
  }

  if (contentPreview.length > 20) {
    contentPreview = contentPreview.substring(0, 20) + "...";
  }

  return contentPreview ? `${typeName}: ${contentPreview}` : `${typeName} (${block.id.slice(0, 4)})`;
};

type StyleChanges = Record<string, string | number | undefined>;

export const PropertiesPanel = () => {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector(selectSelectedId);
  const block: IBlock | null | undefined = useAppSelector(selectSelectedComponent);
  const allComponents = useAppSelector(getAllComponents);

  if (!selectedId || !block) return null;

  const isGrid = block.style.display === "grid" || 
                 block.variant === "two-columns" || 
                 block.variant === "three-columns";

  const getVirtualValue = (field: PropertyField) => {
    if (field.key !== "align_x" && field.key !== "align_y") {
      if (field.target === "style") return block.style[field.key];
      if (field.target === "props") return block.props[field.key];
      if (field.target === "variant") return block.variant;
      return "";
    }

    const s = block.style;
    if (field.key === "align_x") { 
      return fromCssValue(isGrid ? (s.justifyItems || "start") : (s.alignItems || "start"));
    }
    if (field.key === "align_y") { 
      return fromCssValue(isGrid ? (s.alignItems || "start") : (s.justifyContent || "start"));
    }
  };

  const handleFieldChange = (key: string, value: string, target: FieldTarget) => {
    let componentChanges: {
      style?: StyleChanges;
      props?: Record<string, unknown>;
      variant?: SectionVariant;
    } = {};

    if (target === "variant") {
      const isNewGrid = value === "two-columns" || value === "three-columns";
      
      const variantStyles: StyleChanges = isNewGrid
        ? {
          display: "grid",
          gridTemplateColumns: value === "two-columns" ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
          gap: "15px",
          width: "100%",
          flexDirection: undefined,
          justifyContent: undefined,
          alignItems: "start",
          justifyItems: "start",
        }
        : {
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
          gridTemplateColumns: undefined,
          justifyItems: undefined,
          alignItems: "stretch",
          justifyContent: "flex-start",
        };

      componentChanges = { 
        variant: value as SectionVariant, 
        style: { ...block.style, ...variantStyles } 
      };
    } 
    else if (key === "align_x" || key === "align_y") {
      const cssValue = toCssValue(value);
      const newStyle: StyleChanges = { ...block.style };

      if (key === "align_x") {
        if (isGrid) newStyle.justifyItems = cssValue;
        else newStyle.alignItems = cssValue;
      } 
      else if (key === "align_y") {
        if (isGrid) newStyle.alignItems = cssValue; 
        else newStyle.justifyContent = cssValue; 
      }

      componentChanges = { style: newStyle };
    } 
    else {
      if (target === "style") {
        componentChanges = { style: { ...block.style, [key]: value } };
      } else if (target === "props") {
        componentChanges = { props: { ...block.props, [key]: value } };
      }
    }

    dispatch(updateComponent({ 
      id: selectedId, 
      changes: componentChanges as unknown as Partial<IBlock>,
    }));
  };

  const commonFields = PROPERTIES_CONFIG.common;
  const specificFields = PROPERTIES_CONFIG.specific[block.type] || [];

  const allFields = [...commonFields, ...specificFields].filter((field) => {
    if (block.type === "divider") return true;
    const isOnGrid = block.parentId === null;
    const resizableProps = ["width", "height", "minHeight"];
    if (isOnGrid && field.target === "style" && resizableProps.includes(field.key)) {
      return false;
    }

    if (block.type === "button") {
      const actionType = block.props.actionType;
      if (actionType === "none") {
        if (field.key === "actionValue" || field.key === "openInNewTab") return false;
      }
      if ((actionType === "anchor" || actionType === "email") && field.key === "openInNewTab") {
        return false;
      }
    }

    return true;
  }).map(field => {
    if (block.type === "button" && field.key === "actionValue") {
      const actionType = block.props.actionType;

      if (actionType === "anchor") {
        const options = Object.values(allComponents)
          .filter(c => c.id !== block.id)
          .map(c => ({
            value: c.id,
            label: getBlockLabel(c)
          }));

        options.unshift({ value: "top", label: "▲ Наверх страницы" });

        return {
          ...field,
          type: "select" as const, 
          label: "Выберите блок для скролла",
          options: options
        };
      } else if (actionType === "email") {
        return { ...field, label: "Email адрес" };
      } else if (actionType === "link") {
        return { ...field, label: "URL ссылки (https://...)" };
      }
    }
    return field;
  });

  return (
    <div className="properties-panel">
      {allFields.map((field) => (
        <div className="panel-group" key={`${field.target}-${field.key}`}>
          <label>{field.label}</label>
          <PropertyFieldComponent
            field={field}
            value={getVirtualValue(field)}
            onChange={handleFieldChange}
          />
        </div>
      ))}

      {allFields.length === 0 && (
        <div className="properties-panel__empty">Нет доступных настроек</div>
      )}
    </div>
  );
};
