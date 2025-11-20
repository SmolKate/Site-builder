import { Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import {
  Login,
  MainPage,
  NewSite,
  NotFound,
  Profile,
  Signup,
  Site,
  SitesList,
} from "@/pages";
import { ProtectedLayout } from "@/layouts";
import { ErrorBoundary, Header } from "@/components";
import { messages } from "@/locales";

function App() {
  return (
    <ErrorBoundary fallback={<div>{messages.fallbackError}</div>}>
      <Header />
      <Suspense fallback={messages.loading}>
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
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
