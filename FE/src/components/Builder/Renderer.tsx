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
import { InputBlock } from "./blocks/InputBlock";

import { DividerBlock } from "./blocks/DividerBlock";
import { LinkBlock } from "./blocks/LinkBlock";
import { ContainerBlock } from "./blocks/ContainerBlock";

import { RaDialog } from "@/components/Dialog";
import { Button } from "@/ui";

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
  case "container":
    content = <ContainerBlock block={block} />;
    break;
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
  case "video":
    content = <VideoBlock block={block} />;
    break;
  case "divider":
    content = <DividerBlock block={block} />;
    break;
  case "quote":
    content = <QuoteBlock block={block} />;
    break;
  case "list":
    content = <ListBlock block={block} />;
    break;
  case "input":
    content = <InputBlock block={block} />;
    break;
  case "link":
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
