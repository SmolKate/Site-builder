import { useAppSelector, useAppDispatch } from "@/store";
import { updateComponent } from "@/store/builder/builderSlice";
import { selectSelectedComponent, selectSelectedId } from "@/store/builder";
import { PROPERTIES_CONFIG, type FieldTarget, type PropertyField } from "@/config/builder/propertiesConfig";

import { type SectionVariant } from "@/store/builder/types";
import "./PropertiesPanel.scss";
import { PropertyFieldComponent } from "../Properties/PropertyFields";

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
          alignItems: "start",
          width: "100%"
        };
      } else if (value === "three-columns") {
        columnStyles = {
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "15px",
          alignItems: "start",
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

  const fieldsMap = new Map<string, PropertyField>();

  [...commonFields, ...specificFields].forEach((field) => {
    const uniqueKey = `${field.target}-${field.key}`;
    fieldsMap.set(uniqueKey, field);
  });
  const isOnGrid = block.parentId === null;

  const allFields = Array.from(fieldsMap.values()).filter((field) => {
    const resizableProps = ["width", "height", "minHeight"];

    if (isOnGrid && field.target === "style" && resizableProps.includes(field.key)) {
      return false;
    }

    return true; 
  });

  const getFieldValue = (field: PropertyField) => {
    if (field.target === "style") {
      return block.style[field.key];
    } else if (field.target === "props") {
      return block.props[field.key];
    } else if (field.target === "variant") {
      return block.variant;
    }
    return undefined;
  };

  return (
    <div className="properties-panel">
      {allFields.map((field) => {
        const uniqueKey = `${field.target}-${field.key}`;
        const value = getFieldValue(field);

        return (
          <div className="panel-group" key={uniqueKey}>
            <label>{field.label}</label>
            <PropertyFieldComponent
              field={field}
              value={value}
              onChange={handleFieldChange}
            />
          </div>
        );
      })}

      {allFields.length === 0 && (
        <div className="properties-panel__empty">
          Нет доступных настроек для этого компонента
        </div>
      )}
    </div>
  );
};