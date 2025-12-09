import { useAppSelector, useAppDispatch } from "@/store";
import { updateComponent } from "@/store/builder/builderSlice";
import { selectSelectedComponent, selectSelectedId } from "@/store/builder";
import { PROPERTIES_CONFIG, type FieldTarget, type PropertyField } from "@/config/builder/propertiesConfig";
import { type SectionVariant, type IBlock } from "@/store/builder/types";
import { PropertyFieldComponent } from "../Properties/PropertyFields";
import "./PropertiesPanel.scss";

const getPropertyValue = (block: IBlock, field: PropertyField) => {
  if (field.target === "style") {
    return block.style[field.key];
  } else if (field.target === "props") {
    return block.props[field.key];
  } else if (field.target === "variant") {
    return block.variant;
  }
  return "";
};

export const PropertiesPanel = () => {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector(selectSelectedId);
  const block = useAppSelector(selectSelectedComponent);

  if (!selectedId || !block) {
    return null;
  }

  const handleFieldChange = (key: string, value: string, target: FieldTarget) => {
    let changes = {};

    if (target === "style") {
      changes = { style: { ...block.style, [key]: value } };
    } else if (target === "props") {
      changes = { props: { ...block.props, [key]: value } };
    } else if (target === "variant") {
      let columnStyles = {};

      if (value === "two-columns") {
        columnStyles = {
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "15px",
          alignItems: "center",
          width: "100%"
        };
      } else if (value === "three-columns") {
        columnStyles = {
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "15px",
          alignItems: "center",
          width: "100%"
        };
      } else {
        columnStyles = {
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%"
        };
      }

      changes = {
        variant: value as SectionVariant,
        style: {
          ...block.style,
          ...columnStyles
        }
      };
    }

    dispatch(updateComponent({
      id: selectedId,
      changes
    }));
  };

  const commonFields = PROPERTIES_CONFIG.common;
  const specificFields = PROPERTIES_CONFIG.specific[block.type] || [];

  const allFields = [...commonFields, ...specificFields].filter((field) => {
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
            value={getPropertyValue(block, field)}
            onChange={handleFieldChange}
          />
        </div>
      ))}

      {allFields.length === 0 && (
        <div className="properties-panel__empty">
          Нет доступных настроек для этого компонента
        </div>
      )}
    </div>
  );
};