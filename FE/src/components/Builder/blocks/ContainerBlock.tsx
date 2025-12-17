import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { type IBlock, COMMON_ACCEPT_DATA } from "@/store/builder/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectSelectedId } from "@/store/builder";
import { deleteComponent, selectComponent } from "@/store/builder/builderSlice";
import { Cross2Icon } from "@radix-ui/react-icons";
import { SectionContent } from "../Canvas/SectionContent";

import "./ContainerBlock.scss";

interface Props {
  block: IBlock;
}

export const ContainerBlock = ({ block }: Props) => {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector(selectSelectedId);

  const { setNodeRef, isOver } = useDroppable({
    id: block.id,
    data: {
      accept: COMMON_ACCEPT_DATA,
    },
  });

  const isSelected = selectedId === block.id;

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(selectComponent(block.id));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteComponent(block.id));
  };

  return (
    <div
      ref={setNodeRef}
      onClick={handleSelect}
      className={clsx("container-block", {
        "is-selected": isSelected,
        "is-over": isOver,
      })}
      style={{
        ...block.style,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minHeight: block.style.minHeight || "50px",
      }}
    >
      {isSelected && (
        <button className="container-block__delete" onClick={handleDelete}>
          <Cross2Icon />
        </button>
      )}

      {isSelected && <div className="container-block__label">Container</div>}

      {block.childrenIds.length > 0 ? (
        <SectionContent variant={block.variant} childrenIds={block.childrenIds} />
      ) : (
        <div className="container-block__empty">{isOver ? "Бросайте сюда!" : "Контейнер"}</div>
      )}
    </div>
  );
};
