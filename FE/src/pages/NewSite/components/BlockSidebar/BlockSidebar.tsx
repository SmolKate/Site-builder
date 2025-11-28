import { type IBlock } from "../../types";
import "./styles.scss";
import blocks from "../../blocks";

interface IBlockSidebarProps {
  onItemAdd: (block: IBlock) => void;
}

interface IBlockItemProps {
  block: IBlock;
  onItemAdd: (block: IBlock) => void;
}

const BlockItem = ({ block, onItemAdd }: IBlockItemProps) => {
  return (
    <div className="block-sidebar__item" onClick={() => onItemAdd(block)}>
      <div className="block-sidebar__item-icon">
        Some Icon
      </div>
      <div className="block-sidebar__item-name">{block.name}</div>
    </div>
  );
};

const BlockSidebar = ({ onItemAdd }: IBlockSidebarProps) => {
  return (
    <div className="block-sidebar">
      {blocks.map((block) => (
        <BlockItem key={block.id} block={block} onItemAdd={onItemAdd}/>
      ))}
    </div>
  );
};

export default BlockSidebar;