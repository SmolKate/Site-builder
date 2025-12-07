import { type IBlock } from "@/store/builder/types";

export const InputBlock = ({ block }: { block: IBlock }) => {
  return (
    <input
      type="text"
      placeholder={block.props.placeholder as string}
      style={{ ...block.style }}
      readOnly
    />
  );
};