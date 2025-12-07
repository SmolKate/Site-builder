import { Renderer } from "../Renderer";

interface Props {
  childrenIds: string[];
}

export const DefaultTemplate = ({ childrenIds }: Props) => {
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: "10px",
      width: "100%",
      minWidth: 0,
    }}>
      {childrenIds.map((id) => (
        <Renderer key={id} id={id} />
      ))}
    </div>
  );
};