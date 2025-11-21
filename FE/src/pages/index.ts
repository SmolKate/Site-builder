import { lazy } from "react";

export const Login = lazy(() =>
  import("./Login").then((module) => ({
    default: module.Login,
  }))
);
export const MainPage = lazy(() =>
  import("./MainPage/MainPage").then((module) => ({
    default: module.MainPage,
  }))
);
export const NewSite = lazy(() =>
  import("./NewSite/NewSite").then((module) => ({
    default: module.NewSite,
  }))
);
export const NotFound = lazy(() =>
  import("./NotFound/NotFound").then((module) => ({
    default: module.NotFound,
  }))
);
export const Profile = lazy(() =>
  import("./Profile/Profile").then((module) => ({
    default: module.Profile,
  }))
);
export const Signup = lazy(() =>
  import("./Signup/Signup").then((module) => ({
    default: module.Signup,
  }))
);
export const Site = lazy(() =>
  import("./Site/Site").then((module) => ({
    default: module.Site,
  }))
);
export const SitesList = lazy(() =>
  import("./SitesList/SitesList").then((module) => ({
    default: module.SitesList,
  }))
);
