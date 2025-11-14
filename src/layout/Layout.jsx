import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import FallingSnow from "../components/FallingSnow";

const Layout = () => {
  return (
    <div>
      <div id="snow" className="fixed inset-0">
        <FallingSnow />
      </div>

      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;
