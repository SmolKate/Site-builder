 
import { useState } from "react";
import {
  useFetchSitesQuery,
  useAddSiteMutation,
  useDeleteSiteMutation,
} from "@/store/sites";
import type { ISiteDTO } from "@/utils/types";
import { RaPopover } from "@/components/Popover";
import { RaDialog } from "@/components/Dialog";
import "./styles.scss";

export function MainPage() {
  const { data: sites, isLoading } = useFetchSitesQuery();
  const [addSite] = useAddSiteMutation();
  const [deleteSite] = useDeleteSiteMutation();
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleAddSite = () => {
    if (!newTitle.trim()) return;

    const newSite: Omit<ISiteDTO, "id"> = {
      title: newTitle,
      description: newDescription,
      createdAt: new Date().toISOString(),
      published: false,
    };

    setNewTitle("");
    setNewDescription("");

    addSite(newSite);
  };

  const handleDeleteSite = (siteId: string) => {
    deleteSite(siteId);
  };

  const createdAt = (site: ISiteDTO) =>
    new Date(site.createdAt).toLocaleDateString("ru-RU");

  return (
    <div className="main-page">
      <header className="main-page__header">
        <h1 className="main-page__title">Site Builder</h1>
        <p className="main-page__subtitle">Панель управления проектами</p>
      </header>

      <RaPopover />
      <RaDialog />

      <main className="main-page__content">
        <div className="create-card">
          <h2 className="create-card__title">Создать новый сайт</h2>
          <div className="create-card__form">
            <input
              type="text"
              className="ui-input"
              placeholder="Название проекта"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
              type="text"
              className="ui-input"
              placeholder="Краткое описание"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <button
              className="ui-btn ui-btn--primary"
              onClick={handleAddSite}
              disabled={!newTitle.trim()}
            >
              Создать сайт
            </button>
          </div>
        </div>

        <div className="sites-section">
          <div className="sites-section__header">
            <h2 className="sites-section__title">Мои сайты</h2>
          </div>

          {isLoading ? (
            <h2>Загрузка...</h2>
          ) : sites?.length === 0 ? (
            <div className="sites-section__empty">
              <p>Нет сайтов для отображения. Создайте свой первый проект!</p>
            </div>
          ) : (
            <div className="sites-section__grid">
              {sites?.map((site) => (
                <div key={site.id} className="site-card">
                  <div className="site-card__info">
                    <h3 className="site-card__title">{site.title}</h3>
                    <p className="site-card__desc">{site.description}</p>

                    <div className="site-card__meta">
                      <span className="site-card__date">{createdAt(site)}</span>
                      <span
                        className={`status-badge ${
                          site.published
                            ? "status-badge--published"
                            : "status-badge--draft"
                        }`}
                      >
                        {site.published ? "Live" : "Draft"}
                      </span>
                    </div>
                  </div>

                  <div className="site-card__actions">
                    <button
                      onClick={() => handleDeleteSite(site.id)}
                      className="ui-btn ui-btn--danger ui-btn--sm"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
