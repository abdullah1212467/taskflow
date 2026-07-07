import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/sidebar.jsx";
import Navbar from "../components/navebar.jsx";

import "../css/dashbordLayout.css";

function DashboardLayout() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="dashboard-layout">

      {/* Overlay (Mobile) */}
      {showSidebar && (
        <div
          className="sidebar-overlay"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={
          showSidebar
            ? "sidebar-wrapper show"
            : "sidebar-wrapper"
        }
      >
        <Sidebar
          setShowSidebar={setShowSidebar}
        />
      </div>

      {/* Main */}
      <div className="dashboard-main">

        <Navbar
          setShowSidebar={setShowSidebar}
        />

        <div className="dashboard-content">

          <Outlet />

        </div>

      </div>

    </div>
  );
}

export default DashboardLayout;