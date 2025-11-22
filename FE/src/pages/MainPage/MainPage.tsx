/* eslint-disable no-console */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useFetchSitesQuery,
  useAddSiteMutation,
  useDeleteSiteMutation,
} from "@/store/sites";
import type { ISiteDTO } from "@/utils/types";
import { RaPopover } from "@/components/Popover";
import { RaDialog } from "@/components/Dialog";
import { siteSchema, type SiteFormData } from "@/utils/helpers";
import "./styles.scss";

export function MainPage() {
  const { data: sites, isLoading } = useFetchSitesQuery();
  const [addSite] = useAddSiteMutation();
  const [deleteSite] = useDeleteSiteMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SiteFormData>({
    resolver: yupResolver(siteSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleAddSite = async({ title, description }: SiteFormData) => {
    const newSite: Omit<ISiteDTO, "id"> = {
      title,
      description,
      createdAt: new Date().toISOString(),
      published: false,
    };

    try {
      await addSite(newSite).unwrap();
      reset();
    } catch (error) {
      console.error("Не удалось добавить сайт", error);
    }
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
          <form className="create-card__form" onSubmit={handleSubmit(handleAddSite)}>
            <label>
              <input
                type="text"
                className="ui-input"
                placeholder="Название проекта"
                {...register("title")}
              />
              {errors.title && (
                <span className="form-error">{errors.title.message}</span>
              )}
            </label>
            <label>
              <input
                type="text"
                className="ui-input"
                placeholder="Краткое описание"
                {...register("description")}
              />
              {errors.description && (
                <span className="form-error">{errors.description.message}</span>
              )}
            </label>
            <button
              className="ui-btn ui-btn--primary"
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              Создать сайт
            </button>
          </form>
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
