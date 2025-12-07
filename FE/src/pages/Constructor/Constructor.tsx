import { useEffect,  useState } from "react";
import GridLayout from "react-grid-layout";
import clsx from "clsx";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  useDroppable,
  pointerWithin
} from "@dnd-kit/core";
import { useParams } from "react-router-dom";

import type { DragEndEvent, DragStartEvent} from "@dnd-kit/core";
import type { BlockType, ILayoutItem } from "@/store/builder/types";

import { useAppSelector, useAppDispatch } from "@/store";
import { useFetchSiteByIdQuery, useUpdateSiteMutation } from "@/store/sites";
import {
  updateLayout,
  getAllComponents,
  selectSelectedId,
  addSection,
  addBlockToContainer,
  selectComponent,
  resetSiteConstructor,
  updateSiteConstructor,
  getLayout
} from "@/store/builder";

import { GRID_COLUMN_NUMBER, ROW_HEIGHT, TOTAL_WIDTH } from "@/utils/constants";
import { ComponentsPanel } from "@/components/Builder/Sidebar/ComponentsPanel";
import { PropertiesPanel } from "@/components/Builder/Sidebar/PropertiesPanel";
import { GridSection } from "@/components/Builder/Canvas/GridSection";
import { createHtmlElement, createLayoutObj, insertHtmlIntoTemplate, uploadHtmlFile } from "./helpers";
import { constructorMessages } from "./messages";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./Constructor.scss"; 

export const Constructor = () => {
  const { siteId } = useParams();

  const dispatch = useAppDispatch();
  const layout = useAppSelector(getLayout);
  const components = useAppSelector(getAllComponents);
  const selectedId = useAppSelector(selectSelectedId);

  const [draggedType, setDraggedType] = useState<string | null>(null);

  const [updateSite] = useUpdateSiteMutation();
  const { data: siteData } = useFetchSiteByIdQuery(siteId ?? "");

  const { 
    setNodeRef: setCanvasRef,
    isOver: isOverCanvas,
  } = useDroppable({ id: "canvas-root", data: { accept: ["container", "page"] }});
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );
  
  const { siteContent, siteInfo } = siteData ?? {};
  const { title: siteTitle = "", description: siteDescription = "" } = siteInfo ?? {};

  useEffect(() => {
    if (siteContent) {
      dispatch(updateSiteConstructor({
        layout: siteContent.layout,
        components: siteContent.components,
        siteTitle: siteTitle,
        siteDescription: siteDescription,
      }));
    }
    return () => {
      dispatch(resetSiteConstructor());
    };
  }, [siteContent]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedType(null);

    if (!active.data.current) return;

    const draggedType = active.data.current.type as string;
    const overData = over?.data.current as { accept?: string[] } | undefined;

    if ((draggedType === "container" || draggedType === "page") && 
        (!over || !overData?.accept)) {
      dispatch(addSection(draggedType as BlockType));
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

  const onSiteSave = async() => {
    if (siteId) {
      await updateSite({
        id: siteId,
        updatesSite: { published: true },
        updatesContent: {
          components: JSON.parse(JSON.stringify(components)),
          layout: JSON.parse(JSON.stringify(layout))
        }
      });
    }
  };

  const onSiteUpload = () => {
    const layoutObj = createLayoutObj(layout, components);
    const htmlString = insertHtmlIntoTemplate(createHtmlElement(layoutObj).getHTML(), siteTitle, siteDescription);
    uploadHtmlFile(htmlString, siteTitle);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={pointerWithin}
      onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="builder">
        <div className="builder__body">
          <div className="builder__components-panel">
            <ComponentsPanel 
              onSiteSave={onSiteSave}
              onSiteUpload={onSiteUpload}
            />
          </div>
          
          <div className="builder__controls">
            <main 
              ref={setCanvasRef}
              className={clsx(
                "builder__canvas-area", 
                {"builder__canvas-area--active": isOverCanvas && draggedType === "container"},
              )}
              onClick={() => dispatch(selectComponent(null))}
            >
              {isOverCanvas && draggedType === "container" && (
                <div className="builder__drop-hint">
                  {constructorMessages.dropBlock}
                </div>
              )}

              <div className="builder__grid-container">
                <GridLayout
                  className="layout"
                  layout={layout}
                  cols={GRID_COLUMN_NUMBER}
                  margin={[0, 0]} 
                  containerPadding={[0, 0]}
                  rowHeight={ROW_HEIGHT}
                  width={TOTAL_WIDTH}
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
                    {constructorMessages.dropSection}
                  </div>
                )}
              </div>
            </main>
          </div>
          <aside className={clsx("builder__sidebar-right", { "is-visible": !!selectedId })}>
            <PropertiesPanel />
          </aside>
        </div>
      </div>
      <DragOverlay>
        {draggedType ? (
          <div className="builder__drag-overlay">
            {constructorMessages.addBlock} {draggedType}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};