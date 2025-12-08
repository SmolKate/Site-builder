import type { ChangeEvent, FC } from "react";
import "../inputStyles.scss";

interface ISearchInputFieldProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SearchInputField: FC<ISearchInputFieldProps> = ({ value, onChange }) => {
  return (
    <input
      className="field__input-search"
      type="text"
      id="input-search"
      name="input-search"
      placeholder="Поиск по названию..."
      value={value}
      onChange={onChange}
    />
  );
};

export default SearchInputField;
