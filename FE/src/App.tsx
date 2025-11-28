import { Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import { Login, MainPage, Constructor, NotFound, Profile, Signup, SitesList } from "@/pages";
import { MainLayout, ProtectedLayout, UnauthorizedLayout } from "@/layouts";
import { ErrorBoundary } from "@/components";
import { messages } from "@/locales";
import { Loader } from "@/ui";
import { LSize, LVariant } from "./ui/Loader";

function App() {
  return (
    <ErrorBoundary fallback={<div>{messages.fallbackError}</div>}>
      <Suspense
        fallback={
          <div className="app-loader">
            <Loader variant={LVariant.DOTS} size={LSize.LG} />
          </div>
        }
      >
        <Routes>
          <Route element={<MainLayout />}>
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<MainPage />} />
              <Route path="me" element={<Profile />} />
              <Route path="sites">
                <Route index element={<SitesList />} />
                <Route path=":siteId" element={<Constructor />} />
              </Route>
            </Route>
          </Route>
          <Route element={<UnauthorizedLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
