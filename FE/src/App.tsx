import { Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import {
  Login,
  MainPage,
  NewSite,
  NotFound,
  Profile,
  Signup,
  Site,
  SitesList,
} from '@/pages';
import { MainLayout, ProtectedLayout } from '@/layouts';
import { ErrorBoundary } from '@/components';
import { messages } from '@/locales';
import { Loader, LVariant, LSize } from '@/ui';

function App() {
  return (
    <ErrorBoundary fallback={<div>{messages.fallbackError}</div>}>
      <Suspense
        fallback={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh',
            }}
          >
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
                <Route path=":siteId" element={<Site />} />
                <Route path="new" element={<NewSite />} />
              </Route>
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
