import { type IBlock } from "@/store/builder/types";

interface Props {
  block: IBlock;
  onClick?: () => void;
}

export const ButtonBlock = ({ block, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: block.style.backgroundColor as string || "#007bff",
        color: block.style.color as string || "#fff",
        padding: `${block.style.padding || 10}px`,
        border: "none",
        borderRadius: `${block.style.borderRadius || 4}px`,
        cursor: "pointer",
        ...block.style 
      }}
    >
      {String(block.props.text || "Button")}
    </button>
  );
};