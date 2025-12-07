import { type IBlock } from "@/store/builder/types";

export const VideoBlock = ({ block }: { block: IBlock }) => {
  let src = (block.props.src as string) || "";

  const videoIdMatch = src.match(/(?:v=|youtu\.be\/|\/embed\/)([^&?/]+)/);
  
  if (videoIdMatch && videoIdMatch[1]) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    src = `https://www.youtube.com/embed/${videoIdMatch[1]}?origin=${origin}`;
  }

  return (
    <div 
      style={{ 
        position: "relative",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        ...block.style 
      }}
    >
      <div 
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          cursor: "pointer"
        }}
      />
      
      <iframe
        src={src}
        title="video player"
        style={{ 
          width: "100%", 
          height: "100%",
          pointerEvents: "none", 
          border: "none"
        }}
        allowFullScreen
      />
    </div>
  );
};