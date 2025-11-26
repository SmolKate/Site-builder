import GridLayout, { type Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useState } from "react";
import "./styles.scss";

export const NewSite = () => {
  const savedLayout = window.localStorage.getItem("layout");
  const savedStyleLayout = window.localStorage.getItem("styleLayout");
  
  const [layout, setLayout] = useState<Layout[]>(
    savedLayout ? JSON.parse(savedLayout) : []
  );
  const [styleLayout, setStyleLayout] = useState<{i: string, backgroundColor: string}[]>(
    savedStyleLayout ? JSON.parse(savedStyleLayout) : []
  );

  const handleAddBlock = () => {
    const RColor = Math.random() * 255;
    const GColor = Math.random() * 255;
    const BColor = Math.random() * 255;
    const backgroundColor = `rgb(${RColor}, ${GColor}, ${BColor})`;
    const uuid = crypto.randomUUID();

    const newBlock = {
      i: uuid,
      x: 0,
      y: 12,
      w: 1,
      h: 2,
    };
    const newBlockStyle = {
      i: uuid,
      backgroundColor
    };

    setLayout(prevState => {return [...prevState, newBlock];});
    setStyleLayout(prevState => {return [...prevState, newBlockStyle];});
  };

  const handleSaveLayout = () => {
    window?.localStorage?.setItem("layout", JSON.stringify(layout));
    window?.localStorage?.setItem("styleLayout", JSON.stringify(styleLayout));
  };

  return (
    <div className="builder__container">
      <div className="builder__btns">
        <button onClick={handleAddBlock}>Add new block</button>
        <button onClick={handleSaveLayout}>Save</button>
      </div>
      <div className="builder__grid">
        {Array(1200).fill(0).map((_, index) => {
          return <div key={index} className="builder__grid-item"></div>;
        })}
      </div>
      <GridLayout
        className="builder__layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
        margin={[0, 0]}
        onLayoutChange={(layout) => {
          setLayout(layout);
        }}
      >
        {layout.map((item, index) => {
          const blockStyle = styleLayout.find((style) => style.i === item.i);

          return (
            <div key={item.i} style={{ background: blockStyle?.backgroundColor }}>Блок {index}</div>
          );
        })}
      </GridLayout>
    </div>
  );
};
