import { useState } from "react";
import GridLayout, { type Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { BlockSidebar } from "./components/BlockSidebar";
import { type IBlock, type ILayoutConfigItem } from "./types";
import { LayoutItem } from "./components/LayoutItem";
import "./styles.scss";

export const NewSite = () => {
  const savedLayout = window.localStorage.getItem("layout");
  const savedStyleLayout = window.localStorage.getItem("layoutConfig");

  const [layout, setLayout] = useState<Layout[]>(savedLayout ? JSON.parse(savedLayout) : []);
  const [layoutConfig, setLayoutConfig] = useState<ILayoutConfigItem[]>(
    savedStyleLayout ? JSON.parse(savedStyleLayout) : []
  );

  const handleAddBlock = (block: IBlock) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = block;
    const RColor = Math.random() * 255;
    const GColor = Math.random() * 255;
    const BColor = Math.random() * 255;
    const backgroundColor = `rgb(${RColor}, ${GColor}, ${BColor})`;
    const uuid = crypto.randomUUID();

    const newBlock = {
      i: uuid,
      x: 0,
      y: 12,
      w: 2,
      h: 2,
    };
    const newBlockConfig = {
      i: uuid,
      style: {
        backgroundColor,
      },
      htmlAttr: rest,
    };

    setLayout((prevState) => {
      return [...prevState, newBlock];
    });
    setLayoutConfig((prevState) => {
      return [...prevState, newBlockConfig];
    });
  };

  const handleSaveLayout = () => {
    window?.localStorage?.setItem("layout", JSON.stringify(layout));
    window?.localStorage?.setItem("layoutConfig", JSON.stringify(layoutConfig));
  };

  return (
    <div className="builder__container">
      <div className="builder__btns">
        <button onClick={handleSaveLayout}>Save</button>
      </div>
      <div className="builder__content">
        <BlockSidebar onItemAdd={handleAddBlock} />
        <div className="builder__grid-container">
          <div className="builder__grid">
            {Array(1200)
              .fill(0)
              .map((_, index) => {
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
            {layout.map((item) => (
              <div key={item.i}>
                <LayoutItem
                  item={item}
                  layout={layout}
                  layoutConfig={layoutConfig}
                  setLayout={setLayout}
                  setLayoutConfig={setLayoutConfig}
                />
              </div>
            ))}
          </GridLayout>
        </div>
      </div>
    </div>
  );
};
