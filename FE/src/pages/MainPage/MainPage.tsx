import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { orderBy } from "lodash";
import {
  useFetchSitesQuery,
  useAddSiteMutation,
  useDeleteSiteMutation,
  // useGetSiteContentQuery,
} from "@/store/sites";
import type { ISelectedPage, ISiteDTO } from "@/utils/types";
import { RaPopover } from "@/components/Popover";
import { siteSchema, type SiteFormData } from "@/utils/helpers";
import { InputField, Button, Pagination, Dropdown } from "@/ui";
import { TVariant } from "@/ui/types";

import { paginate } from "@/utils";
import { ITEMS_PER_PAGE } from "@/utils/constants";
import { useGetCurrentUserQuery, useUpdateUserMutation } from "@/store/users";
import "./styles.scss";
import { useNavigate } from "react-router-dom";

export function MainPage() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [sortAlg, setSortAlg] = useState("alphabet-asc");
  const { data: sites, isLoading } = useFetchSitesQuery();
  const [addSite] = useAddSiteMutation();
  const [deleteSite] = useDeleteSiteMutation();
  const [updateUser] = useUpdateUserMutation();
  // const { data: getSiteContent, isLoading: isLoadingSiteContent } =
  //   useGetSiteContentQuery("dpiZfBk007dKBmlMdE52");
  const { data: currentUser, isLoading: currentUserLoading } = useGetCurrentUserQuery();

  const iter = sortAlg.split("-")[0];
  const order = sortAlg.split("-")[1];
  const sortedSites = orderBy(
    sites,
    iter === "alphabet" ? "title" : "createdAt",
    order === "asc" ? "asc" : "desc"
  );
  const pageCount = Math.ceil(sortedSites.length / ITEMS_PER_PAGE);
  const sitesCrop = paginate(sortedSites, page, ITEMS_PER_PAGE);

  const handleDeleteSite = (siteId: string) => {
    deleteSite(siteId);
  };

  const handlePageChange = ({ selected }: ISelectedPage) => {
    setPage(selected + 1);
  };

  const handleSortSites = (alg: string) => {
    setSortAlg(alg);
  };

  const createdAt = (site: ISiteDTO) => new Date(site.createdAt).toLocaleDateString("ru-RU");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitSuccessful, isSubmitting },
  } = useForm<SiteFormData>({
    resolver: yupResolver(siteSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit = async(data: SiteFormData) => {
    const newSite: Omit<ISiteDTO, "id"> = {
      title: data.title,
      description: data.description,
      createdAt: new Date().toISOString(),
      published: false,
    };
    const siteContent = { components: {}, layout: [] };
    const { data: idSite } = await addSite({ newSite, siteContent });
   
    if (currentUser && idSite) {
      updateUser({ uid: currentUser.uid, updates: { sites: idSite } });
      navigate(`/sites/${idSite}`);
    }
    // if (!isLoadingSiteContent) {
    //   console.log("getSiteContent", getSiteContent);
    // }
  };

  return (
    <div className="main-page">
      <header className="main-page__header">
        <h1 className="main-page__title">Site Builder</h1>
        <p className="main-page__subtitle">Панель управления проектами</p>
      </header>

      <RaPopover />

      <main className="main-page__content">
        <div className="create-card">
          <h2 className="create-card__title">Создать новый сайт</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="create-card__form">
            <InputField
              register={register}
              errors={errors}
              fieldName="title"
              placeholder="Название проекта"
              variant={TVariant.SECONDARY}
            />
            <InputField
              register={register}
              errors={errors}
              fieldName="description"
              placeholder="Краткое описание"
              variant={TVariant.SECONDARY}
            />
            <Button buttonText="Создать сайт" type="submit" disabled={!isValid || isSubmitting} />
          </form>
        </div>

        <div className="sites-section">
          <div className="sites-section__header">
            <h2 className="sites-section__title">Мои сайты</h2>
          </div>
          <div className="sites-section__query">
            <Dropdown sortAlg={sortAlg} onSortSites={handleSortSites} />
          </div>
          {isLoading || currentUserLoading ? (
            <h2>Загрузка...</h2>
          ) : sitesCrop?.length === 0 ? (
            <div className="sites-section__empty">
              <p>Нет сайтов для отображения. Создайте свой первый проект!</p>
            </div>
          ) : (
            <div className="sites-section__grid">
              {sitesCrop?.map((site) => (
                <div key={site.id} className="site-card" onClick={() => navigate(`/sites/${site.id}`)}>
                  <div className="site-card__info">
                    <h3 className="site-card__title">{site.title}</h3>
                    <p className="site-card__desc">{site.description}</p>

                    <div className="site-card__meta">
                      <span className="site-card__date">{createdAt(site)}</span>
                      <span
                        className={`status-badge ${
                          site.published ? "status-badge--published" : "status-badge--draft"
                        }`}
                      >
                        {site.published ? "Live" : "Draft"}
                      </span>
                    </div>
                  </div>

                  <div className="site-card__actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSite(site.id);
                      }}
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

        {pageCount > 0 && (
          <Pagination onPageChange={handlePageChange} pageCount={pageCount} page={page} />
        )}
      </main>
    </div>
  );
}
