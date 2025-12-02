import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { 
  ButtonIcon, 
  TextIcon, 
  BoxIcon, 
  HeadingIcon,
  ImageIcon,
} from "@radix-ui/react-icons"; 
import "./ComponentsPanel.scss";

interface DraggableItemProps {
  type: string;
  label: string;
  icon: React.ReactNode;
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

export const ComponentsPanel = () => {
  return (
    <div className="components-panel">
      <div className="components-panel__content">
        <div className="components-panel__section-title">Макет</div>
        <div className="components-panel__grid">
          <DraggableItem type="container" label="Секция" icon={<BoxIcon width={24} height={24} />} />
        </div>

        <div className="components-panel__section-title">Типографика</div>
        <div className="components-panel__grid">
          <DraggableItem type="text" label="Текст" icon={<TextIcon width={24} height={24} />} />
          <DraggableItem type="heading" label="Заголовок" icon={<HeadingIcon width={24} height={24} />} />
        </div>

        <div className="components-panel__section-title">Основные</div>
        <div className="components-panel__grid">
          <DraggableItem type="button" label="Кнопка" icon={<ButtonIcon width={24} height={24} />} />
          <DraggableItem type="image" label="Изображение" icon={<ImageIcon width={24} height={24} />} />
        </div>
      </div>
    </div>
  );
};