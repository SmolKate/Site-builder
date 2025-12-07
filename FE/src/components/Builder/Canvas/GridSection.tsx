import React from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { selectComponentById } from "../../../store/builder";
import { updateSectionDimensions, selectComponent } from "@/store/builder/builderSlice";
import { ROW_HEIGHT } from "@/utils/constants";
import { CanvasSection } from "./CanvasSection";
import { PageSection } from "./PageSection"; // <-- Импорт
import { type ILayoutItem } from "@/store/builder/types";
interface GridSectionProps {
  item: ILayoutItem;
}

export const GridSection = ({ item }: GridSectionProps) => {
  const dispatch = useAppDispatch();
  const block = useAppSelector((state) => selectComponentById(state, item.i));
  const selectedId = useAppSelector(state => state.builder.selectedId);

  if (!block) return null;

  const isSelected = selectedId === item.i;

  const handleSelect = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    dispatch(selectComponent(item.i));
  };

  const handleContentResize = (contentHeight: number) => {
    const neededRows = Math.ceil(contentHeight / ROW_HEIGHT);
    const minRows = 2; 
    const targetRows = Math.max(neededRows, minRows);

    if (targetRows > item.h) {
      dispatch(updateSectionDimensions({ i: item.i, h: targetRows }));
    }
  };

  if (block.type === "page") {
    return (
      <PageSection
        id={item.i}
        block={block}
        isSelected={isSelected}
        onSelect={handleSelect}
        onContentResize={handleContentResize}
      />
    );
  }

  return (
    <CanvasSection
      id={item.i}
      block={block}
      isSelected={isSelected}
      onSelect={handleSelect}
      onContentResize={handleContentResize}
    />
  );
};