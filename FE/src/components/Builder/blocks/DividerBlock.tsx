import { type IBlock } from "@/store/builder/types";

const toCss = (val: string | number | undefined) => {
  if (val === undefined || val === "") return undefined;
  const str = String(val);
  if (/^\d+(\.\d+)?$/.test(str)) return `${str}px`;
  return str;
};

export const DividerBlock = ({ block }: { block: IBlock }) => {
  const { 
    width, height, backgroundColor, 
    marginTop, marginBottom, padding, ...rest 
  } = block.style;

  const finalWidth = toCss(width) ?? "100%";
  const finalHeight = toCss(height) ?? "2px";
  
  const color = backgroundColor || "#e0e0e0";

  return (
    <div 
      style={{
        ...rest,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: toCss(padding) ?? "10px",
        marginTop: toCss(marginTop) ?? "0px",
        marginBottom: toCss(marginBottom) ?? "0px",
        minWidth: "20px", 
        minHeight: "20px",
        backgroundColor: "transparent", 
        cursor: "default"
      }}
    >
      <div
        style={{
          width: finalWidth,
          height: finalHeight,
          backgroundColor: color,
          borderRadius: "1px",
        }}
      />
    </div>
  );
};