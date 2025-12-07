import { type IBlock } from "@/store/builder/types";

export const DividerBlock = ({ block }: { block: IBlock }) => {
  return <hr style={{ ...block.style }} />;
};