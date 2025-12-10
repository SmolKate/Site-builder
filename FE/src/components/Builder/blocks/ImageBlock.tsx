import { type IBlock } from "@/store/builder/types";
import { imageBlock } from "@/locales";

interface Props {
  block: IBlock;
  readOnly?: boolean;
}

export const ImageBlock = ({ block }: Props) => {
  const src = (block.props.src as string) || "";
  const alt = (block.props.alt as string) || imageBlock.defaultAlt;

  return (
    <div
      style={{
        ...block.style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
      className="image-block-wrapper"
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: "100%",
            height: "auto",
            display: "block",
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#f0f0f0",
            color: "#999",
            width: "100%",
            textAlign: "center",
          }}
        >
          {imageBlock.noImage}
        </div>
      )}
    </div>
  );
};
