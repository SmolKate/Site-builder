import { PlusIcon, LayersIcon, GearIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import "./BuilderToolbar.scss";

interface Props {
  activePanel: string | null;
  onTogglePanel: (panel: string) => void;
}

export const BuilderToolbar = ({ activePanel, onTogglePanel }: Props) => {
  return (
    <aside className="builder-toolbar">
      <div className="builder-toolbar__top">
        <div className="builder-toolbar__logo">
          ЛОГО
        </div>
      </div>

      <div className="builder-toolbar__tools">
        
        <button 
          className={clsx("builder-toolbar__btn", { "is-active": activePanel === "components" })}
          onClick={() => onTogglePanel("components")}
          title="Добавить компоненты"
        >
          <PlusIcon width={24} height={24} />
          <span>Блоки</span>
        </button>

        <button 
          className={clsx("builder-toolbar__btn", { "is-active": activePanel === "layers" })}
          onClick={() => onTogglePanel("layers")}
          title="Слои (скоро)"
        >
          <LayersIcon width={24} height={24} />
          <span>Слои</span>
        </button>

      </div>

      <div className="builder-toolbar__bottom">
        <button className="builder-toolbar__btn">
          <GearIcon width={24} height={24} />
        </button>
      </div>
    </aside>
  );
};