import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { useDroppable } from "@dnd-kit/core";
import type { IBlock } from "@/store/builder/types";
import { COMMON_ACCEPT_DATA } from "@/store/builder/types";
import { useAppDispatch } from "@/store";
import { deleteComponent } from "@/store/builder/builderSlice";
import { Cross2Icon, MoveIcon } from "@radix-ui/react-icons";
import { Renderer } from "../Renderer";
import "./CanvasSection.scss";
import { canvasSection } from "@/locales";

interface CanvasSectionProps {
  id: string;
  block: IBlock;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent<HTMLDivElement>) => void;
  onContentResize: (height: number) => void;
  style?: React.CSSProperties;
  className?: string;
}

export const CanvasSection = ({
  id,
  block,
  isSelected,
  onSelect,
  onContentResize,
  style,
  className,
}: CanvasSectionProps) => {
  const dispatch = useAppDispatch();
  const [isHovered, setIsHovered] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      accept: COMMON_ACCEPT_DATA,
    },
  });

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement;
          const height = target.scrollHeight;

          onContentResize(height);
        }
      });
    });

    resizeObserver.observe(contentRef.current);
    return () => resizeObserver.disconnect();
  }, [onContentResize]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteComponent(id));
  };

  return (
    <section
      ref={setNodeRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx("canvas-section", className, {
        "canvas-section--selected": isSelected,
        "canvas-section--hovered": isHovered && !isSelected,
        "canvas-section--over": isOver,
      })}
      style={style}
      onClick={onSelect}
    >
      <div
        className={clsx("canvas-section__handle", "grid-drag-handle", {
          "canvas-section__handle--visible": isHovered || isSelected,
        })}
      >
        <div className="canvas-section__handle-icon">
          <MoveIcon width={12} height={12} />
        </div>
        <div className="canvas-section__handle-divider" />
        <div
          className="canvas-section__delete-btn no-drag"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handleDelete}
        >
          <Cross2Icon width={14} height={14} />
        </div>
      </div>

      <div
        ref={contentRef}
        className="canvas-section__content no-drag"
        style={{
          ...block.style,
        }}
      >
        {block.childrenIds.length > 0 && (
          <>
            {block.childrenIds.map((id) => (
              <Renderer key={id} id={id} />
            ))}
          </>
        )}

        {block.childrenIds.length === 0 && !isOver && (
          <div className="canvas-section__placeholder">{canvasSection.placeholder}</div>
        )}

        {isOver && (
          <div className="canvas-section__drop-indicator">{canvasSection.dropIndicator}</div>
        )}
      </div>
    </section>
  );
};
