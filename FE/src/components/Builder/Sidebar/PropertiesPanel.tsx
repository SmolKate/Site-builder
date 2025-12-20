import { useAppSelector, useAppDispatch } from "@/store";
import { updateComponent } from "@/store/builder/builderSlice";
import { selectSelectedComponent, selectSelectedId } from "../../../store/builder";
import { PROPERTIES_CONFIG, type FieldTarget, type PropertyField } from "@/config/builder/propertiesConfig";
import { PropertyFieldComponent } from "../Properties/PropertyFields";
import { type SectionVariant } from "@/store/builder/types";
import "./PropertiesPanel.scss";

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
      changes = { variant: value as SectionVariant };
    }

    dispatch(updateComponent({
      id: selectedId,
      changes
    }));
  };

  const commonFields = PROPERTIES_CONFIG.common;
  const specificFields = PROPERTIES_CONFIG.specific[block.type] || [];
  const allFields = [...commonFields, ...specificFields];

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
        const value = getFieldValue(field);

        return (
          <div className="panel-group" key={`${field.target}-${field.key}`}>
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