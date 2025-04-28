"use client";

import TopMenu from "./components/topmenu/topmenu";
import SideMenu from "./components/sidemenu/sidemenu";
import "./sellerdashboard.css";

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard">
      <TopMenu />
      <div className="belowdash">
        <SideMenu />
        {children}
      </div>
    </div>
  );
}
