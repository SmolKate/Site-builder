import { useEffect, useRef, useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { DndContext, type DragEndEvent, type DragStartEvent,
  DragOverlay, useSensor, useSensors, PointerSensor, useDroppable, pointerWithin } from "@dnd-kit/core";

import { useAppSelector, useAppDispatch } from "@/store";
import { updateLayout, addSection, addBlockToContainer, selectComponent } from "@/store/builder/builderSlice";
import { type BlockType, type ILayoutItem } from "@/store/builder/types";

import { ComponentsPanel } from "@/components/Builder/Sidebar/ComponentsPanel";
import { PropertiesPanel } from "@/components/Builder/Sidebar/PropertiesPanel";
import { ROW_HEIGHT_ENUM } from "@/utils/constants";
import clsx from "clsx";

import "./Constructor.scss"; 
import { BuilderToolbar } from "@/components/Builder/Sidebar/BuilderToolbar";
import { selectSelectedId } from "../../store/builder/selectors";
import { GridSection } from "@/components/Builder/Canvas/GridSection";

export const Constructor = () => {
  const dispatch = useAppDispatch();
  const layout = useAppSelector(state => state.builder.layout);
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const selectedId = useAppSelector(selectSelectedId);
  const [activePanel, setActivePanel] = useState<string | null>(null);


  const drawerRef = useRef<HTMLDivElement>(null);  
  const toolbarRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (activePanel !== "components") return;

    const target = event.target as Node;

    const isOutsideDrawer = drawerRef.current && !drawerRef.current.contains(target);
    const isOutsideToolbar = toolbarRef.current && !toolbarRef.current.contains(target);

    if (isOutsideDrawer && isOutsideToolbar) {
      setActivePanel(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activePanel]);

  const handleTogglePanel = (panel: string) => {
    setActivePanel(prev => prev === panel ? null : panel);
  };
  const { setNodeRef: setCanvasRef, isOver: isOverCanvas } = useDroppable({
    id: "canvas-root",
    data: { 
      accept: ["container"]
    }
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedType(null);

    if (!active.data.current) return;

    const draggedType = active.data.current.type as string;
    const overData = over?.data.current as { accept?: string[] } | undefined;

    if (draggedType === "container" && (!over || !overData?.accept)) {
      dispatch(addSection());
      return;
    }

    if (over && overData?.accept?.includes(draggedType) && over.id !== "canvas-root") {
      dispatch(addBlockToContainer(
        over.id as string, 
        draggedType as BlockType
      ));
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current) {
      setDraggedType(event.active.data.current.type as string);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={pointerWithin}
      onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="builder">
        
        <div className="builder__body">
          <div ref={toolbarRef}>
            <BuilderToolbar 
              activePanel={activePanel} 
              onTogglePanel={handleTogglePanel} 
            />
          </div>

          <div 
            ref={drawerRef}
            className={clsx("builder__drawer", { "is-open": activePanel === "components" })}
          >
            <ComponentsPanel />
          </div>
     
          <main 
            ref={setCanvasRef}
            className={clsx("builder__canvas-area", {
              "builder__canvas-area--active": isOverCanvas && draggedType === "container"
            })}
            onClick={() => dispatch(selectComponent(null))}
          >
            {isOverCanvas && draggedType === "container" && (
              <div className="builder__drop-hint">
                Отпустите чтобы создать секцию
              </div>
            )}

            <div className="builder__grid-container">
              <GridLayout
                className="layout"
                layout={layout}
                cols={12}
                margin={[0, 0]} 
                containerPadding={[0, 0]}
                rowHeight={ROW_HEIGHT_ENUM}
                width={1200}
                draggableHandle=".grid-drag-handle"
                onLayoutChange={(newLayout) => dispatch(updateLayout(newLayout))}
              >
                {layout.map((item: ILayoutItem) => (
                  <div key={item.i}>
                    <GridSection item={item} />
                  </div>
                ))}
              </GridLayout>

              {layout.length === 0 && !draggedType && (
                <div className="builder__empty-state">
                  Перетащите блок "Секция" сюда чтобы начать работу
                </div>
              )}
            </div>
          </main>

          <aside className={clsx("builder__sidebar-right", { "is-visible": !!selectedId })}>
            <PropertiesPanel />
          </aside>
        </div>
      </div>

      <DragOverlay>
        {draggedType ? (
          <div className="builder__drag-overlay">
             Добавить {draggedType}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};