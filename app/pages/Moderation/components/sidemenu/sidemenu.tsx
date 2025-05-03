"use client";

import React, { useEffect, useState } from "react";
import "./sidemenu.css";
import LoadingScreen from "../../../../components/loadingscreen/loadingscreen"; // Import Loading Screen Component
import { useRouter } from "next/navigation"; // Next.js Router

const SideMenu = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [adminid, setAdminid] = useState("");

  useEffect(() => {
    // Get adminid from sessionStorage
    const storedAdminId = sessionStorage.getItem("adminid");
    if (storedAdminId) {
      setAdminid(storedAdminId);
    } else {
      // Redirect to login page if no adminid is found
      router.push("/LoginPages/adminlogin");
    }
  }, []);

  const handleNavigation = (page: string) => {
    if (!adminid) return;
    setLoading(true);
    setTimeout(() => {
      router.push(`/pages/Moderation/${adminid}/${page}`);
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      {loading && <LoadingScreen />}
      <div className="sidemenucontainer">
        <button onClick={() => handleNavigation("NewListings")}>
          <img src="/dashhome.svg" alt="Dashboard Icon" /> New Listings
        </button>
        <button onClick={() => handleNavigation("AllListings")}>
          <img src="/dashadd.svg" alt="Add Book Icon" /> All Listings
        </button>
        <button onClick={() => handleNavigation("AllUsers")}>
          <img src="/dashview.svg" alt="View Books Icon" /> View Users
        </button>
        <button onClick={() => handleNavigation("AddModerator")}>
          <img src="/dashbuy.svg" alt="Settings" /> Add Moderator
        </button>
        <button
          onClick={() => {
            sessionStorage.removeItem("adminid"); // Remove admin session
            router.push("/pages/LoginPages/adminlogin"); // Redirect to login
          }}
        >
          <img src="/dashout.svg" alt="Logout Icon" /> Log Out
        </button>
      </div>
    </>
  );
};

export default SideMenu;
