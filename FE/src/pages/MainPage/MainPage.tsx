/* eslint-disable no-console */
import { useState } from "react";
import {
  useFetchSitesQuery,
  useAddSiteMutation,
  useDeleteSiteMutation,
} from "@/store/sites";
import type { ISiteDTO } from "@/utils/types";

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
    <div className="app">
      <header className="app-header">
        <h1>Site Builder</h1>
        <p>Демо работы с firebase</p>
      </header>

      <main className="main-content">
        <div className="card">
          <h2>Добавить новый сайт</h2>
          <div className="form">
            <input
              type="text"
              placeholder="Название сайта"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Описание сайта"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <button onClick={handleAddSite} disabled={!newTitle.trim()}>
              Добавить сайт
            </button>
          </div>
        </div>

        <div className="card">
          <div className="sites-header">
            <h2>Мои сайты</h2>
          </div>

          {isLoading ? (
            <h2>Загрузка...</h2>
          ) : sites?.length === 0 ? (
            <p className="no-sites">Нет сайтов для отображения</p>
          ) : (
            <div className="sites-list">
              {sites?.map((site) => (
                <div key={site.id} className="site-item">
                  <div className="site-info">
                    <h3>{site.title}</h3>
                    <p>{site.description}</p>
                    <div className="site-meta">
                      <span className="date">{createdAt(site)}</span>
                      <span
                        className={`status ${site.published ? "published" : "draft"}`}
                      >
                        {site.published ? "Опубликован" : "Черновик"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteSite(site.id)}
                    className="delete-btn"
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
