import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { useDroppable } from "@dnd-kit/core";
import type { IBlock } from "@/store/builder/types"; 
import { useAppDispatch } from "@/store";
import { deleteComponent } from "@/store/builder/builderSlice";
import { Cross2Icon, MoveIcon } from "@radix-ui/react-icons";
import { SectionContent } from "./SectionContent";
import "./PageSection.scss";

interface PageSectionProps {
  id: string;
  block: IBlock;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent<HTMLDivElement>) => void;
  onContentResize: (height: number) => void;
  style?: React.CSSProperties;
  className?: string;
}

export const PageSection = ({
  id,
  block,
  isSelected,
  onSelect,
  onContentResize,
  style,
  className,
}: PageSectionProps) => {
  const dispatch = useAppDispatch();
  const [isHovered, setIsHovered] = useState(false);
  
  const { setNodeRef, isOver } = useDroppable({ 
    id,
    data: { accept: ["button", "text", "heading", "image", "video", "divider",
      "quote", "list", "input", "link", "container"] }
  });

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement;
          onContentResize(target.scrollHeight);
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

  const hasSidebar = block.props.hasSidebar === "1";
  const sidebarWidth = block.style.sidebarWidth || "250px";

  return (
    <section
      ref={setNodeRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        "page-section",
        className,
        {
          "page-section--selected": isSelected,
          "page-section--hovered": isHovered && !isSelected,
          "page-section--over": isOver
        }
      )}
      style={style} 
      onClick={onSelect}
    >
      <div 
        className={clsx("page-section__handle", "grid-drag-handle", {
          "page-section__handle--visible": isHovered || isSelected
        })}
      >
        <div className="page-section__handle-icon"><MoveIcon width={12} height={12} /></div>
        <div className="page-section__handle-divider" />
        <div className="page-section__delete-btn no-drag"
          onMouseDown={(e) => e.stopPropagation()} onClick={handleDelete}>
          <Cross2Icon width={14} height={14} />
        </div>
      </div>

      <div ref={contentRef} className="page-section__container no-drag">
        
        <header 
          className="page-section__header"
          style={{ 
            backgroundColor: block.style.headerBg as string,
            color: block.style.headerColor as string
          }}
        >
          <h3>{block.props.headerText as string || "Header"}</h3>
        </header>

        <div className="page-section__body">
          
          {hasSidebar && (
            <aside 
              className="page-section__sidebar"
              style={{ 
                width: sidebarWidth as string,
                backgroundColor: block.style.sidebarBg as string,
                flexShrink: 0
              }}
            >
              <div style={{ padding: "10px", opacity: 0.6 }}>Sidebar</div>
            </aside>
          )}

          <main 
            className="page-section__main"
            style={{ 
              backgroundColor: block.style.backgroundColor as string,
            }}
          >
            {block.childrenIds.length > 0 ? (
              <SectionContent 
                variant={block.variant} 
                childrenIds={block.childrenIds} 
              />
            ) : (
              <div className="page-section__placeholder">
                {isOver ? "Отпустите здесь" : "Перетащите блоки в центр"}
              </div>
            )}
          </main>
        </div>

        <footer 
          className="page-section__footer"
          style={{ 
            backgroundColor: block.style.footerBg as string,
            color: block.style.footerColor as string
          }}
        >
          <p>{block.props.footerText as string || "Footer"}</p>
        </footer>

      </div>
    </section>
  );
};