import React, { useState } from "react";
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
import { VideoBlock } from "./blocks/VideoBlock";
import { QuoteBlock } from "./blocks/QuoteBlock";
import { ListBlock } from "./blocks/ListBlock";
import { NumListBlock } from "./blocks/NumListBlock";
import { InputBlock } from "./blocks/InputBlock";

import { DividerBlock } from "./blocks/DividerBlock";
import { LinkBlock } from "./blocks/LinkBlock";
import { ContainerBlock } from "./blocks/ContainerBlock";

import { RaDialog } from "@/components/Dialog";
import { Button } from "@/ui";
import { BLOCK_TYPES } from "@/store/builder/types";

export const Renderer = ({ id }: { id: string }) => {
  const dispatch = useAppDispatch();
  const block = useAppSelector((state) => selectComponentById(state, id));
  const selectedId = useAppSelector(selectSelectedId);
  const [isOpenDialog, setIsOpenDialog] = useState(false);

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

  const handleToggleDialog = () => {
    setIsOpenDialog((prevState) => !prevState);
  };

  let content = null;

  switch (block.type) {
  case BLOCK_TYPES.CONTAINER:
    content = <ContainerBlock block={block} />;
    break;
  case BLOCK_TYPES.BUTTON:
    content = <ButtonBlock block={block} />;
    break;
  case BLOCK_TYPES.TEXT:
    content = <TextBlock block={block} />;
    break;
  case BLOCK_TYPES.HEADING:
    content = <HeadingBlock block={block} />;
    break;
  case BLOCK_TYPES.IMAGE:
    content = <ImageBlock block={block} />;
    break;
  case BLOCK_TYPES.VIDEO:
    content = <VideoBlock block={block} />;
    break;
  case BLOCK_TYPES.DIVIDER:
    content = <DividerBlock block={block} />;
    break;
  case BLOCK_TYPES.QUOTE:
    content = <QuoteBlock block={block} />;
    break;
  case BLOCK_TYPES.LIST:
    content = <ListBlock block={block} />;
    break;
  case BLOCK_TYPES.NUM_LIST:
    content = <NumListBlock block={block} />;
    break;
  case BLOCK_TYPES.INPUT:
    content = <InputBlock block={block} />;
    break;
  case BLOCK_TYPES.LINK:
    content = <LinkBlock block={block} />;
    break;
  default:
    content = <div>Unknown block: {block.type}</div>;
  }

  return (
    <>
      <div
        onClick={handleSelect}
        className={clsx("renderer-wrapper", {
          "renderer-wrapper--selected": isSelected,
        })}
      >
        {isSelected && (
          <button
            className="renderer-wrapper__delete-btn"
            onClick={handleToggleDialog}
            title="Удалить блок"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <TrashIcon width={14} height={14} />
          </button>
        )}
        {content}
      </div>

      {isOpenDialog && (
        <div className="renderer__dialog">
          <RaDialog
            open={isOpenDialog}
            onClose={handleToggleDialog}
            title="Вы действительно хотите удалить этот блок?"
            content={
              <div className="renderer__dialog-buttons">
                <Button
                  buttonText="Удалить"
                  type="button"
                  variant="primary"
                  onClick={handleDelete}
                />
                <Button
                  buttonText="Отменить"
                  type="button"
                  variant="secondary"
                  onClick={handleToggleDialog}
                />
              </div>
            }
          />
        </div>
      )}
    </>
  );
};
