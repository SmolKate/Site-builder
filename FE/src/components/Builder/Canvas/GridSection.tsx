import React from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { selectComponentById } from "../../../store/builder";
import { updateSectionDimensions, selectComponent } from "@/store/builder/builderSlice";
import { ROW_HEIGHT_ENUM } from "@/utils/constants";
import { CanvasSection } from "./CanvasSection";
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
    const MARGIN_Y = 0;
    const totalNeededPx = contentHeight;
    const neededRows = Math.ceil(totalNeededPx / (ROW_HEIGHT_ENUM + MARGIN_Y));
    const minRows = 1;
    const targetRows = Math.max(neededRows, minRows);

    if (targetRows > item.h) {
      dispatch(updateSectionDimensions({ i: item.i, h: targetRows }));
    }
  };

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