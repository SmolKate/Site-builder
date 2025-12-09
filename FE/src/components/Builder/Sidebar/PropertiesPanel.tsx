import { useAppSelector, useAppDispatch } from "@/store";
import { updateComponent } from "@/store/builder/builderSlice";
import { selectSelectedComponent, selectSelectedId } from "@/store/builder";
import { PROPERTIES_CONFIG, type FieldTarget, type PropertyField } from "@/config/builder/propertiesConfig";
import { type SectionVariant, type IBlock } from "@/store/builder/types";
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

type StyleChanges = Record<string, string | number | undefined>;

export const PropertiesPanel = () => {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector(selectSelectedId);
  const block: IBlock | null | undefined = useAppSelector(selectSelectedComponent);

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
          justifyItems: "start"
        }
        : {
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
          gridTemplateColumns: undefined,
          justifyItems: undefined,
          alignItems: "stretch",
          justifyContent: "flex-start"
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
      changes: componentChanges as unknown as Partial<IBlock> 
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
    return true;
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