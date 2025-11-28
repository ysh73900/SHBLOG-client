import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import FallingSnow from "../components/FallingSnow";
import ScrollToTop from "../components/ScrollToTop";

const Layout = () => {
  return (
    <div>
      <div id="snow" className="fixed inset-0">
        <FallingSnow />
      </div>

      <Header />
      <Outlet />

      <ScrollToTop />
    </div>
  );
};

export default Layout;
