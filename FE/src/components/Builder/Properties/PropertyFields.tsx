import { type PropertyField, type FieldTarget } from "@/config/builder/propertiesConfig";
import { type SectionVariant } from "@/store/builder/types";

type StyleValue = string | number | undefined;
type PropValue = unknown;
type VariantValue = SectionVariant | undefined;

interface FieldProps {
  field: PropertyField;
  value: StyleValue | PropValue | VariantValue;
  onChange: (key: string, value: string, target: FieldTarget) => void;
}

export const ColorField = ({ field, value, onChange }: FieldProps) => {
  const stringValue = typeof value === "string" ? value : String(value || field.defaultValue || "#ffffff");
  
  return (
    <div className="color-input-wrapper">
      <input 
        type="color" 
        value={stringValue}
        onChange={(e) => onChange(field.key, e.target.value, field.target)}
      />
      <span>{stringValue}</span>
    </div>
  );
};

export const NumberField = ({ field, value, onChange }: FieldProps) => {
  const numericValue = typeof value === "number" 
    ? value 
    : parseInt(String(value)) || 0; 
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    const cleanNumber = rawValue === "" ? 0 : Number(rawValue);

    onChange(field.key, `${cleanNumber}px`, field.target);
  };

  return (
    <input 
      type="number" 
      min={0}
      value={numericValue}
      onChange={handleInputChange} 
    />
  );
};

export const TextField = ({ field, value, onChange }: FieldProps) => {
  const stringValue = typeof value === "string" ? value : String(value || field.defaultValue || "");
  
  return (
    <input 
      type="text" 
      value={stringValue}
      onChange={(e) => onChange(field.key, e.target.value, field.target)}
    />
  );
};

export const SelectField = ({ field, value, onChange }: FieldProps) => {
  const stringValue = typeof value === "string" ? value : String(value || field.defaultValue || "");
  
  return (
    <select 
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

// Главный компонент поля
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