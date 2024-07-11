import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Path } from "./pages/paths";
import { Home } from "./pages/Home";
import { File } from "./pages/File";
import { AppOutlet } from "./components/AppOutlet";

export const Router = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AppOutlet />}>
          <Route path={Path.HOME} element={<Home />} />
          <Route path={Path.FILE} element={<File />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};
