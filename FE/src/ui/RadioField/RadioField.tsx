import type { ChangeEvent, FC } from "react";
import "./styles.scss";

interface IOption {
  name: string;
  value: string;
}

interface IRadioFieldProps {
  options: IOption[];
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const RadioField: FC<IRadioFieldProps> = (props) => {
  const { options, name, value, onChange } = props;

  return (
    <>
      {options.map((option) => (
        <div key={option.name + "-" + option.value}>
          <input
            className="ui-radio"
            type="radio"
            id={option.name + "-" + option.value}
            name={name}
            checked={option.value === value}
            value={option.value}
            onChange={onChange}
          />
          <label
            className="ui-radio-label"
            htmlFor={option.name + "-" + option.value}
          >
            {option.name}
          </label>
        </div>
      ))}
    </>
  );
};

export default RadioField;
