import { Renderer } from "../Renderer";

interface Props {
  childrenIds: string[];
  columns: number;
}

export const GridTemplate = ({ childrenIds, columns }: Props) => {
  return (
    <div 
      style={{ 
        display: "grid", 
        gridTemplateColumns: `repeat(${columns}, 1fr)`, 
        gap: "15px",
        width: "100%",
        alignItems: "center",
        minWidth: 0,
      }}
    >
      {childrenIds.map((id) => (
        <Renderer key={id} id={id} />
      ))}
    </div>
  );
};