import React from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { deleteComponent, selectComponent } from "@/store/builder/builderSlice"; 
import { selectSelectedId, selectComponentById } from "../../store/builder";
import clsx from "clsx";
import { TrashIcon } from "@radix-ui/react-icons"; 

import { ButtonBlock } from "./blocks/Button";
import { TextBlock } from "./blocks/TextBlock";
import { HeadingBlock } from "./blocks/HeadingBlock";
import { ImageBlock } from "./blocks/ImageBlock";

import "./Renderer.scss";

export const Renderer = ({ id }: { id: string }) => {
  const dispatch = useAppDispatch();
  const block = useAppSelector(state => selectComponentById(state, id));
  const selectedId = useAppSelector(selectSelectedId);

  if (!block) return null;

  const isSelected = selectedId === id;

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(selectComponent(id));
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteComponent(id));
  };

  let content = null;

  switch (block.type) {
  case "button":
    content = <ButtonBlock block={block} />;
    break;
  case "text":
    content = <TextBlock block={block} />;
    break;
  case "heading":
    content = <HeadingBlock block={block} />;
    break;
  case "image":
    content = <ImageBlock block={block} />;
    break;
  default:
    content = <div>Unknown block: {block.type}</div>;
  }

  return (
    <div 
      onClick={handleSelect}
      className={clsx("renderer-wrapper", {
        "renderer-wrapper--selected": isSelected
      })}
    >
      {isSelected && (
        <button 
          className="renderer-wrapper__delete-btn"
          onClick={handleDelete}
          title="Удалить блок"
          onMouseDown={(e) => e.stopPropagation()} 
        >
          <TrashIcon width={14} height={14} />
        </button>
      )}
      {content}
    </div>
  );
};