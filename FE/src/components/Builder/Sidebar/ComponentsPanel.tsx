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
    data: { type }
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
  return (
    <div className="components-panel">
      <div className="components-panel__header">
        <div className="components-panel__actions">
          <Button
            buttonText="Сохранить"
            size={TButtonSize.SMALL}
            onClick={onSiteSave}
            className="components-panel__btn"
          />
          <Button
            buttonText="Скачать"
            size={TButtonSize.SMALL}
            onClick={onSiteUpload}
            className="components-panel__btn"
          />
        </div>
      </div>

      <div className="components-panel__content">
        <div className="components-panel__section-title">Макет</div>
        <div className="components-panel__grid">
          <DraggableItem type="container" label="Секция" icon={<BoxIcon width={24} height={24} />} />
          {/* <DraggableItem type="page" label="Страница" icon={<BoxIcon width={24} height={24} />} />  */}
        </div>

        <div className="components-panel__section-title">Типографика</div>
        <div className="components-panel__grid">
          <DraggableItem type="text" label="Текст" icon={<TextIcon width={24} height={24} />} />
          <DraggableItem type="heading" label="Заголовок" icon={<HeadingIcon width={24} height={24} />} />
        </div>

        <div className="components-panel__section-title">Основные</div>
        <div className="components-panel__grid">
          <DraggableItem type="image" label="Картинка" icon={<ImageIcon width={24} height={24} />} />
          <DraggableItem type="button" label="Кнопка" icon={<ButtonIcon width={24} height={24} />} />
          <DraggableItem type="video" label="Видео" icon={<VideoIcon width={24} height={24} />} />
          {/* <DraggableItem type="input" label="Инпут" icon={<InputIcon width={24} height={24} />} /> */}
          <DraggableItem type="link" label="Ссылка" icon={<Link2Icon width={24} height={24} />} />
        </div>
        <div className="components-panel__section-title">Элементы</div>
        <div className="components-panel__grid">
          <DraggableItem type="divider" label="Линия" icon={<DividerHorizontalIcon width={24} height={24} />} />
          <DraggableItem type="quote" label="Цитата" icon={<QuoteIcon width={24} height={24} />} />
          <DraggableItem type="list" label="Список" icon={<ListBulletIcon width={24} height={24} />} />
        </div>
      </div>
    </div>
  );
};