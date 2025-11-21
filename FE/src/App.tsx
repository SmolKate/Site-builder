import { Route, Routes } from "react-router-dom";
import "./App.css";
import {
  Login,
  MainPage,
  NewSite,
  NotFound,
  Profile,
  Signup,
  Site,
  SitesList,
} from "@pages";
import { Suspense } from "react";
import { ProtectedLayout } from "@layouts";
import { AuthProvider } from "@context";
import { ErrorBoundary, Header } from "@components";

function App() {
  return (
    <ErrorBoundary fallback={<div>App error</div>}>
      <AuthProvider>
        <Header />
        <Suspense fallback={"loading..."}>
          <Routes>
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<MainPage />} />
              <Route path="me" element={<Profile />} />
              <Route path="sites">
                <Route index element={<SitesList />} />
                <Route path=":siteId" element={<Site />} />
                <Route path="new" element={<NewSite />} />
              </Route>
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
            <Route />
          </Routes>
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
