import { lazy } from "react";

// import Sidebar from "../components/sidebar/Sidebar";
// import Map from "../components/map/Map";
// import User from "../components/user/User";

const Sidebar = lazy(() => import("../components/sidebar/Sidebar"));
const Map = lazy(() => import("../components/map/Map"));
const User = lazy(() => import("../components/user/User"));

import styles from "./AppLayout.module.css";
import ProtectedRout from "./ProtectedRout";

function AppLayout() {
  return (
    <ProtectedRout>
      <div className={styles.app}>
        <Sidebar />
        <Map />
        <User />
      </div>
    </ProtectedRout>
  );
}

export default AppLayout;
