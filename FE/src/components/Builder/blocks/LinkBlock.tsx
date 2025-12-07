import { type IBlock } from "@/store/builder/types";

export const LinkBlock = ({ block }: { block: IBlock }) => {
  return (
    <a 
      href={block.props.href as string} 
      style={{ ...block.style }}
      onClick={(e) => e.preventDefault()}
    >
      {block.props.text as string}
    </a>
  );
};