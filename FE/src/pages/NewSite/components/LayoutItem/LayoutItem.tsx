import { Cross2Icon } from "@radix-ui/react-icons";
import { type Layout } from "react-grid-layout";
import { Tag, type ILayoutConfigItem } from "../../types";
import "./styles.scss";

interface ILayoutItemProps {
  item: Layout;
  layout: Layout[];
  layoutConfig: ILayoutConfigItem[];
  setLayout: (layout: Layout[]) => void;
  setLayoutConfig: (layoutConfig: ILayoutConfigItem[]) => void;
}

const LayoutItem = (props: ILayoutItemProps) => {
  const { layout, layoutConfig, setLayout, setLayoutConfig, item } = props;
  const blockConfig = layoutConfig.find((style) => style.i === item.i);
  const {
    tag: Component = Tag.DIV,
    name,
    ...restHtmlAttr
  } = blockConfig?.htmlAttr || {};
  const removeBlock = () => {
    setLayout(layout.filter((block) => block.i !== item.i));
    setLayoutConfig(layoutConfig.filter((block) => block.i !== item.i));
  };

  return (
    <Component
      className="layout-item"
      style={{...blockConfig?.style }}
      {...restHtmlAttr}
    >
      {name}
      <div className="layout-item__remove-btn" onClick={removeBlock}>
        <Cross2Icon />
      </div>
    </Component>
  );
};

export default LayoutItem;