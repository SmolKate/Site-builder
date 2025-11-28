import { useEffect, useState, type ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { orderBy } from "lodash";
import { yupResolver } from "@hookform/resolvers/yup";
import { mainPageMessages } from "@/locales";
import { useFetchSitesQuery, useAddSiteMutation, useDeleteSiteMutation } from "@/store/sites";
import type { ISelectedPage, ISiteDTO } from "@/utils/types";
import { siteSchema, type SiteFormData } from "@/utils/helpers";
import { InputField, Button, Pagination, Loader, Dropdown, SearchInputField } from "@/ui";
import { LSize, LVariant } from "@/ui/Loader";
import { TVariant } from "@/ui/types";
import { paginate } from "@/utils";
import { ITEMS_PER_PAGE } from "@/utils/constants";
import { useDebounce } from "@/utils/hooks";
import { useGetCurrentUserQuery, useUpdateUserMutation } from "@/store/users";
import { RaDialog } from "@/components/Dialog";
import { MainDialogContent } from "./MainDialogContent";
import "./styles.scss";

export function MainPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery);
  const [sortAlg, setSortAlg] = useState("alphabet-asc");
  const [accessError, setAccessError] = useState<null | string>(null);
  const { data: sites, isLoading } = useFetchSitesQuery();
  const [addSite] = useAddSiteMutation();
  const [deleteSite] = useDeleteSiteMutation();
  const [updateUser] = useUpdateUserMutation();
  const { data: currentUser } = useGetCurrentUserQuery();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [site, setSite] = useState<{ id: string; title: string }>({ id: "", title: "" });

  const iter = sortAlg.split("-")[0];
  const order = sortAlg.split("-")[1];
  const sortedSites = orderBy(
    sites,
    iter === "alphabet" ? "title" : "createdAt",
    order === "asc" ? "asc" : "desc"
  );
  const filteredSites = sortedSites?.filter((site) =>
    site?.title?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );
  const pageCount = Math.ceil(filteredSites.length / ITEMS_PER_PAGE);
  const sitesCrop = paginate(filteredSites, page, ITEMS_PER_PAGE);

  const handlePageChange = ({ selected }: ISelectedPage) => {
    setPage(selected + 1);
  };

  const handleSortSites = (alg: string) => {
    setSortAlg(alg);
  };

  const handleSearchQuery = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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

  useEffect(() => {
    if (location.state?.unauthorizedRedirect) {
      setAccessError(location.state?.message);
      navigate(location.pathname, {
        state: {},
        replace: true,
      });
    }
  }, [location.key]);

  // eslint-disable-next-line space-before-function-paren
  const onSubmit = async (data: SiteFormData) => {
    const newSite: Omit<ISiteDTO, "id"> = {
      title: data.title,
      description: data.description,
      createdAt: new Date().toISOString(),
      published: false,
    };
    const siteContent = { components: {}, layout: [] };
    const { data: idSite } = await addSite({ newSite, siteContent });

    if (currentUser && idSite) {
      updateUser({ uid: currentUser.uid!, updates: { sites: idSite } });
      navigate(`/sites/${idSite}`);
    }
  };

  return (
    <div className="main-page">
      <header className="main-page__header">
        <h1 className="main-page__title">{mainPageMessages.title}</h1>
        <p className="main-page__subtitle">{mainPageMessages.subtitle}</p>
      </header>

      {accessError && <p className="auth-page__error">{accessError}</p>}

      <RaDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title={mainPageMessages.confirmDelete.title}
        content={
          <MainDialogContent
            site={site}
            onDelete={deleteSite}
            onClose={() => setOpenDialog(false)}
          />
        }
      />

      <main className="main-page__content">
        <div className="create-card">
          <h2 className="create-card__title">{mainPageMessages.createCard.title}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="create-card__form">
            <InputField
              register={register}
              errors={errors}
              fieldName="title"
              placeholder={mainPageMessages.createCard.titlePlaceholder}
              variant={TVariant.SECONDARY}
            />
            <InputField
              register={register}
              errors={errors}
              fieldName="description"
              placeholder={mainPageMessages.createCard.descriptionPlaceholder}
              variant={TVariant.SECONDARY}
            />
            <Button
              buttonText={mainPageMessages.createCard.submit}
              type="submit"
              disabled={!isValid || isSubmitting}
            />
          </form>
        </div>

        <div className="sites-section">
          <div className="sites-section__header">
            <h2 className="sites-section__title">{mainPageMessages.sitesSection.title}</h2>
          </div>
          <div className="sites-section__query">
            <SearchInputField value={searchQuery} onChange={handleSearchQuery} />
            <Dropdown sortAlg={sortAlg} onSortSites={handleSortSites} />
          </div>

          {isLoading ? (
            <div className="sites-section__loading">
              <Loader variant={LVariant.DOTS} size={LSize.LG} />
            </div>
          ) : sitesCrop?.length === 0 ? (
            <div className="sites-section__empty">
              <p>{mainPageMessages.sitesSection.empty}</p>
            </div>
          ) : (
            <div className="sites-section__grid">
              {sitesCrop?.map((site) => (
                <div
                  key={site.id}
                  className="site-card"
                  onClick={() => navigate(`/sites/${site.id}`)}
                >
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
                        {site.published
                          ? mainPageMessages.sitesSection.status.live
                          : mainPageMessages.sitesSection.status.draft}
                      </span>
                    </div>
                  </div>

                  <div className="site-card__actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSite({ id: site.id, title: site.title });
                        setOpenDialog(true);
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
