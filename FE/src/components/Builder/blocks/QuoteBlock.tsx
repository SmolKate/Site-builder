import { type IBlock } from "@/store/builder/types";
import { imageBlock } from "@/locales";

export const QuoteBlock = ({ block }: { block: IBlock }) => {
  const text = block.props.text as string;
  const author = block.props.author as string;

  return (
    <blockquote style={{ ...block.style, margin: 0 }}>
      <p style={{ margin: "0 0 10px 0" }}>{text || imageBlock.placeholder}</p>

      {author && <footer style={{ fontSize: "0.8em", opacity: 0.8 }}>— {author}</footer>}
    </blockquote>
  );
};
