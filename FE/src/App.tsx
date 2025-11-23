import { Route, Routes } from "react-router-dom";
import {
  Login,
  MainPage,
  NewSite,
  NotFound,
  Profile,
  Signup,
  Site,
  SitesList,
} from "./pages";
import { Header } from "./components";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<MainPage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="me" element={<Profile />} />
        <Route path="sites">
          <Route index element={<SitesList />} />
          <Route path=":siteId" element={<Site />} />
          <Route path="new" element={<NewSite />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route />
      </Routes>
    </>
  );
}

export default App;
