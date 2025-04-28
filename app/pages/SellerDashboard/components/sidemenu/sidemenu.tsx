"use client";

import React, { useState } from "react";
import { useAuth } from "../../../../context/authContext";
import { auth } from "../../../../firebase-config/firebase-config"; // Firebase Auth
import { signOut } from "firebase/auth"; // Firebase SignOut function
import "./sidemenu.css";
import LoadingScreen from "../../../../components/loadingscreen/loadingscreen"; // Import Loading Screen Component
import { useRouter } from "next/navigation"; // Next.js Router

const SideMenu = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!user) return null; // Don't render if user is not logged in

  const handleNavigation = (path: string) => {
    setLoading(true); // Show loading screen
    setTimeout(() => {
      router.push(path); // Navigate after 3 seconds
      setLoading(false); // Hide loading after navigation
    }, 3000);
  };

  const handleLogout = async () => {
    setLoading(true); // Show loading screen before logout
    try {
      await signOut(auth); // Logs out the user
      setTimeout(() => {
        window.location.href = "/"; // Redirect to homepage after logout
        setLoading(false);
      }, 3000);
    } catch (error) {
      setLoading(false);
      console.error("Logout failed:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <>
      {loading && <LoadingScreen />} {/* Show loading screen when loading */}
      <div className="sidemenucontainer">
        <button
          onClick={() =>
            handleNavigation(`/pages/SellerDashboard/${user.uid}/dashboard`)
          }
        >
          <img src="/dashhome.svg" alt="Dashboard Icon" /> Dashboard
        </button>
        <button
          onClick={() =>
            handleNavigation(`/pages/SellerDashboard/${user.uid}/AddBook`)
          }
        >
          <img src="/dashadd.svg" alt="Add Book Icon" /> Add Book
        </button>
        <button
          onClick={() =>
            handleNavigation(`/pages/SellerDashboard/${user.uid}/ViewBook`)
          }
        >
          <img src="/dashview.svg" alt="View Books Icon" /> View Books
        </button>
        <button
          onClick={() =>
            handleNavigation(`/pages/SellerDashboard/${user.uid}/Message`)
          }
        >
          <img src="/dashmessages.svg" alt="Messages Icon" /> Messages
        </button>
        <button
          onClick={() =>
            handleNavigation(`/pages/SellerDashboard/${user.uid}/Settings`)
          }
        >
          <img src="/dashbuy.svg" alt="Settings" /> Settings
        </button>
        <button onClick={() => handleNavigation("/")}>
          <img src="/dashbuy.svg" alt="Buy a Book Icon" /> Buy A Book
        </button>
        <button onClick={handleLogout}>
          <img src="/dashout.svg" alt="Logout Icon" /> Log Out
        </button>
      </div>
    </>
  );
};

export default SideMenu;
