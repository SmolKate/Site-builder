import React, { useState, useEffect } from "react";
import { type PropertyField, type FieldTarget } from "@/config/builder/propertiesConfig";
import { type SectionVariant } from "@/store/builder/types";
import "./PropertyFields.scss";

type StyleValue = string | number | undefined;
type PropValue = unknown;
type VariantValue = SectionVariant | undefined;

interface FieldProps {
  field: PropertyField;
  value: StyleValue | PropValue | VariantValue;
  onChange: (key: string, value: string, target: FieldTarget) => void;
}

export const ColorField = ({ field, value, onChange }: FieldProps) => {
  const isTransparent = !value || value === "transparent" || value === "rgba(0, 0, 0, 0)";
  const inputValue = isTransparent || typeof value !== "string" ? "#ffffff" : value;
  
  return (
    <div className="color-field">
      <input 
        type="color" 
        className="color-field__input"
        value={inputValue}
        onChange={(e) => onChange(field.key, e.target.value, field.target)}
      />

      <span className="color-field__value">
        {isTransparent ? "Прозрачный" : inputValue}
      </span>

      {!isTransparent && (
        <button 
          className="color-field__reset-btn"
          onClick={() => onChange(field.key, "transparent", field.target)}
          title="Сделать прозрачным"
          aria-label="Сбросить цвет"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export const NumberField = ({ field, value, onChange }: FieldProps) => {
  const [localValue, setLocalValue] = useState(() => {
    const parsed = parseFloat(String(value));
    return isNaN(parsed) ? "" : String(parsed);
  });

  useEffect(() => {
    const parsedProp = parseFloat(String(value));
    const propNum = isNaN(parsedProp) ? 0 : parsedProp;
    const localNum = localValue === "" ? 0 : parseFloat(localValue);

    if (propNum !== localNum) {
      setLocalValue(String(propNum));
    }
  }, [value, localValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setLocalValue(rawValue);
    const cleanNumber = rawValue === "" ? 0 : Number(rawValue);
    onChange(field.key, `${cleanNumber}px`, field.target);
  };

  return (
    <input 
      type="number" 
      className="property-input"
      value={localValue}
      onChange={handleInputChange} 
      placeholder="0" 
    />
  );
};

export const TextField = ({ field, value, onChange }: FieldProps) => {
  const stringValue = typeof value === "string" ? value : String(value || field.defaultValue || "");
  
  return (
    <input 
      type="text" 
      className="property-input"
      value={stringValue}
      onChange={(e) => onChange(field.key, e.target.value, field.target)}
      placeholder={String(field.defaultValue || "")}
    />
  );
};

export const SelectField = ({ field, value, onChange }: FieldProps) => {
  const stringValue = typeof value === "string" ? value : String(value || field.defaultValue || "");
  
  return (
    <select 
      className="property-input"
      value={stringValue}
      onChange={(e) => onChange(field.key, e.target.value, field.target)}
    >
      {field.options?.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

interface PropertyFieldComponentProps {
  field: PropertyField;
  value: StyleValue | PropValue | VariantValue;
  onChange: (key: string, value: string, target: FieldTarget) => void;
}

export const PropertyFieldComponent = ({ field, value, onChange }: PropertyFieldComponentProps) => {
  const fieldProps = { field, value, onChange };

  switch (field.type) {
  case "color":
    return <ColorField {...fieldProps} />;
  case "number":
    return <NumberField {...fieldProps} />;
  case "text":
    return <TextField {...fieldProps} />;
  case "select":
    return <SelectField {...fieldProps} />;
  default:
    return null;
  }
};