import { lazy } from "react";

export const Login = lazy(() =>
  import("./Login").then((module) => ({
    default: module.Login,
  })),
);
export const MainPage = lazy(() =>
  import("./MainPage").then((module) => ({
    default: module.MainPage,
  })),
);
export const Constructor = lazy(() =>
  import("./Constructor").then((module) => ({
    default: module.Constructor,
  })),
);
export const NotFound = lazy(() =>
  import("./NotFound").then((module) => ({
    default: module.NotFound,
  })),
);
export const Profile = lazy(() =>
  import("./Profile").then((module) => ({
    default: module.Profile,
  })),
);
export const Signup = lazy(() =>
  import("./Signup").then((module) => ({
    default: module.Signup,
  })),
);
export const Site = lazy(() =>
  import("./Site").then((module) => ({
    default: module.Site,
  })),
);
export const SitesList = lazy(() =>
  import("./SitesList").then((module) => ({
    default: module.SitesList,
  })),
);
