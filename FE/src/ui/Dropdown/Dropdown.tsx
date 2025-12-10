import { type ChangeEvent, type FC } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { dropdownMessages } from "@/locales";
import { RadioField } from "../RadioField";
import "./styles.scss";

interface IDropdownProps {
  sortAlg: string;
  onSortSites: (alg: string) => void;
}

const Dropdown: FC<IDropdownProps> = ({ sortAlg, onSortSites }) => {
  const options = [
    { name: dropdownMessages.options.alphabetAsc, value: "alphabet-asc" },
    { name: dropdownMessages.options.alphabetDesc, value: "alphabet-desc" },
    { name: dropdownMessages.options.newest, value: "date-desc" },
    { name: dropdownMessages.options.oldest, value: "date-asc" },
  ];

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSortSites(event.target.value);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="dropdown-button">
        {dropdownMessages.trigger}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="dropdown-content" sideOffset={5}>
          <RadioField
            options={options}
            name="sort"
            value={sortAlg}
            onChange={handleChange}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default Dropdown;
