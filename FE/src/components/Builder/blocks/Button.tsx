import { type IBlock } from "@/store/builder/types";
interface Props {
  block: IBlock;
  onClick?: () => void;
}

export const ButtonBlock = ({ block, onClick }: Props) => {
  const actionType = block.props.actionType as string;
  const actionValue = block.props.actionValue as string;
  
  let title = "Кнопка";
  if (actionType === "link") title = `Ссылка на: ${actionValue}`;
  if (actionType === "anchor") title = `Скролл к: ${actionValue}`;
  if (actionType === "email") title = `Email: ${actionValue}`;

  return (
    <button
      onClick={(e) => {
        if (onClick) onClick();
        e.preventDefault(); 
      }}
      title={title}
      style={{
        backgroundColor: (block.style.backgroundColor as string) || "#007bff",
        color: (block.style.color as string) || "#fff",
        padding: (block.style.padding as string) || "10px 20px",
        border: "none",
        borderRadius: `${block.style.borderRadius || 4}px`,
        cursor: "default", 
        width: block.style.width as string,
        height: block.style.height as string,
        fontSize: block.style.fontSize as string,
        fontFamily: block.style.fontFamily as string,
        fontWeight: block.style.fontWeight as string,
        textAlign: "center",
        ...block.style,
      }}
    >
      {String(block.props.text || "Button")}
    </button>
  );
};