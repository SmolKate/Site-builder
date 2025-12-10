import React from "react";
import { useDraggable } from "@dnd-kit/core";
import {
  ButtonIcon,
  TextIcon,
  BoxIcon,
  HeadingIcon,
  ImageIcon,
  VideoIcon,
  Link2Icon,
  DividerHorizontalIcon,
  QuoteIcon,
  ListBulletIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/ui";
import { TButtonSize } from "@/ui/types";
import { componentsPanel } from "@/locales";
import "./ComponentsPanel.scss";

interface DraggableItemProps {
  type: string;
  label: string;
  icon: React.ReactNode;
}

interface ComponentsPanelProps {
  onSiteSave?: () => void;
  onSiteUpload?: () => void;
}

const DraggableItem = ({ type, label, icon }: DraggableItemProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: { type },
  });

  return (
    <div
      ref={setNodeRef}
      className="component-card"
      style={{
        opacity: isDragging ? 0.5 : 1,
        pointerEvents: isDragging ? "none" : "auto",
      }}
      {...listeners}
      {...attributes}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};

export const ComponentsPanel = ({ onSiteSave, onSiteUpload }: ComponentsPanelProps) => {
  const t = componentsPanel;

  return (
    <div className="components-panel">
      <div className="components-panel__header">
        <div className="components-panel__actions">
          <Button
            buttonText={t.buttons.save}
            size={TButtonSize.SMALL}
            onClick={onSiteSave}
            className="components-panel__btn"
          />
          <Button
            buttonText={t.buttons.download}
            size={TButtonSize.SMALL}
            onClick={onSiteUpload}
            className="components-panel__btn"
          />
        </div>
      </div>

      <div className="components-panel__content">
        <div className="components-panel__section-title">{t.sections.layout}</div>
        <div className="components-panel__grid">
          <DraggableItem
            type="container"
            label={t.components.container}
            icon={<BoxIcon width={24} height={24} />}
          />
          {/* <DraggableItem type="page" label={t.components.page} icon={<BoxIcon width={24} height={24} />} />  */}
        </div>

        <div className="components-panel__section-title">{t.sections.typography}</div>
        <div className="components-panel__grid">
          <DraggableItem
            type="text"
            label={t.components.text}
            icon={<TextIcon width={24} height={24} />}
          />
          <DraggableItem
            type="heading"
            label={t.components.heading}
            icon={<HeadingIcon width={24} height={24} />}
          />
        </div>

        <div className="components-panel__section-title">{t.sections.basic}</div>
        <div className="components-panel__grid">
          <DraggableItem
            type="image"
            label={t.components.image}
            icon={<ImageIcon width={24} height={24} />}
          />
          <DraggableItem
            type="button"
            label={t.components.button}
            icon={<ButtonIcon width={24} height={24} />}
          />
          <DraggableItem
            type="video"
            label={t.components.video}
            icon={<VideoIcon width={24} height={24} />}
          />
          {/* <DraggableItem type="input" label={t.components.input} icon={<InputIcon width={24} height={24} />} /> */}
          <DraggableItem
            type="link"
            label={t.components.link}
            icon={<Link2Icon width={24} height={24} />}
          />
        </div>

        <div className="components-panel__section-title">{t.sections.elements}</div>
        <div className="components-panel__grid">
          <DraggableItem
            type="divider"
            label={t.components.divider}
            icon={<DividerHorizontalIcon width={24} height={24} />}
          />
          <DraggableItem
            type="quote"
            label={t.components.quote}
            icon={<QuoteIcon width={24} height={24} />}
          />
          <DraggableItem
            type="list"
            label={t.components.list}
            icon={<ListBulletIcon width={24} height={24} />}
          />
        </div>
      </div>
    </div>
  );
};
