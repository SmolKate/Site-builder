/* eslint-disable no-console */
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import type { ISiteDTO } from "../../utils/types";
import { db } from "../../config";

export function MainPage() {
  const [sites, setSites] = useState<ISiteDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const fetchSites = async() => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "sites"));
      const sitesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as ISiteDTO[];
      setSites(sitesData);
    } catch (error) {
      console.error("Ошибка получения данных о сайтах:", error);
    } finally {
      setLoading(false);
    }
  };

  const addNewSite = async() => {
    if (!newTitle.trim()) return;

    try {
      const newSite: Omit<ISiteDTO, "id"> = {
        title: newTitle,
        description: newDescription,
        createdAt: new Date().toISOString(),
        published: false
      };
      await addDoc(collection(db, "sites"), newSite);
      setNewTitle("");
      setNewDescription("");
      fetchSites();
    } catch (error) {
      console.error("Упс, ошибка создания сайта:", error);
    }
  };

  const deleteSite = async(siteId: string) => {
    try {
      await deleteDoc(doc(db, "sites", siteId));
      fetchSites();
    } catch (error) {
      console.error("Ошибка удаления сайта:", error);
    }
  };

  const createdAt = (site: ISiteDTO) =>
    new Date(site.createdAt).toLocaleDateString("ru-RU");

  useEffect(() => {
    fetchSites();
  }, []);

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
            <button onClick={addNewSite} disabled={!newTitle.trim()}>
              Добавить сайт
            </button>
          </div>
        </div>

        <div className="card">
          <div className="sites-header">
            <h2>Мои сайты</h2>
            <button onClick={fetchSites} disabled={loading}>
              {loading ? "Загрузка..." : "Обновить"}
            </button>
          </div>

          {sites.length === 0 ? (
            <p className="no-sites">Нет сайтов для отображения</p>
          ) : (
            <div className="sites-list">
              {sites.map((site) => (
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
                    onClick={() => deleteSite(site.id)}
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
